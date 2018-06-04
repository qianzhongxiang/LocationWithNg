import { MapComponent, OlMapService, ScriptService } from 'cloudy-location';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    this.ScriptService.load("editor").then(() => {
      new window["MapEditor"](this.mapElement.nativeElement, this.OlMapService);
    })
  }
  constructor(private OlMapService: OlMapService, private ScriptService: ScriptService) { }
  @ViewChild(MapComponent, { read: MapComponent })
  private map: MapComponent
  @ViewChild(MapComponent, { read: ElementRef })
  private mapElement: ElementRef
  ngOnInit() {
  }
}
