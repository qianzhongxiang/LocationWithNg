import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CMonitorRoutingModule } from './c-monitor-routing.module';
import { CMonitorComponent } from './c-monitor.component';
import { OlMapService } from '../../ol-map.service';
import { MapComponent } from '../../map/map.component';
import { ScriptServiceService } from '../../service/script-service.service';
import { DeviceService } from '../../device.service';

@NgModule({
  imports: [
    CommonModule,
    CMonitorRoutingModule
  ],
  providers: [OlMapService, ScriptServiceService, DeviceService],
  declarations: [CMonitorComponent, MapComponent]
})
export class CMonitorModule { }
