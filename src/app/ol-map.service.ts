import { LogHelper } from 'vincijs';
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
import ol_draw from 'ol/interaction/Draw'
import ol_select from 'ol/interaction/Select';
// import aMapLayer from "./../../Maplayers/AMapLayer";
import R_BG_Layer from "../assets/layers/R_BG_Layer";
import V_Roads_Layer from "../assets/layers/V_Roads_Layer";
import V_Distance_Layer from "../assets/layers/V_Distance_Layer";
import V_Marks_Layer from "../assets/layers/V_Marks_Layer";
import ol_PostionControl from 'ol/control/mouseposition'
import { AppConfigService } from './app-config.service';

@Injectable()
export class OlMapService {
  public RouteL: ol.layer.Vector
  public RangeL: ol.layer.Vector
  private DrawL: ol.layer.Vector
  constructor(private appConfigService: AppConfigService) { }
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
    let hostName = this.appConfigService.Data.map.geoServerUrl;
    // let hostName = GetConfigManager().GetConfig("geoServerUrl");
    let control = new ol_PostionControl({ target: document.createElement("div"), projection: "EPSG:3857" });
    control.on('change', (e: ol.events.Event) => {
      // console.log(e);
    });

    this.Map = new ol_Map({
      controls: [control],
      target: element,
      // layers: [
      //   new ol_layer_Tile({ source: new ol_source_OSM() }),
      //   R_BG_Layer({ hostName: hostName }),
      //   V_Roads_Layer({ hostName: hostName }),
      //   V_Distance_Layer({ hostName: hostName }),
      //   V_Marks_Layer({ hostName: hostName })
      //   // aMapLayer
      // ],
      view: new ol_View({ center: ol_proj.transform(this.appConfigService.Data.map.centerPoint, this.appConfigService.Data.map.centerSrs, 'EPSG:3857'), zoom: this.appConfigService.Data.map.zoom })
    });

    if (this.appConfigService.Data.map.layers.OMS) this.Map.addLayer(new ol_layer_Tile({ source: new ol_source_OSM() }));
    if (this.appConfigService.Data.map.layers.bg) this.Map.addLayer(R_BG_Layer({ hostName: hostName, groupName: this.appConfigService.Data.map.geoServerGroup }));
    if (this.appConfigService.Data.map.layers.road) this.Map.addLayer(V_Roads_Layer({ hostName: hostName, groupName: this.appConfigService.Data.map.geoServerGroup }));
    if (this.appConfigService.Data.map.layers.distance) this.Map.addLayer(V_Distance_Layer({ hostName: hostName, groupName: this.appConfigService.Data.map.geoServerGroup }));
    if (this.appConfigService.Data.map.layers.marks) this.Map.addLayer(V_Marks_Layer({ hostName: hostName, groupName: this.appConfigService.Data.map.geoServerGroup }));


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
  public Refresh(layer?: ol.layer.Layer) {
    //TODO refresh all layer in map
    layer.getSource().refresh();
  }
  public RemoveDrawFeature(feature: ol.Feature) {
    if (!this.DrawL) return;
    this.DrawL.getSource().removeFeature(feature);
  }

  public SelectDraw(callback: (features: Array<ol.Feature>) => void, id: string = "1") {
    if (!this.DrawL) return;
    let interactions = this.Map.getInteractions()
      , items = interactions.getArray().filter(i => i.get("levelId") == id);
    if (items)
      items.forEach(i => this.Map.removeInteraction(i));
    let s = new ol_select();
    s.on("select", (e: ol.interaction.Select.Event) => {
      callback(e.selected);
    })
    this.Map.addInteraction(s)
  }
  /**
   * 
   * @param type {"Box","LineString","Circle","Polgon"}
   * @param callback 
   */
  public Draw(type: string, callback: (feature) => void, id: string = "1") {
    let source: ol.source.Vector;
    if (!this.DrawL) {
      this.DrawL = new ol_layer_vector({
        source: (source = new ol_source_vector()),
        zIndex: 105
      });
      this.Map.addLayer(this.DrawL);
    }
    else {
      source = this.DrawL.getSource();
    }
    let interactions = this.Map.getInteractions()
      , items = interactions.getArray().filter(i => i.get("levelId") == id);
    if (items)
      items.forEach(i => this.Map.removeInteraction(i));
    let geometryFunction = undefined;
    switch (type) {
      case "Box":
        geometryFunction = ol_draw.createBox();
        type = "Circle";
        break;
    }
    let draw = new ol_draw({
      source: source,
      type: type as ol.geom.GeometryType,
      geometryFunction: geometryFunction
    })
    draw.set("levelId", id)
    draw.on("drawend", (e: ol.interaction.Draw.Event) => {
      let f = e.feature;
      this.Map.removeInteraction(draw)
      callback(f);
    })

    this.Map.addInteraction(draw)
  }
}
