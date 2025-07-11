// Import des fichiers CSS
import './import_css.js'
import './import.js'
import ButtonModal from './Controls//ButtonModal/ButtonModal';

import content from './Pages/save_map.html?raw'


import Carte from 'mcutils/Carte';
import Bar from "ol-ext/control/Bar";
import Button from "ol-ext/control/Button";
import ButtonText from "ol-ext/control/TextButton";

// import testCarte from './assets/template.carte';
import {
  GeoportalZoom,
  LayerSwitcher,
  SearchEngine,
} from "geopf-extensions-openlayers";
import ScaleLine from 'ol/control/ScaleLine.js';

const gppKey = 'k1RSRVIYRxteMEcPK9A5c7g0C6KRw4KX';
const carte = new Carte({
  target: 'map',
  key: gppKey
})

// const response = await fetch('/carte/template.carte');
// const testCarte = await response.json();

// carte.read(testCarte);

fetch(import.meta.env.BASE_URL + 'carte/template.carte')
  .then(res => res.json())
  .then(data => {
    carte.read(data);
  })
  .catch(err => {
    console.error(err);
  });


const keyToExcludes = [
  'dialog',
  // 'attribution',
  // 'layerSwitcher',
  'permalink',
]

Carte.prototype.removeControl = function (name) {
  if (this._controls[name]) {
    this.map.removeControl(this._controls[name])
  }
};

Carte.prototype.addControl = function (controlName, control) {
  if (!this._controls[controlName]) {
    this._controls[controlName] = control;
    this.map.addControl(this._controls[controlName]);
  } else {
    throw new Error("Un contrôle du même nom existe déjà");
  }
};

Carte.prototype.removeAllControl = function () {
  for (const key in this._controls) {
    const ctrl = this._controls[key];
    if (!keyToExcludes.includes(key)) {
      this.map.removeControl(ctrl);
      delete this._controls[key];
    }
  }
};

const controls = {
  "layerSwitcher": new LayerSwitcher({
    options: {
      position: "top-right",
      collapsed: true,
      panel: true,
      counter: true,
      allowEdit: true
    }
  }),
  "search": new SearchEngine({
    collapsed: true,
    collapsible: true,
    position: 'center'
  }),
  'zoom': new GeoportalZoom({
    position: "bottom-right"
  }),
  'scaleLine': new ScaleLine({})
}

carte.on('read', () => {
  carte.removeAllControl();

  Object.keys(controls).forEach(key => {
    try {
      carte.addControl(key, controls[key])
    } catch (error) {
      console.error(error)
    }
  });
  const dialogControl = new ButtonModal({
    position: 'top-left',
    // closable: true,
    buttonClasses: ['gpf-btn-icon-map-modal'],
    dialogElement: content,
  });

  carte.addControl('popover', dialogControl);
})

/* DEBUG */
window.carte = carte
/**/