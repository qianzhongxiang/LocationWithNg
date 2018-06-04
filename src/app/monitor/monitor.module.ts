import { AppConfigService } from './../app-config.service';
import { MessageComponent } from './../message/message.component';
import { TaskListComponent } from './../multi-panels/task-list/task-list.component';
import { DeviceListComponent } from './../multi-panels/device-list/device-list.component';
import { MonitorComponent } from './monitor.component';
import { MultiPanelsComponent } from './../multi-panels/multi-panels.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouteComponent } from '../route/route.component';
import { MonitorRoutingModule } from './monitor-routing.module';
import { FormsModule } from '@angular/forms';
import { DeviceService, MapModule, AssetService, OlMapService, ToolbarModule } from 'cloudy-location'
@NgModule({
  imports: [
    CommonModule,
    MonitorRoutingModule,
    FormsModule,
    MapModule,
    ToolbarModule
  ],
  declarations: [MonitorComponent, MultiPanelsComponent, MessageComponent
    , RouteComponent
    , DeviceListComponent, TaskListComponent],
  providers: [
    {
      provide: AssetService,
      useFactory: (appConfig: AppConfigService) => {
        let a = new AssetService(); a.Init(appConfig.Data["asset-profile-url"]);
        return a;
      }, deps: [AppConfigService]
    },
    {
      provide: OlMapService,
      useFactory: (appConfig: AppConfigService) => {
        let a = new OlMapService(); a.Init(appConfig.Data.map);
        return a;
      }, deps: [AppConfigService]
    }, {
      provide: DeviceService,
      useFactory: (appConfig: AppConfigService) => {
        let a = new DeviceService(); a.Init(appConfig.Data.map);
        return a;
      }, deps: [AppConfigService]
    }],
  // bootstrap: [MonitorComponent]
})
export class MonitorModule { }
