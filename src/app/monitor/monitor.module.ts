import { MessageComponent } from './../message/message.component';
import { TaskListComponent } from './../multi-panels/task-list/task-list.component';
import { DeviceService } from './../device.service';
import { DeviceListComponent } from './../multi-panels/device-list/device-list.component';
import { MapComponent } from './../map/map.component';
import { MonitorComponent } from './monitor.component';
import { MultiPanelsComponent } from './../multi-panels/multi-panels.component';
import { AssetService } from './../asset.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteComponent } from '../route/route.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { MonitorRoutingModule } from './monitor-routing.module';
import { OlMapService } from '../ol-map.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    MonitorRoutingModule,
    ModalModule.forRoot(),
    FormsModule
  ],
  declarations: [MapComponent, MonitorComponent, MultiPanelsComponent, MessageComponent
    , RouteComponent, ToolbarComponent
    , DeviceListComponent, TaskListComponent],
  providers: [AssetService, OlMapService, DeviceService],
  // bootstrap: [MonitorComponent]
})
export class MonitorModule { }
