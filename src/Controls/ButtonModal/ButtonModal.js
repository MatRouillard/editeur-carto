// import OpenLayers control base and GeoPF utils
import Control from "geopf-extensions-openlayers/src/packages/Controls/Control";
import Widget from "geopf-extensions-openlayers/src/packages/Controls/Widget";
import Logger from "geopf-extensions-openlayers/src/packages/Utils/LoggerByDefault";
import SelectorID from "geopf-extensions-openlayers/src/packages/Utils/SelectorID";
import Utils from "geopf-extensions-openlayers/src/packages/Utils/Helper";

import "../../CSS/Controls/ButtonModal/GPFbuttonModal.scss";

const logger = Logger.getLogger("buttonmodal");

/**
 * @classdesc
 * ButtonModal – minimal modal/dialog launched from a picto button
 * Compatible with GeoPF control patterns (initialize / _initContainer split)
 * 
 * @constructor
 * @extends {ol.control.Control}
 * @alias ol.control.ButtonModal
 * @type {ol.control.ButtonModal}
 * @param {Object}  options
 * @param {String} [options.id]               - custom id suffix
 * @param {Boolean}[options.collapsed=true]   - start collapsed (dialog closed)
 * @param {String} [options.title="Modal"]   - dialog title (aria‑label & heading)
 * @param {HTMLElement|String} [options.dialogElement] - initial dialog content
 * @param {String[]} [options.buttonClasses]  - extra classes on main button
 *
 * @extends {ol.control.Control}
 */
class ButtonModal extends Control {
  /**
   */
  constructor(options) {
    options = options || {};

    super(options);

    if (!(this instanceof ButtonModal)) {
      throw new TypeError("ERROR CLASS_CONSTRUCTOR");
    }

    /**
     * Nom de la classe
     * @private
     */
    this.CLASSNAME = "ButtonModal";

    // split logic like other GeoPF controls
    this.initialize(options);

    /** Main container */
    this.container = this._initContainer(options);

    // ajout du container
    (this.element) ? this.element.appendChild(this.container) : this.element = this.container;

    return this;
  }

  // ################################################################### //
  // ##################### init component ############################## //
  // ################################################################### //

  /**
  * Add uuid to the tag ID
  * @param {String} id - id selector
  * @returns {String} uid - id selector with an unique id
  */
  _addUID(id) {
    return this._uid ? `${id}-${this._uid}` : id;
  }

  /**
   * Merge defaults, generate UID, store basic state.
   * @param {Object} options
   * @private
   */
  initialize(options) {
    // default options
    this.options = {
      id: "",
      collapsed: true,
      draggable: false,
      dialogElement: null,
      buttonClasses: [],
    };

    // merge
    Utils.assign(this.options, options);

    // collapsed state
    this.collapsed = this.options.collapsed; // default true

    // UID for CSS ids
    this._uid = this.options.id || SelectorID.generate();

    // storage
    this._listeners = {};
  }

  /** Create the full control DOM */
  _initContainer() {
    // create main container
    const container = this._createMainContainerElement();

    // picto button
    const button = this._showButton = this._createShowButton();
    container.appendChild(button);

    // dialog body wrapper
    const dialog = this._dialog = this._createDialogElement();
    container.appendChild(dialog);

    logger.log(container);

    return container;
  }

  // ################################################################### //
  // ############## public methods (getters, setters) ################## //
  // ################################################################### //

  /**
   * Returns true if widget is collapsed (minimized), false otherwise
   *
   * @returns {Boolean} collapsed - true if widget is collapsed
   */
  getCollapsed() {
    return this.collapsed;
  }

  /**
   * Collapse or display widget main container
   *
   * @param {Boolean} collapsed - True to collapse widget, False to display it
   */
  setCollapsed(collapsed) {
    if (collapsed === undefined) {
      logger.log("[ERROR] ButtonModal:setCollapsed - missing collapsed parameter");
      return;
    }
    if ((collapsed && this.collapsed) || (!collapsed && !this.collapsed)) {
      return;
    }
    if (collapsed) {
      this._closeButton.click();
    } else {
      this._showButton.click();
    }
    this.collapsed = collapsed;
  }

  /**
   * Get container
   *
   * @returns {DOMElement} container
   */
  getContainer() {
    return this.container;
  }

  /**
   * Get dialog
   *
   * @returns {HTMLElement} dialog
   */
  getDialogElement() {
    return this.dialogContent;
  }

  /**
   * Set dialog element
   *
   * @param {string|HTMLElement} element dialog element
   */
  setDialogElement(element) {
    if (!this.dialogContent) return;
    this.dialogContent.innerHTML = "";
    if (typeof element === "string") {
      this.dialogContent.innerHTML = element;
    } else if (element instanceof HTMLElement) {
      this.dialogContent.appendChild(element);
    }
  }

  /**
   * Overwrite OpenLayers setMap method
   *
   * @param {ol.Map} map - Map.
   */
  setMap(map) {
    if (map) {
      // mode "collapsed"
      if (!this.collapsed) {
        this._showButton.setAttribute("aria-pressed", true);
      }
    }

    // on appelle la méthode setMap originale d'OpenLayers
    super.setMap(map);

    // position
    if (this.options.position) {
      this.setPosition(this.options.position);
    }

    // reunion du bouton avec le précédent
    if (this.options.gutter === false) {
      this.getContainer().classList.add("gpf-button-no-gutter");
    }
  }

