import { MapComponent } from './../map/map.component';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit, AfterViewInit {
  @ViewChild(MapComponent)
  private map: MapComponent
  ngAfterViewInit(): void {
    this.map.DataProcess();
  }
  constructor() {

  }


  ngOnInit() {
  }

}
