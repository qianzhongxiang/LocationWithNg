import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryRoutingModule } from './history-routing.module';
import { HistoryComponent } from './history.component';
import { ItemListComponent } from './item-list/item-list.component';
import { OptionPanelComponent } from './option-panel/option-panel.component';

@NgModule({
  imports: [
    CommonModule,
    HistoryRoutingModule
  ],
  declarations: [HistoryComponent, ItemListComponent, OptionPanelComponent]
})
export class HistoryModule { }
