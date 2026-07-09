import { LitElement, html, css } from "https://esm.sh/lit@3";
import { createContext, ContextProvider } from "https://esm.sh/@lit/context@1";

/**
 * Registre partagé des contextes Lit, un par nom.
 *
 * On veut pouvoir déclarer plusieurs contextes indépendants sous un même
 * <umami-context> (ex: "ctx" et "ctx1", chacun avec son propre
 * domain/dataset/where). Comme un Context Lit doit être un objet stable
 * (même référence) pour que Provider et Consumer se retrouvent, on met en
 * cache un Context par nom ici. umami-context.js et umami-aggregation.js
 * importent tous les deux cette fonction, donc ils partagent le même cache.
 */
const registry = new Map();

export function umamiContext(name = "") {
    if (!registry.has(name)) {
        registry.set(name, createContext(Symbol(`umami-context:${name || "default"}`)));
    }
    return registry.get(name);
}

/**
 * <umami-context>
 *
 * Fournit domain/dataset/where à ses <umami-aggregation> descendants, pour
 * éviter de répéter ces attributs sur chacun d'eux.
 *
 * - context="ctx,ctx1" déclare les noms des contextes fournis (un seul par
 *   défaut, sans nom, si l'attribut est absent).
 * - Pour chaque nom, les valeurs sont lues sur les attributs préfixés :
 *   ctx-domain, ctx-dataset, ctx-where, ctx1-domain, etc. Sans préfixe
 *   (domain, dataset, where) quand un seul contexte non nommé est utilisé.
 * - Un <umami-aggregation context="ctx"> consomme le contexte "ctx".
 *
 * La valeur fournie contient aussi `setFilter(field, value)` : c'est ce
 * qu'appelle un <umami-filter> pour affiner le contexte (ex: region="Sud").
 * Le `where` distribué aux consommateurs est alors la combinaison du
 * `where` statique posé en attribut et de tous les filtres actifs.
 */
class UmamiContext extends LitElement {

    static properties = {
        context: { type: String },
    };

    static styles = css`
        :host { display: contents; }
    `;

    constructor() {
        super();
        this.context = "";
        this._providers = new Map();
        // Filtres actifs par contexte : name -> Map(field -> value).
        this._filters = new Map();
    }

    connectedCallback() {
        super.connectedCallback();
        this._sync();

        // Les attributs préfixés (ctx-domain, ctx1-dataset, ...) ne sont pas
        // des propriétés Lit connues à l'avance : on ne peut pas les
        // déclarer dans `static properties`. On observe donc directement
        // les attributs de l'élément pour répercuter leurs changements sur
        // les contextes fournis.
        this._observer = new MutationObserver(() => this._sync());
        this._observer.observe(this, { attributes: true });
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this._observer?.disconnect();
    }

    _names() {
        const names = (this.context || "")
            .split(",")
            .map((name) => name.trim())
            .filter(Boolean);
        return names.length ? names : [""];
    }

    _valueFor(name) {
        const prefix = name ? `${name}-` : "";
        return {
            domain: this.getAttribute(`${prefix}domain`) || undefined,
            dataset: this.getAttribute(`${prefix}dataset`) || undefined,
            where: this._whereFor(name, prefix),
            setFilter: (field, value) => this._setFilter(name, field, value),
        };
    }

    // Combine le where statique (attribut) avec les filtres dynamiques
    // posés par des <umami-filter> sur ce même contexte, joints par "and".
    _whereFor(name, prefix) {
        const clauses = [];

        const staticWhere = this.getAttribute(`${prefix}where`);
        if (staticWhere) clauses.push(staticWhere);

        const filters = this._filters.get(name);
        if (filters) {
            for (const [field, value] of filters) {
                if (value) clauses.push(`${field}="${value}"`);
            }
        }

        return clauses.length ? clauses.join(" and ") : undefined;
    }

    _setFilter(name, field, value) {
        if (!this._filters.has(name)) this._filters.set(name, new Map());
        const filters = this._filters.get(name);

        if (value) filters.set(field, value);
        else filters.delete(field);

        this._sync(name);
    }

    // Sans argument : (re)synchronise tous les contextes déclarés (attributs
    // changés, premier rendu). Avec un nom : ne notifie que ce contexte-là
    // (ex: un <umami-filter> vient d'affiner sa recherche).
    _sync(only) {
        for (const name of this._names()) {
            if (only !== undefined && name !== only) continue;

            const value = this._valueFor(name);
            const provider = this._providers.get(name);
            if (provider) {
                provider.setValue(value);
            }
            else {
                this._providers.set(
                    name,
                    new ContextProvider(this, { context: umamiContext(name), initialValue: value })
                );
            }
        }
    }

    render() {
        return html`<slot></slot>`;
    }
}

customElements.define("umami-context", UmamiContext);
