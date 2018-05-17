import { AppConfigService } from './../app-config.service';
import { AssetService } from './../asset.service';
import { DeviceService, RequestMsgObject } from './../device.service';
import { OlMapService } from './../ol-map.service';
import { Component, OnInit, ViewChild, ElementRef, Optional } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild("div", { read: ElementRef }) container: ElementRef
  private TrackOfComponent: boolean
  constructor(public OlMapService: OlMapService, @Optional() private DeviceService: DeviceService, @Optional() private AssetService: AssetService, private appConfigService: AppConfigService) { }
  public DataProcess() {
    if (this.DeviceService) {
      this.DeviceService.DataProcess((gif, type) => {
        if (type == "new") {
          let info = this.AssetService ? this.AssetService.Get(gif.Id, gif.type) : undefined;
          if (!info) gif.Title = gif.Id;
          else {
            gif.Title = info.Title;
            gif.Color = info.Color;
          }
          if (this.TrackOfComponent) {
            //gif.Path = new Tracker(5, [gif.Location.x, gif.Location.y]);
            //this.AddPath(gif.Path);
          }
        }
        else if (type == "move") {
          if (this.TrackOfComponent) {
            // gif.Path.AddPoint([gif.Location.x, gif.Location.y]);
          }
        }
        // this.Business.Update(type, gif);
      })
    }
  }
  ngOnInit() {
    this.TrackOfComponent = this.appConfigService.Data.map.trackOfComponent;
    this.OlMapService.Init({ target: this.container.nativeElement })
    if (this.DeviceService) {
      this.OlMapService.AddLayer(this.DeviceService.GetLayer());
      this.DeviceService.Bind(this.DeviceService.Events.WSOpened, this.InitWSType.bind(this))
    }
  }
  protected SendMsg(obj: RequestMsgObject) {
    if (obj)
      this.DeviceService.SendMsg(obj);
  }
  protected InitWSType() {
    //TODO InitWSParameters
    this.SendMsg({ Type: 1 });
  }

}
