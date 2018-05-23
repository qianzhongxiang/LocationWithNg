import { OlMapService } from "../typings/app/ol-map.service";
import { DeviceService } from "../typings/app/device.service";
import { AssetService } from "../typings/app/asset.service";


class MapMonitor {
    constructor(private container: Element, private mapService: OlMapService, private deviceService: DeviceService, private assetService: AssetService) {
        this.Init();
    }
    private Init() {

    }
}
