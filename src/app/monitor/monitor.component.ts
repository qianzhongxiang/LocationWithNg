import { AppConfigService } from './../app-config.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MapComponent, DeviceService, AssetService, ToolbarComponent } from 'cloudy-location';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit, AfterViewInit {
  @ViewChild(MapComponent)
  private map: MapComponent
  @ViewChild(ToolbarComponent)
  private toobar: ToolbarComponent
  ngAfterViewInit(): void {
    this.map.DeviceInit()
  }
  constructor(public AppConfigService: AppConfigService, private DeviceService: DeviceService, private AssetService: AssetService) {
  }
  ngOnInit() {
  }

}
