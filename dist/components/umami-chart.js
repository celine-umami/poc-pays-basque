import { LitElement, html, css } from "https://esm.sh/lit@3";
import { ContextConsumer } from "https://esm.sh/@lit/context@1";
import { Chart } from "https://esm.sh/chart.js@4/auto";
import { umamiContext } from "./umami-context.js";

/**
 * <umami-chart>
 *
 * Graphique auto-alimenté par un <umami-context>, dans l'esprit d'un
 * <ods-chart> mais sans les balises enfants type <ods-chart-query> :
 * un seul élément avec type/x/y suffit, la requête est construite en
 * interne (group_by=x, agg(y), where issu du contexte).
 *
 * Doit être placé à l'intérieur d'un <umami-context>. L'attribut
 * "context" choisit lequel consommer, et se met à jour automatiquement
 * quand un <umami-filter> du même contexte change (subscribe:true).
 *
 * Attributs :
 * - type      : type Chart.js ("line", "bar", "pie", ...). Défaut "line".
 * - x         : champ utilisé pour l'axe des abscisses (group_by).
 * - y         : champ agrégé pour l'axe des ordonnées.
 * - operation : agrégation appliquée à y ("sum", "avg", "count", "min",
 *               "max"). Défaut "sum".
 * - limit     : nombre de points maximum. Défaut 50.
 */
class UmamiChart extends LitElement {

    static properties = {
        type: { type: String },
        x: { type: String },
        y: { type: String },
        operation: { type: String },
        limit: { type: Number },
        _error: { state: true },
    };

    static styles = css`
        :host { display: block; font-family: Arial, sans-serif; }
        .card { padding: 20px; border-radius: 8px; background: #f5f5f5; }
        .error { color: red; margin-bottom: 12px; }
        canvas { max-width: 100%; }
    `;

    constructor() {
        super();

        this.type = "line";
        this.operation = "sum";
        this.limit = 50;
        this._error = "";
        this._chart = null;

        this._context = new ContextConsumer(this, {
            context: umamiContext(this.getAttribute("context") || ""),
            subscribe: true,
            callback: () => this.load(),
        });
    }

    updated(changedProperties) {
        // Un changement de type impose de recréer le graphique (Chart.js
        // ne permet pas de changer le type d'une instance existante).
        if (changedProperties.has("type") && this._chart) {
            this._chart.destroy();
            this._chart = null;
        }

        const triggers = ["type", "x", "y", "operation", "limit"];
        if (triggers.some((prop) => changedProperties.has(prop))) this.load();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._chart?.destroy();
        this._chart = null;
    }

    async load() {
        const domain = this._context.value?.domain;
        const dataset = this._context.value?.dataset;

        if (!domain || !dataset || !this.x || !this.y) return;

        try {
            const url = new URL(
                `https://${domain}/api/explore/v2.1/catalog/datasets/${dataset}/records`
            );

            url.searchParams.set("select", `${this.x}, ${this.operation}(${this.y}) as ${this.y}`);
            url.searchParams.set("group_by", this.x);
            url.searchParams.set("order_by", this.x);
            url.searchParams.set("limit", String(this.limit));

            const where = this._context.value?.where;
            if (where) url.searchParams.set("where", where);

            const response = await fetch(url);
            const json = await response.json();
            if (!response.ok) throw new Error(json?.message || response.statusText);

            const rows = json.results ?? [];

            this._error = "";
            this._draw(rows.map((row) => row[this.x]), rows.map((row) => row[this.y]));
        }
        catch (error) {
            this._error = error.message;
        }
    }

    _draw(labels, values) {
        const canvas = this.renderRoot.querySelector("canvas");
        if (!canvas) return;

        if (this._chart) {
            this._chart.data.labels = labels;
            this._chart.data.datasets[0].data = values;
            this._chart.data.datasets[0].label = `${this.operation}(${this.y})`;
            this._chart.update();
            return;
        }

        this._chart = new Chart(canvas, {
            type: this.type,
            data: {
                labels,
                datasets: [{
                    label: `${this.operation}(${this.y})`,
                    data: values,
                    borderColor: "#2c7be5",
                    backgroundColor: "rgba(44, 123, 229, 0.4)",
                }],
            },
            options: {
                responsive: true,
                plugins: { legend: { display: true } },
            },
        });
    }

    render() {
        return html`
            <div class="card">
                ${this._error ? html`<div class="error">${this._error}</div>` : ""}
                <canvas></canvas>
            </div>
        `;
    }
}

customElements.define("umami-chart", UmamiChart);
