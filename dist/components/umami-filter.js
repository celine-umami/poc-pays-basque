import { LitElement, html, css } from "https://esm.sh/lit@3";
import { ContextConsumer } from "https://esm.sh/@lit/context@1";
import { umamiContext } from "./umami-context.js";

/**
 * <umami-filter>
 *
 * Filtre "select" pour affiner un <umami-context> : liste les valeurs
 * distinctes d'un champ (ex: region) et, à la sélection, pousse le filtre
 * dans le contexte via `setFilter(field, value)`. Tous les autres
 * consommateurs du même contexte (umami-aggregation, umami-chart, ...)
 * reçoivent alors un `where` mis à jour et se rechargent automatiquement.
 *
 * Doit être placé à l'intérieur d'un <umami-context>, comme
 * <umami-aggregation>. L'attribut "context" choisit lequel consommer.
 */
class UmamiFilter extends LitElement {

    static properties = {
        field: { type: String },
        label: { type: String },
        _options: { state: true },
        _selected: { state: true },
        _error: { state: true },
    };

    static styles = css`
        :host { display: inline-block; font-family: Arial, sans-serif; }
        label { display: block; margin-bottom: 6px; color: #666; font-size: 14px; }
        select {
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #ccc;
            min-width: 200px;
            font-size: 14px;
            background: white;
        }
        select.error { border-color: red; }
        .error-message { color: red; font-size: 12px; margin-top: 4px; }
    `;

    constructor() {
        super();

        this._options = [];
        this._selected = "";
        this._error = "";

        this._context = new ContextConsumer(this, {
            context: umamiContext(this.getAttribute("context") || ""),
            subscribe: true,
            callback: () => this.load(),
        });
    }

    updated(changedProperties) {
        if (changedProperties.has("field")) this.load();
    }

    async load() {
        const domain = this._context.value?.domain;
        const dataset = this._context.value?.dataset;

        if (!domain || !dataset || !this.field) return;

        try {
            const url = new URL(
                `https://${domain}/api/explore/v2.1/catalog/datasets/${dataset}/records`
            );

            // group_by isole les valeurs distinctes du champ, comme une
            // facette : c'est ce qui remplit la liste du <select>.
            url.searchParams.set("select", this.field);
            url.searchParams.set("group_by", this.field);
            url.searchParams.set("order_by", this.field);
            url.searchParams.set("limit", "100");

            const response = await fetch(url);
            const json = await response.json();
            if (!response.ok) throw new Error(json?.message || response.statusText);

            this._options = (json.results ?? [])
                .map((row) => row[this.field])
                .filter((value) => value !== null && value !== undefined && value !== "");
            this._error = "";
        }
        catch (error) {
            this._options = [];
            this._error = error.message;
        }
    }

    _onChange(event) {
        this._selected = event.target.value;
        this._context.value?.setFilter?.(this.field, this._selected);

        this.dispatchEvent(
            new CustomEvent("filter-change", { detail: { field: this.field, value: this._selected } })
        );
    }

    render() {
        return html`
            <label>${this.label || this.field}</label>
            <select class="${this._error ? "error" : ""}" .value=${this._selected} @change=${this._onChange}>
                <option value="">Tous</option>
                ${this._options.map((option) => html`<option value=${option}>${option}</option>`)}
            </select>
            ${this._error ? html`<div class="error-message">${this._error}</div>` : ""}
        `;
    }
}

customElements.define("umami-filter", UmamiFilter);
