import { AssetService } from './../../asset.service';
import { HistoryService } from './../../service/history.service';
import { OlMapService } from './../../ol-map.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { ItemListComponent } from './item-list/item-list.component';
import { OptionPanelComponent } from './option-panel/option-panel.component';
import { MapComponent } from '../../map/map.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DeviceService } from '../../device.service';

@NgModule({
  imports: [
    CommonModule,
    HistoryRoutingModule,
    ModalModule.forRoot()
  ],
  declarations: [HistoryComponent, ItemListComponent, OptionPanelComponent, MapComponent],
  providers: [OlMapService, HistoryService, AssetService, DeviceService]
})
export class HistoryModule { }
