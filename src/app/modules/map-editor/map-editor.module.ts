import { MapModule, OlMapService, ScriptService } from 'cloudy-location';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapEditorComponent } from './map-editor.component';
import { MapEditorRoutingModule } from './/map-editor-routing.module';
import { AppConfigService } from '../../app-config.service';

@NgModule({
  imports: [
    CommonModule,
    MapEditorRoutingModule,
    MapModule
  ],
  declarations: [MapEditorComponent],
  providers: [{
    provide: OlMapService,
    useFactory: (appConfig: AppConfigService) => {
      let a = new OlMapService(); a.Init(appConfig.Data.map);
      return a;
    }, deps: [AppConfigService]
  }, ScriptService]
  // bootstrap: [MapEditorComponent]
})
export class MapEditorModule { }
