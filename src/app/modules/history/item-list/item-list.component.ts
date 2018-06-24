import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DeviceService, OlMapService, HistoryService, Tracker, DataItem } from 'cloudy-location';
@Component({
  selector: 'app-history-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  private pretr: HTMLTableRowElement

  constructor(public historyService: HistoryService, private deviceService: DeviceService, private mapService: OlMapService) { }
  ngOnInit() {
    this.historyService.Subscribe(undefined, (item, index) => {
      this.SetCurrent(index);
      let o = Object.assign({}, item, { UniqueId: "history_item", Type: "history_item" })
      //TODO show position
      this.deviceService.Resolve([o], (g, t) => { });
    })
  }

  @ViewChild("body", { read: ElementRef })
  private body: ElementRef
  @ViewChild("bodyContainer", { read: ElementRef })
  private bodyContainer: ElementRef
  private SetCurrent(index: number, scroll: boolean = true) {
    let tbody = this.body.nativeElement as HTMLTableSectionElement;
    if (this.pretr) this.pretr.classList.remove("bg-success");
    (this.pretr = tbody.children[index] as HTMLTableRowElement).classList.add("bg-success");
    if (scroll)
      (this.bodyContainer.nativeElement as HTMLDivElement).scrollTop = this.pretr.offsetTop - 100;
  }
  public ItemClick(dataItem: DataItem, index: number) {
    this.historyService.Stop();
    this.SetCurrent(index, false);
    let o = Object.assign({}, dataItem, { UniqueId: "history_item", Type: "history_item" })
    this.deviceService.Resolve([o], (g, t) => { });
    this.historyService.SetCurrentIndex(index);
  }
}
