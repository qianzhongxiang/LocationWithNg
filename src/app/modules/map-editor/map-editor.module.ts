import { OlMapService } from './../../ol-map.service';
import { MapComponent } from './../../map/map.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapEditorComponent } from './map-editor.component';
import { MapEditorRoutingModule } from './/map-editor-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ScriptServiceService } from '../../service/script-service.service';

@NgModule({
  imports: [
    CommonModule,
    MapEditorRoutingModule,
    ModalModule.forRoot()
  ],
  declarations: [MapEditorComponent, MapComponent],
  providers: [OlMapService, ScriptServiceService]
  // bootstrap: [MapEditorComponent]
})
export class MapEditorModule { }
