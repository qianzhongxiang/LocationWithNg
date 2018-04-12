import { LogHelper } from 'vincijs';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';
import { ContextMenu_Super } from './../assets/Tools_OL/ContextMenu_Super';
import ol_Map from 'ol/map';
import ol_style from 'ol/style/Style';
import ol_stroke from 'ol/style/Stroke';
import ol_layer_Tile from 'ol/layer/tile';
import ol_source_OSM from 'ol/source/osm';
import ol_layer_vector from 'ol/layer/Vector';
import ol_source_vector from 'ol/source/Vector';
import ol_View from 'ol/view';
import ol_proj from 'ol/proj';
import ol_feature from 'ol/feature';
import ol_polygon from 'ol/geom/Polygon';
import ol_lineString from 'ol/geom/LineString';
import ol_geometry from 'ol/geom/Geometry';
// import aMapLayer from "./../../Maplayers/AMapLayer";
import R_XBBG_Layer from "../assets/layers/R_XB_BG_Layer";
import V_XB_Roads_Layer from "../assets/layers/V_XB_Roads_Layer";
import V_XB_Distance_Layer from "../assets/layers/V_XB_Distance_Layer";
import V_XB_Marks_Layer from "../assets/layers/V_XB_Marks_Layer";
import ol_PostionControl from 'ol/control/mouseposition'

@Injectable()
export class OlMapService {
  public RouteL: ol.layer.Vector
  public RangeL: ol.layer.Vector
  constructor() { }
  private Map: ol.Map
  private CurrentPointByMouse: [number, number]
  /**
   * AddLayer
   * @param {} layer
   */
  public AddLayer(layer: ol.layer.Layer) {
    this.Map.addLayer(layer);
  }
  public RemoveLayer(layer) {
    this.Map.removeLayer(layer);
  }
  public AddInteraction(interaction: ol.interaction.Interaction) {
    this.Map.addInteraction(interaction);
  }
  public RemoveInteraction(interaction: ol.interaction.Interaction) {
    this.Map.removeInteraction(interaction);
  }
  public RemoveAllInteraction() {
    this.Map.getInteractions().forEach(i => this.Map.removeInteraction(i));
  }
  public AddControl(control: ol.control.Control | ContextMenu_Super) {
    if (control instanceof ContextMenu_Super)
      control.SetMap(this.Map);
    else // if (control instanceof ol.control.Control)
      this.Map.addControl(control);
  }
  private EnvironmentConfig(element: HTMLElement) {
    let hostName = environment.map.geoServerUrl;
    // let hostName = GetConfigManager().GetConfig("geoServerUrl");
    let control = new ol_PostionControl({ target: document.createElement("div"), projection: "EPSG:3857" });
    control.on('change', (e: ol.events.Event) => {
      // console.log(e);
    });
    this.Map = new ol_Map({
      controls: [control],
      target: element,
      layers: [
        new ol_layer_Tile({ source: new ol_source_OSM() }),
        R_XBBG_Layer({ hostName: hostName }),
        V_XB_Roads_Layer({ hostName: hostName }),
        V_XB_Distance_Layer({ hostName: hostName }),
        V_XB_Marks_Layer({ hostName: hostName })
        // aMapLayer
      ],
      view: new ol_View({ center: ol_proj.transform([118.89565229, 32.19354589], 'EPSG:4326', 'EPSG:3857'), zoom: 15 })
    });


    let style = new ol_style({ stroke: new ol_stroke({ width: 6, color: "#04cf87" }) })
    this.RouteL = new ol_layer_vector({
      source: new ol_source_vector(),
      zIndex: 103,
      style: () => [style]
    });
    this.Map.addLayer(this.RouteL);

    let rangStyle = new ol_style({ stroke: new ol_stroke({ width: 2, color: '#8ccf1c' }) })
    this.RangeL = new ol_layer_vector({
      source: new ol_source_vector(),
      zIndex: 102,
      style: () => [rangStyle]
    });
    this.Map.addLayer(this.RangeL);

    // this.Map.on('postcompose',()=>{
    //     //TWEEN.update();
    // });
  }

  public DrawRoute(route: string | Array<{ X: number, Y: number }>) {
    let points: Array<{ X: number, Y: number }>;
    if (typeof route === 'string') points = JSON.parse(route);
    else points = route;
    if (points) {
      let pointArray: Array<[number, number]> = [];
      points.forEach(p => {
        pointArray.push(ol_proj.transform([p.X, p.Y], "EPSG:4326", "EPSG:3857"));
      });
      let feature = new ol_feature(new ol_lineString(pointArray))
      this.RouteL.getSource().addFeature(feature);
    } else LogHelper.Error("DrawRoute():route is invalid")
  }
  public DrawRange(ps: Array<{ X: number, Y: number }>) {
    if (ps) {
      let source = this.RangeL.getSource();
      let a: Array<[number, number]> = [];
      ps.forEach(p => a.push(ol_proj.transform([p.X, p.Y], "EPSG:4326", "EPSG:3857")))
      let feature = new ol_feature(new ol_polygon([a]))
      source.addFeature(feature);
    } else LogHelper.Error(`DrawRange():ps is null`)
  }

  public GetCoordinate(e: Event): [number, number] {
    return this.Map.getEventCoordinate(e);
  }
  public Helper(helper?: Object) {
  }

  public Change(data: Object): void {
    throw new Error("Method not implemented.");
  }
  public Init(data: { target: HTMLElement }) {
    this.EnvironmentConfig(data.target);// this.EnvironmentConfig( ....);
    // this.Render();
  }

  public Focus(point: [number, number]) {
    this.Map.getView().setCenter(point);
  }

  public Render() {
    this.Map.render()
  }
}
