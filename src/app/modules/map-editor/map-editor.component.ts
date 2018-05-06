import { MapComponent } from './../../map/map.component';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { OlMapService } from '../../ol-map.service';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    new window["MapEditor"](this.mapElement.nativeElement, this.map.OlMapService);
  }
  constructor(private OlMapService: OlMapService) { }
  @ViewChild(MapComponent, { read: MapComponent })
  private map: MapComponent
  @ViewChild(MapComponent, { read: ElementRef })
  private mapElement: ElementRef
  ngOnInit() {
  }
}
