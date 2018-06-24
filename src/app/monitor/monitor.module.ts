import { HttpClient } from '@angular/common/http';
import { AppConfigService } from './../app-config.service';
import { MessageComponent } from './../message/message.component';
import { TaskListComponent } from './../multi-panels/task-list/task-list.component';
import { DeviceListComponent } from './../multi-panels/device-list/device-list.component';
import { MonitorComponent } from './monitor.component';
import { MultiPanelsComponent } from './../multi-panels/multi-panels.component';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonitorRoutingModule } from './monitor-routing.module';
import { FormsModule } from '@angular/forms';
import { DeviceService, MapModule, AssetService, OlMapService, ToolbarModule, WsService, MessageService, MessageModule } from 'cloudy-location'
import InitGraphics from '../utilities/graphicInit';
@NgModule({
  imports: [
    CommonModule,
    MonitorRoutingModule,
    FormsModule,
    MapModule,
    ToolbarModule,
    MessageModule
  ],
  declarations: [MonitorComponent, MultiPanelsComponent, MessageComponent
    , DeviceListComponent, TaskListComponent],
  providers: [
    {
      provide: AssetService,
      useFactory: (appConfig: AppConfigService, httpClient: HttpClient) => {
        let a = new AssetService(httpClient); a.Init(appConfig.Data["asset-profile-url"]);
        return a;
      }, deps: [AppConfigService, HttpClient]
    }, {
      provide: APP_INITIALIZER,
      useFactory: (assetService: AssetService) => { return () => assetService.Load(); },
      deps: [AssetService]
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
        InitGraphics();
        let a = new DeviceService(); a.Init(appConfig.Data.map);
        return a;
      }, deps: [AppConfigService]
    },
    {
      provide: MessageService,
      useFactory: (appConfig: AppConfigService, WsService: WsService) => {
        let a = new MessageService(WsService); a.Init(appConfig.Data.map.msgConfig.ServiceURI, appConfig.Data.map.msgConfig.wsType
          , appConfig.Data.map.mqttUser, appConfig.Data.map.mqttPd);
        return a;
      }, deps: [AppConfigService, WsService]
    }
  ],
  // bootstrap: [MonitorComponent]
})
export class MonitorModule { }
