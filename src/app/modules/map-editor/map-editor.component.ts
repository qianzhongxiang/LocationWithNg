import { AssetService } from './../../asset.service';
import { DeviceService } from './../../device.service';
import { MapComponent } from './../../map/map.component';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { OlMapService } from '../../ol-map.service';
import { ScriptServiceService } from '../../service/script-service.service';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.component.html',
  styleUrls: ['./map-editor.component.css']
})
export class MapEditorComponent implements OnInit, AfterViewInit {

  ngAfterViewInit(): void {
    this.ScriptServiceService.load("editor").then(() => {
      new window["MapEditor"](this.mapElement.nativeElement, this.OlMapService);
    })
  }
  constructor(private OlMapService: OlMapService, private ScriptServiceService: ScriptServiceService) { }
  @ViewChild(MapComponent, { read: MapComponent })
  private map: MapComponent
  @ViewChild(MapComponent, { read: ElementRef })
  private mapElement: ElementRef
  ngOnInit() {
  }
}
