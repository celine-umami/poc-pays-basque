import { LitElement, html, css } from "https://esm.sh/lit@3";
import { ContextConsumer } from "https://esm.sh/@lit/context@1";
import { umamiContext } from "./umami-context.js";

/**
 * <umami-aggregation>
 *
 * Réécriture Lit du composant vanilla d'origine, même rendu et même
 * événement "aggregation-change".
 *
 * Doit être placé à l'intérieur d'un <umami-context> : domain, dataset et
 * where ne sont plus des attributs locaux, ils viennent exclusivement du
 * <umami-context> ancêtre. L'attribut "context" permet de choisir lequel
 * consommer quand le <umami-context> en fournit plusieurs (ex:
 * context="ctx" pour lire ctx-domain / ctx-dataset).
 */
class UmamiAggregation extends LitElement {

    static properties = {
        field: { type: String },
        operation: { type: String },
        _value: { state: true },
        _label: { state: true },
        _error: { state: true },
    };

    static styles = css`
        :host { display: inline-block; font-family: Arial, sans-serif; }
        .card { padding: 20px; border-radius: 8px; background: #f5f5f5; min-width: 250px; }
        .value { font-size: 40px; font-weight: bold; }
        .value.error { color: red; }
        .label { color: #666; margin-top: 8px; }
    `;

    constructor() {
        super();

        this.operation = "count";
        this._value = "Chargement...";
        this._label = "";
        this._error = false;

        // S'abonne au <umami-context> ancêtre correspondant au nom donné
        // par l'attribut "context" (celui par défaut, sans nom, si absent).
        // subscribe:true veut dire qu'on est notifié -- et qu'on relance le
        // chargement -- chaque fois que le contexte change (ex: son
        // dataset est modifié dynamiquement).
        this._context = new ContextConsumer(this, {
            context: umamiContext(this.getAttribute("context") || ""),
            subscribe: true,
            callback: () => this.load(),
        });
    }

    updated(changedProperties) {
        const triggers = ["field", "operation"];
        if (triggers.some((prop) => changedProperties.has(prop))) {
            this.load();
        }
    }

    async load() {
        const domain = this._context.value?.domain;
        const dataset = this._context.value?.dataset;

        if (!domain || !dataset) {
            // Pas encore de domaine/dataset disponible (par ex. le
            // umami-context ancêtre n'a pas encore fourni sa valeur) :
            // on attend la prochaine notification plutôt que de faire un
            // appel voué à échouer.
            return;
        }

        try {
            const url = new URL(
                `https://${domain}/api/explore/v2.1/catalog/datasets/${dataset}/records`
            );

            let select;
            switch (this.operation) {
                case "count": select = "count(*) as value"; break;
                case "sum": select = `sum(${this.field}) as value`; break;
                case "avg": select = `avg(${this.field}) as value`; break;
                case "min": select = `min(${this.field}) as value`; break;
                case "max": select = `max(${this.field}) as value`; break;
                default: throw new Error("Operation inconnue");
            }

            url.searchParams.set("select", select);
            url.searchParams.set("limit", "1");

            const where = this._context.value?.where;
            if (where) url.searchParams.set("where", where);

            const response = await fetch(url);
            const json = await response.json();
            if (!response.ok) throw new Error(json?.message || response.statusText);

            const result = json.results?.[0]?.value;

            this._value = new Intl.NumberFormat("fr-FR").format(result ?? 0);
            this._label = `${this.operation}(${this.field || "*"})`;
            this._error = false;

            this.dispatchEvent(
                new CustomEvent("aggregation-change", { detail: { value: result } })
            );
        }
        catch (error) {
            this._value = "Erreur";
            this._label = error.message;
            this._error = true;
        }
    }

    render() {
        return html`
            <div class="card">
                <div class="value ${this._error ? "error" : ""}">${this._value}</div>
                <div class="label">${this._label}</div>
            </div>
        `;
    }
}

customElements.define("umami-aggregation", UmamiAggregation);