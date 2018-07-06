import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { OptionPanelComponent } from './option-panel/option-panel.component';
import { Tracker, OlMapService, HistoryService, GetProjByEPSG, DeviceService } from 'cloudy-location';
import { AppConfigService } from './../../app-config.service';
import ol_proj from 'ol/proj'

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit, AfterViewInit {
  public tracker: Tracker
  ngAfterViewInit(): void {
    // this.options.Bind(this.options.Events.searching, () => {
    //   if (this.tracker) this.tracker.Clean();
    //   this.DeviceService.Coms = {};
    // })
    this.mapService.DrawRoute(this.tracker.GetFeature());
    this.historyService.Subscribe(ds => {
      console.log(ds.length)
      var array = ds.forEach(d => {
        d["localTime"] = new Date(d.CollectTime).toLocaleString();
      });
    }, undefined, ds => {
      console.log(ds.length)
      var array = ds.map(d => {
        return ol_proj.transform([d.X, d.Y], GetProjByEPSG(d.EPSG || 0), this.AppConfigService.Data.map.frontEndEpsg || 'EPSG:3857')
      }) as [number, number][];
      this.tracker.AddPoints(array);
      this.tracker.Simplify(5);
    })
  }
  @ViewChild(OptionPanelComponent)
  private options: OptionPanelComponent
  constructor(private historyService: HistoryService, private DeviceService: DeviceService, private mapService: OlMapService, private AppConfigService: AppConfigService) {
  }

  ngOnInit() {
    this.tracker = new Tracker(3, []);
  }

}
