import { environment } from './../../environments/environment';
import { AssetService } from './../asset.service';
import { DeviceService, RequestMsgObject } from './../device.service';
import { OlMapService } from './../ol-map.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @ViewChild("div", { read: ElementRef }) container: ElementRef
  private TrackOfComponent: boolean
  constructor(private OlMapService: OlMapService, private DeviceService: DeviceService, private AssetService: AssetService) { }

  ngOnInit() {
    this.TrackOfComponent = environment.map.trackOfComponent
    this.OlMapService.Init({ target: this.container.nativeElement })
    this.OlMapService.AddLayer(this.DeviceService.GetLayer());
    this.DeviceService.Bind(this.DeviceService.Events.WSOpened, this.InitWSType.bind(this))
    this.DeviceService.DataProcess((gif, type) => {
      if (type == "new") {
        let info = this.AssetService.Get(gif.Id, gif.type);
        if (!info) gif.Title = "***";
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
  protected SendMsg(obj: RequestMsgObject) {
    if (obj)
      this.DeviceService.SendMsg(obj);
  }
  protected InitWSType() {
    //TODO InitWSParameters
    this.SendMsg({ Type: 1 });
  }

}
