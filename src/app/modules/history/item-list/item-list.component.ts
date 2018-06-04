import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataItem } from '../../../../utilities/entities';
import { Tracker } from '../../../../utilities/Tracker';
import { DeviceService, OlMapService, HistoryService } from 'cloudy-location';

@Component({
  selector: 'app-history-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit {
  private pretr: HTMLTableRowElement
  private tracker: Tracker
  constructor(public historyService: HistoryService, private deviceService: DeviceService, private mapService: OlMapService) { }
  ngOnInit() {
    this.historyService.Subscribe(d => {
      var array = d.map(d => [d.X, d.Y]) as [number, number][];
      array = array.map(a => [Math.random(), 0 - Math.random()]) as [number, number][];
      if (!this.tracker) {
        this.tracker = new Tracker(3, array);
        this.mapService.DrawRoute(this.tracker.GetFeature());
      } else {
        this.tracker.AddPoints(array)
      }
    }, (item, index) => {
      this.SetCurrent(index);
      //TODO show position
      this.deviceService.Resolve([item], (g, t) => { }, ps => [1.5, -1.5]);
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
    this.deviceService.Resolve([dataItem], (g, t) => { }, ps => [1, -1]);
    this.historyService.SetCurrentIndex(index);
  }
}
