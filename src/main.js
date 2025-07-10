// Import des fichiers CSS
import './import_css.js'
import './import.js'


import Carte from 'mcutils/Carte';
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

fetch('/carte/template.carte')
  .then(res => res.json())
  .then(data => {
    carte.read(data);
  })
  .catch(err => {
    console.error('Erreur lors du chargement du fichier .carte :', err);
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
      console.log(key, ctrl)
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
  'search': new SearchEngine({
    collapsed: true,
    collapsible: true,
    position:'center'
  }),
  'zoom': new GeoportalZoom({
    position: "bottom-right"
  }),
  'scaleLine': new ScaleLine({})
}


carte.on('read', () => {
  console.log('read')
  carte.removeAllControl();

  Object.keys(controls).forEach(key => {
    try {
      carte.addControl(key, controls[key])
    } catch (error) {
      console.error(error)
    }
  })
  
})

// // Download
// import FileSaver from 'file-saver'

// import Geoportail from 'ol-ext/layer/Geoportail'

// // Contrôles extensions géoplateforme
// import Catalog from 'geopf-extensions-openlayers/src/packages/Controls/Catalog/Catalog';
// import ContextMenu from 'geopf-extensions-openlayers/src/packages/Controls/ContextMenu/ContextMenu';
// import ControlList from 'geopf-extensions-openlayers/src/packages/Controls/ControlList/ControlList';
// import GeoportalAttribution from 'geopf-extensions-openlayers/src/packages/Controls/Attribution/GeoportalAttribution';
// import GeoportalFullScreen from 'geopf-extensions-openlayers/src/packages/Controls/FullScreen/GeoportalFullScreen';
// import GeoportalOverviewMap from 'geopf-extensions-openlayers/src/packages/Controls/OverviewMap/GeoportalOverviewMap';
// import Isocurve from 'geopf-extensions-openlayers/src/packages/Controls/Isocurve/Isocurve';
// import LayerImport from 'geopf-extensions-openlayers/src/packages/Controls/LayerImport/LayerImport';
// import Legends from 'geopf-extensions-openlayers/src/packages/Controls/Legends/Legends';
// import MeasureArea from 'geopf-extensions-openlayers/src/packages/Controls/Measures/MeasureArea';
// import MeasureAzimuth from 'geopf-extensions-openlayers/src/packages/Controls/Measures/MeasureAzimuth';
// import MeasureLength from 'geopf-extensions-openlayers/src/packages/Controls/Measures/MeasureLength';
// import GeoportalMousePosition from 'geopf-extensions-openlayers/src/packages/Controls/MousePosition/MousePosition';
// import ReverseGeocode from 'geopf-extensions-openlayers/src/packages/Controls/ReverseGeocode/ReverseGeocode';
// import Route from 'geopf-extensions-openlayers/src/packages/Controls/Route/Route';
// import Territories from 'geopf-extensions-openlayers/src/packages/Controls/Territories/Territories';
// import ControlList from 'geopf-extensions-openlayers/src/packages/Controls/ControlList/ControlList';
// import GeoportalZoom from 'geopf-extensions-openlayers/src/packages/Controls/Zoom/GeoportalZoom';

// import Gp from "geoportal-access-lib";

// // Custom controls
// import Drawing from './Controls/Drawing/Drawing'
// import GetFeatureInfo from './Controls/GetFeatureInfo/GetFeatureInfo'
// import LayerSwitcherDSFR from './Controls/LayerSwitcher/LayerSwitcher'

// // mcutils / ol-ext
// import Carte from 'mcutils/Carte';
// import VectorStyle from 'mcutils/layer/VectorStyle';
// import Geoportail from 'ol-ext/layer/Geoportail'

// import ol_ext_element from 'ol-ext/util/element'

// // Carte
// // import testCarte from './assets/carte/sources.carte'
// // import testCarte from './assets/carte/test.carte'
// // import testCarte from './assets/carte/attributes.carte'
// import testCarte from './assets/carte/sans_attribut.carte'

// // Gestion des contrôles sur la page
// import {addMenuListener, addAccordeonListener} from './control.js'

// let config = new Gp.Services.Config({
//   customConfigFile: "https://raw.githubusercontent.com/IGNF/geoportal-configuration/new-url/dist/fullConfig.json",
//   onSuccess: (e) => {
//     console.log(e);
//   },
//   onFailure: (e) => {
//     console.error(e);
//   }
// });
// config.call();


// // Add isVisible function
// VectorStyle.prototype.isVisible = function (view) {
//   switch (this.getMode()) {
//     case 'cluster': return this.layerCluster_.isVisible(view);
//     case 'image': return this.layerImage_.isVisible(view);
//     default: return this.layerVector_.isVisible(view);
//   }

// }


// const gppKey = 'k1RSRVIYRxteMEcPK9A5c7g0C6KRw4KX';

const options = {
  "type": "Geoportail",
  "name": "Plan IGN",
  "titre": "sans-titre",
  "visibility": true,
  "opacity": 1,
  "description": "Cartographie multi-échelles sur le territoire national, issue des bases de données vecteur de l’IGN, mis à jour régulièrement et réalisée selon un processus entièrement automatisé. Version actuellement en beta test",
  "layer": "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2"
};


// const geoportail = new Geoportail({
//   layer: options.layer,
//   preload: 10
// });

// const carte = new Carte({
//   target: 'map',
//   key: gppKey
// })

// carte.read(testCarte)

// let mapControls = {
//   Catalog: new Catalog({
//     position: "bottom-left",
//     listable: true,
//   }),
//   // ContextMenu: new ContextMenu({
//   //   position: "bottom-right"
//   // }),
//   Drawing: new Drawing({
//     position:"top-right",
//     defaultStyles: {},
//     cursorStyle: {},
//     tools: {
//       points: true,
//       lines: true,
//       polygons: true,
//       holes: true,
//       text: true,
//       remove: true,
//       display: true,
//       tooltip: true,
//       export: true,
//       measure: true
//     }
//   }),
//   GetFeatureInfo: new GetFeatureInfo({
//     position: "bottom-left",
//     listable: true,
//   }),
//   GeoportalAttribution: new GeoportalAttribution({
//     position: "bottom-left",
//     listable: true,
//   }),
//   GeoportalFullScreen: new GeoportalFullScreen({
//     position: "bottom-left",
//     listable: true,
//   }),
//   GeoportalOverviewMap: new GeoportalOverviewMap({
//     position: "bottom-left",
//     listable: true,
//   }),
//   GeoportalZoom: new GeoportalZoom({
//     position: "bottom-left",
//     listable: true,
//   }),
//   Isocurve: new Isocurve({
//     position: "bottom-left",
//     listable: true,
//   }),
//   LayerImport: new LayerImport({
//     position: "bottom-left",
//     listable: true,
//   }),
//   LayerSwitcherDSFR: new LayerSwitcherDSFR({
//     options: {
//       position: "top-left",
//       collapsed: false,
//       panel: true,
//       counter: true,
//       allowEdit: true
//     }
//   }),
//   Legends: new Legends({
//     position: "bottom-left",
//     listable: true,
//   }),
//   MeasureArea: new MeasureArea({
//     position: "bottom-left",
//     listable: true,
//   }),
//   MeasureAzimuth: new MeasureAzimuth({
//     position: "bottom-left",
//     listable: true,
//   }),
//   MeasureLength: new MeasureLength({
//     position: "bottom-left",
//     listable: true,
//   }),
//   GeoportalMousePosition: new GeoportalMousePosition({
//     position: "bottom-left",
//     listable: true,
//   }),
//   ReverseGeocode: new ReverseGeocode({
//     position: "bottom-left",
//     listable: true,
//   }),
//   Route: new Route({
//     position: "bottom-left",
//     listable: true,
//   }),
//   Territories: new Territories({
//     position: "top-right",
//     listable: true,
//   }),
// }

// let mapControlArray = []
// Object.keys(mapControls).forEach(key => {
//   mapControlArray.push(mapControls[key])
// })

// const controlList = new ControlList({
//   position: "top-left",
//   controls: mapControlArray,
// })

// carte.on('read', () => {

//   fetch(testCarte)
//     .then(r => r.json())
//     .then(r => {
//       carte.set('title', r.param.name)
//     })

//   Object.keys(mapControls).forEach(key => {
//     const ctrl = mapControls[key]
//     carte.getMap().addControl(ctrl)
//   });

//   carte.getMap().addControl(controlList)

//   // Gestion des événements

//   addMenuListener()
//   addAccordeonListener()

//   // carte.getMap().addLayer(geoportail)

//   // addAllControls(carte.getMap())
// })

// function addAllControls(map) {
//   var territories = new Territories({
//     collapsed: true,
//     draggable: true,
//     position: "top-right",
//     panel: true,
//     auto: true,
//     thumbnail: false,
//     reduce: false,
//     tiles: 3,
//     listable: true,
//   });

//   map.addControl(territories);

//   var overmap = new GeoportalOverviewMap({
//     position: "top-right",
//     listable: true,
//   });
//   map.addControl(overmap);

//   var zoom = new GeoportalZoom({
//     position: "top-right",
//     listable: true,
//   });
//   map.addControl(zoom);

//   var fullscreen = new GeoportalFullScreen({
//     position: "top-right"
//   });
//   map.addControl(fullscreen);

//   var legends = new Legends({
//     collapsed: true,
//     position: "top-right",
//     listable: true,
//     panel: true,
//     auto: true,
//     info: true
//   });
//   map.addControl(legends);

//   var catalog = new Catalog({
//     position: "top-left",
//     categories: [
//       {
//         title: "Données",
//         id: "data",
//         items: [
//           {
//             title: "WMTS",
//             default: true,
//             filter: {
//               field: "service",
//               value: "WMTS"
//             }
//           },
//           {
//             title: "WMS",
//             filter: {
//               field: "service",
//               value: "WMS"
//             }
//           },
//           {
//             title: "TMS",
//             filter: {
//               field: "service",
//               value: "TMS"
//             }
//           },
//           {
//             title: "WFS",
//             filter: {
//               field: "service",
//               value: "WFS"
//             }
//           },
//           {
//             title: "Tout",
//             filter: null
//           }
//         ]
//       }
//     ],
//   });
//   map.addControl(catalog);

//   var iso = new Isocurve({
//     position: "top-right",
//     listable: true,
//     listable: true
//   });
//   map.addControl(iso);

//   var layerImport = new LayerImport({
//     position: "top-right",
//     listable: true,
//     listable: true
//   });
//   map.addControl(layerImport);

//   var layerSwitcher = new LayerSwitcherDSFR({
//     options: {
//       position: "top-left",
//       collapsed: false,
//       panel: true,
//       counter: true,
//       allowEdit: true
//     }
//   });
//   map.addControl(layerSwitcher);

//   var mp = new GeoportalMousePosition({
//     position: "top-right"
//   });
//   map.addControl(mp);

//   var draw = new Drawing({
//     defaultStyles: {},
//     cursorStyle: {},
//     tools: {
//       points: true,
//       lines: true,
//       polygons: true,
//       holes: true,
//       text: true,
//       remove: true,
//       display: true,
//       tooltip: true,
//       export: true,
//       measure: true
//     },
//     position: "top-left"
//   });
//   map.addControl(draw);

//   var getFeatureInfo = new GetFeatureInfo({
//     position: "top-left"
//   });
//   map.addControl(getFeatureInfo);

//   var route = new Route({
//     position: "top-right",
//     listable: true,
//   });
//   map.addControl(route);

//   var reverse = new ReverseGeocode({
//     position: "top-right"
//   });
//   map.addControl(reverse);
// }

// let btn = document.getElementById("addLayerButton")
// let selectedDiv = document.getElementById("selectedLayer")
// let p = selectedDiv.querySelector("p#info")

// btn.onclick = function (e) {
//   const selectedLayer = mapControls["LayerSwitcherDSFR"].getSelection();
//   let value = "";
//   if (selectedLayer) {
//     value += `id : ${selectedLayer.get('id')}, nom : ${selectedLayer.get('title')}`;
//   } else {
//     value = "Aucune couche sélectionnée";
//   }
//   p.innerHTML = value
// }

// let download = document.getElementById("downloadMap")

// download.onclick = function (e) {
//   console.log(e.shiftKey)
//   const data = carte.write(e.shiftKey);

//   // Save in a file (use control to remove indent)
//   const blob = new Blob([JSON.stringify(data, null, e.ctrlKey ? undefined : ' ')], {type: "text/plain;charset=utf-8"});
//   FileSaver.saveAs(blob, "carte.carte");
// }

// let load = document.getElementById("file-upload")
// load.addEventListener("change", function (e) {
//   let newCarte;

//   if (e.target.files.length === 1) {
//     let file = e.target.files[0]
//     var reader = new FileReader();
//     reader.onload = function () {
//       // Import '*.carte'
//       if (/\.carte$/.test(file.name)) {
//         newCarte = JSON.parse(reader.result);
//       }
//       carte.read(newCarte)
//     }

//     reader.readAsText(file);
//   }
// })

// let reorderLayers = function (e) {
// }

// let switcher = mapControls["LayerSwitcherDSFR"];
// window.switcher = switcher

// switcher.addEventListener("layerswitcher:change:position", (e) => {
//   reorderLayers(e)
// })

// let editName = document.querySelector('.edit-name');
// editName.addEventListener('click', editMapName)

// /**
//  * 
//  * @param {Event} e 
//  */
// function editMapName(e) {
//   const validateIcon = "fr-icon-check-line"
//   const editIcon = "fr-icon-pencil-line"
//   var status = (e.target.ariaPressed === "true");
//   e.target.setAttribute("aria-pressed", !status);

//   let div = e.target.parentElement.querySelector('.map-name');

//   if (div.children.length) {
//     // Le nom est en mode édition
//     let value = div.children[0].value;

//     e.target.classList.remove(validateIcon)
//     e.target.classList.add(editIcon)

//     div.replaceChildren();
//     div.textContent = value;

//     // Enregistrement du nom de la carte
//     carte.set("title", value)
//   } else {
//     // Passage en mode édition
//     let value = div.textContent;
//     div.replaceChildren();

//     let input = document.createElement("input");
//     input.value = value;
//     input.classList.add("fr-input");
//     div.appendChild(input);

//     e.target.classList.add(validateIcon)
//     e.target.classList.remove(editIcon)
//   }
// }
/* DEBUG */
window.carte = carte
/**/