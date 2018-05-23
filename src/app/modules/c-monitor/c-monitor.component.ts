import { AssetService } from './../../asset.service';
import { DeviceService } from './../../device.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { OlMapService } from '../../ol-map.service';
import { MapComponent } from '../../map/map.component';
import { ScriptServiceService } from '../../service/script-service.service';
@Component({
  selector: 'app-c-monitor',
  templateUrl: './c-monitor.component.html',
  styleUrls: ['./c-monitor.component.css']
})
export class CMonitorComponent implements OnInit, AfterViewInit {
  @ViewChild(MapComponent)
  private map: MapComponent
  @ViewChild(MapComponent, { read: ElementRef })
  private mapElement: ElementRef
  constructor(private ScriptServiceService: ScriptServiceService, private OlMapService: OlMapService, private DeviceService: DeviceService, private AssetService: AssetService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.map.DataProcess();
    this.ScriptServiceService.load("cmonitor").then(() => {
      new window["MapMonitor"](this.mapElement.nativeElement, this.OlMapService, this.DeviceService, this.AssetService);
    })
  }
}
