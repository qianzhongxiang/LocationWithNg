import { OlMapService } from "../typings/app/ol-map.service";
import { DeviceService } from "../typings/app/device.service";

class MapEditor {
    constructor(private container: Element, private mapService: OlMapService, private deviceService: DeviceService) {
        this.Init();
    }
    private Init() {
        var that = this;
        that.mapService.SelectDraw(function (ff) {
            console.log(ff);
        });
        that.mapService.Draw("Polygon", function (f) {
            console.log(f);

        })
    }
} 
