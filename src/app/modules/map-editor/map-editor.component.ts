import { MapComponent, OlMapService, ScriptService } from 'cloudy-location';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Parameter } from '../../utilities/interface';
import olProj from 'ol/proj'
import ol_feature from 'ol/feature'
import ol_polygon from 'ol/geom/polygon'
import { AppConfigService } from '../../app-config.service';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent implements OnInit, AfterViewInit {
  private feature: ol.Feature
  private p: Parameter
  ngAfterViewInit(): void {
    // this.ScriptService.load("editor").then(() => {
    //   new window["MapEditor"](this.mapElement.nativeElement, this.OlMapService);
    // })
    this.p = this.GetData();
    if (this.p.CustomRegion) {
      let points: Array<{ X: number, Y: number }> = JSON.parse(this.p.CustomRegion);
      let tranformedPs = points.map(p => {
        return olProj.transform([p.X, p.Y], "EPSG:4326", this.AppConfigService.Data.map.srs);
      })
      this.feature = new ol_feature(new ol_polygon([tranformedPs]))
      this.Draw([this.feature])
    } else {
      this.Draw();
    }
  }
  constructor(private OlMapService: OlMapService, private ScriptService: ScriptService, private AppConfigService: AppConfigService) { }
  @ViewChild(MapComponent, { read: MapComponent })
  private map: MapComponent
  @ViewChild(MapComponent, { read: ElementRef })
  private mapElement: ElementRef
  ngOnInit() {
  }

  public Save() {
    if (this.feature) {
      var g = this.feature.getGeometry() as ol.geom.Polygon;
      var coordinates = g.getCoordinates()[0].map(c => {
        let fr = olProj.transform(c, this.AppConfigService.Data.map.srs, "EPSG:4326");
        return { X: fr[0], Y: fr[1] }
      });
      this.p.CustomRegion = JSON.stringify(coordinates);
      this.SendBackData(this.p);
    } else {
      alert("保存失败：未设定区域，请手动设定区域")
    }
    // if (confirm("没有选择任何路段，是否继续保存？")) {
    //   this.p.CustomRegion = null;
    //   this.SendBackData(this.p);
    // }
  }
  public Reset() {
    this.Clear();
    this.Draw();
  }
  private Draw(features?: Array<ol.Feature>) {
    this.OlMapService.Draw("Polygon", (f: ol.Feature) => {
      this.feature = f;
    }, undefined, features)
  }
  public Clear() {
    if (this.feature)
      this.OlMapService.RemoveDrawFeature(this.feature)
    this.feature = undefined;
  }
  protected SendBackData(data?: Parameter) {
    window.parent["SetCustomRegion"](data);
  }
  protected GetData(): Parameter {
    // let t: Parameter = {} as Parameter;
    let t: Parameter = window.parent["GetTask"]();
    return t;
  }
}
