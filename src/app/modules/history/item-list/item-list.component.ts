import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HistoryService } from '../../../service/history.service';
import { DataItem } from '../../../../utilities/entities';

@Component({
  selector: 'app-history-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  Data: Array<DataItem>
  constructor(private historyService: HistoryService) { }

  ngOnInit() {
    this.historyService.Subscribe(d => {
      this.Data = d;
    }, (item, index) => {
      this.SetCurrent(index);
    })
  }
  @ViewChild("body", { read: ElementRef })
  private body: ElementRef
  private SetCurrent(index: number) {
    let tbody = this.body.nativeElement as HTMLTableSectionElement;
    tbody.children[index].classList.add("");
  }
  public ItemClick(dataItem: DataItem) {

  }
}
