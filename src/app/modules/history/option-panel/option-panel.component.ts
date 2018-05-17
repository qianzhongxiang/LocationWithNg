import { HistoryService } from './../../../service/history.service';
import { AssetInfo } from './../../../../utilities/entities';
import { Component, OnInit } from '@angular/core';
import { VinciTable, DataSource, VinciWindow } from 'vincijs';
import { AssetService } from '../../../asset.service';

@Component({
  selector: 'app-history-option-panel',
  templateUrl: './option-panel.component.html',
  styleUrls: ['./option-panel.component.css']
})
export class OptionPanelComponent implements OnInit {
  CurrentDevice: AssetInfo
  STime: string
  ETime: string
  constructor(private historyService: HistoryService, private assetService: AssetService) { }

  ngOnInit() {
    let now = new Date();
    this.STime = `${now.getFullYear()}-${this.Ten(now.getMonth() + 1)}-${this.Ten(now.getDate())}T00:01`;
    this.ETime = `${now.getFullYear()}-${this.Ten(now.getMonth() + 1)}-${this.Ten(now.getDate())}T${this.Ten(now.getHours())}:${this.Ten(now.getMinutes())}`
  }
  private Ten(num: number): string {
    return ((num < 10) ? '0' : '') + num;
  }
  public SelectDeive() {
    let list = document.createElement("div");
    list.style.overflow = "auto";
    list.style.height = "400px";
    let table = new VinciTable(list, {
      Dbclickable: true,
      DataSource: new DataSource({
        Read: p => {
          let d = [];
          d = this.assetService.GetAssets();
          p.Success(d);
        }
      }), Columns: [{ field: "Title", title: "名称" }, { title: "类型", field: "Type" }, { title: "Id", field: "Uid" }]
    })

    let windo = new VinciWindow(list, { AutoDestory: true, Title: "选择设备" });
    windo.Open();
    table.Bind(table.Events.OnDblclick, msg => {
      this.CurrentDevice = msg.Value;
      windo.Close();
    })
  }
  public Search() {
    if (!this.CurrentDevice) {
      alert("请选择设备")
      return;
    }
    //TODO  check time
    this.historyService.GetData(this.CurrentDevice.Uid, this.CurrentDevice.Type, new Date(this.STime), new Date(this.ETime));
  }
  public Stop() {
    this.historyService.Stop();
  }
  public Resume() {
    this.historyService.Launch();
  }
}