  // ################################################################### //
  // ######################### DOM ELEMENT ############################# //
  // ################################################################### //

  /** Main wrapper */
  _createMainContainerElement() {
    const div = document.createElement("div");
    div.id = this._addUID("GPbuttonModal");
    div.className = "GPwidget gpf-widget gpf-widget-button gpf-mobile-fullscreen gpf-button-no-gutter";
    return div;
  }

  /** Picto trigger */
  _createShowButton() {
    const self = this;

    const button = document.createElement("button");

    // Fix Chromium 6px margin issue
    const span = document.createElement("span");
    button.appendChild(span);

    button.id = this._addUID("GPbuttonModalPicto");
    button.className = [
      "GPshowOpen",
      "GPshowAdvancedToolPicto",
      "GPbuttonModalPicto",
      "gpf-btn",
      "gpf-btn--tertiary",
      "gpf-btn-icon",
      "fr-btn",
      "fr-btn--tertiary",
      ...(this.options.buttonClasses || [])
    ].join(" ");

    button.setAttribute("aria-label", this.options.ariaLabel || "Ouvrir le panneau");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-pressed", false);
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-expanded", String(!this.collapsed));
    button.setAttribute("type", "button");

    // Event listener
    if (button.addEventListener) {
      button.addEventListener("click", function (e) {
        const status = e.target.getAttribute("aria-pressed") === "true";
        e.target.setAttribute("aria-pressed", String(!status));
        self.onPictoClick(e);
      });
    } else if (button.attachEvent) {
      button.attachEvent("onclick", function (e) {
        const status = e.target.getAttribute("aria-pressed") === "true";
        e.target.setAttribute("aria-pressed", String(!status));
        self.onPictoClick(e);
      });
    }

    return button;

  }

  /** Create a simple modal dialog */
  _createDialogElement() {
    let self = this;

    const dialog = document.createElement("dialog");
    dialog.id = this._addUID("GPbuttonModalPanel");
    dialog.className = "GPpanel gpf-panel fr-modal";

    // ARIA attributes
    dialog.setAttribute("aria-modal", "false");
    dialog.setAttribute("aria-labelledby", this._addUID("GPbuttonModalTitle"));

    // body container (user content will go here)
    let dialogBody = document.createElement("div");
    dialogBody.className = "gpf-panel__body fr-modal__body";

    dialog.appendChild(dialogBody);

    if (this.options.title) {
      const title = this._dialogTitle = this._createDialogTitle(this.options.title);
      header.appendChild(title);
    }

    if (this.options.closable === true) {
      // header (optional)
      const header = document.createElement("div");
      header.className = "GPpanelHeader gpf-panel__header fr-modal__header";
      const divClose = this._closeButton = this._createCloseButton();
      header.appendChild(divClose);
      dialogBody.appendChild(header);
      
    }
    // body container (user content will go here)
    this.dialogContent = document.createElement("div");
    this.dialogContent.className = "gpf-panel__body fr-modal__body";

    // initial content (if any)
    if (this.options.dialogElement) {
      this.setDialogElement(this.options.dialogElement);
    }

    // Compose dialog
    dialogBody.appendChild(this.dialogContent);
    return dialog;
  }

  _createCloseButton() {
    let self = this;

    let divClose = document.createElement("button");
    divClose.id = this._addUID("GPbuttonModalClose");
    divClose.className = "GPpanelClose GPbuttonModalClose gpf-btn gpf-btn-icon-close fr-btn--close fr-btn fr-btn--tertiary-no-outline fr-m-1w";
    divClose.title = "Fermer";

    divClose.addEventListener("click", function () {
      self._showButton.click();
    }, false);
    divClose.addEventListener("keydown", function (event) {
      if (event.keyCode === 13) {
        self._showButton.click();
      }
    }, false);
    return divClose
  }

  _createDialogTitle(title) {
    let h2 = document.createElement("div");
    h2.id = this._addUID("GPbuttonModalTitle");
    h2.className = "GPpanelTitle gpf-panel__title fr-modal__title fr-pt-4w";
    h2.textContent = title;
    return h2;
  }

  onPictoClick(e) {
    if (e.target.ariaPressed === "true") {
      this.onPanelOpen();
    }
    var map = this.getMap();
    if (!map) {
      return;
    }
    var opened = this._showButton.ariaPressed;
    this.collapsed = !(opened === "true");
    // info : on génère nous même l'evenement OpenLayers de changement de propriété
    // (utiliser ol.control.ButtonModal.on("change:collapsed", function ) pour s'abonner à cet évènement)
    this.dispatchEvent("change:collapsed");

    // on recalcule la position
    if (this.options.position && !this.collapsed) {
      this.updatePosition(this.options.position);
    }
  }
}

Object.assign(ButtonModal.prototype, Widget);

export default ButtonModal;

// Expose ButtonModal as ol.control.ButtonModal (for a build bundle)
if (window.ol && window.ol.control) {
  window.ol.control.ButtonModal = ButtonModal;
}

