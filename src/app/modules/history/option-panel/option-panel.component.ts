import { Component, OnInit, Input } from '@angular/core';
import { VinciTable, DataSource, VinciWindow, Ajax, LogHelper, Observerable, VinciInput } from 'vincijs';
import { AssetService, HistoryService, AssetInfo, DeviceService, Tracker } from 'cloudy-location';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-history-option-panel',
  templateUrl: './option-panel.component.html',
  styleUrls: ['./option-panel.component.css']
})
export class OptionPanelComponent extends Observerable implements OnInit {
  CurrentDevice: AssetInfo
  STime: string
  ETime: string
  Infos: Array<string> = []
  Events = { "searching": "searching" };
  constructor(private historyService: HistoryService, private assetService: AssetService, private DeviceService: DeviceService) {
    super()
  }

  ngOnInit() {
    let now = new Date();
    this.STime = `${now.getFullYear()}-${this.Ten(now.getMonth() + 1)}-${this.Ten(now.getDate())}T00:01`;
    this.ETime = `${now.getFullYear()}-${this.Ten(now.getMonth() + 1)}-${this.Ten(now.getDate())}T${this.Ten(now.getHours())}:${this.Ten(now.getMinutes())}`
  }
  private Ten(num: number): string {
    return ((num < 10) ? '0' : '') + num;
  }
  public SelectDeive() {
    let input = document.createElement("input")
      , list = document.createElement("div")
      , c = document.createElement('div')
    input.style.width = "100%"
    list.style.overflow = "auto";
    list.style.height = "400px";
    list.style.width = "100%"
    input.classList.add("form-control-sm")
    // container.classList.add("");
    c.appendChild(input);
    c.appendChild(list);
    let vinciInput = new VinciInput(input, {
      Type: "text", AutoParameters: {
        TextField: "Title", ValueField: "Id_Type",
        ItemsArea: list, DataSource: new DataSource({
          Read: p => {
            let d = [];
            d = this.assetService.GetAllAssets();
            p.Success(d);
          }
        }),
        Columns: [{ field: "Title", title: "名称" }, { title: "类型", field: "CategoryName" }, { title: "状态", field: "AssetStatus" }]
      }
    })
    vinciInput.Bind(vinciInput.Events.Change, msg => {
      this.CurrentDevice = vinciInput.GetCurrentItems()[0];
      windo.Close();
    });



    let windo = new VinciWindow(c, { AutoDestory: true, Title: "选择设备" });
    windo.Open();
    // table.Bind(table.Events.OnDblclick, msg => {
    //   this.CurrentDevice = msg.Value;
    //   windo.Close();
    // })
  }
  @Input("tracker")
  public tracker: Tracker
  public Search() {
    if (!this.CurrentDevice) {
      alert("请选择设备")
      return;
    }

    // this.SetState(this.Events.searching)
    if (environment.production) {
      //TODO Get devices of asset
      new Ajax({ url: "/TM/GetHistory", data: { Id: this.CurrentDevice.Id, Begin: new Date(this.STime).toISOString(), End: new Date(this.ETime).toISOString() }, contentType: "json" })
        .done((d: { IsSuccess: boolean, Data: Array<{ Uid: string, Type: string, Id: string, Begin: string, End: string }> }) => {
          if (d && d.IsSuccess && d.Data.length > 0) {
            this.Stop();
            this.tracker.Clean();
            this.DeviceService.UpdateTitle("history_item", "history_item", this.CurrentDevice.Title)
            let array = d.Data
            //TODO  check time
            this.historyService.GetData(array.map(a => { return { uid: a.Uid, type: a.Type, sTime: a.Begin, eTime: a.End } }), (ds) => {
              ds.forEach(d => d.Name = this.CurrentDevice.Title)
            });
          } else {
            alert("当前设备在该时段内未找到对应的终端");
            return;
          }
        })
    } else {
      this.Stop();
      this.tracker.Clean();
      this.DeviceService.UpdateTitle("history_item", "history_item", this.CurrentDevice.Title)

      this.historyService.GetData([{ uid: this.CurrentDevice.Uid, type: this.CurrentDevice.Type, sTime: new Date(this.STime).toISOString(), eTime: new Date(this.ETime).toISOString() }], (ds) => {
        ds.forEach(d => { d.Name = this.CurrentDevice.Title; })// d.CollectTime = new Date(d.CollectTime).toLocaleString()
      });
    }
    this.historyService.Subscribe(undefined, (i) => {
      try {
        new Ajax({ url: "/TK/GetInfos", data: { id: i.UniqueId, dateTime: i.CollectTime, type: i.Type }, contentType: "json" })
          .done(d => {
            if (d.IsSuccess && d.Data) {
              this.Infos.splice(0, this.Infos.length);
              this.Infos.push(...d.Data);
            }
          })
      }
      catch (e) {
        LogHelper.Error(e)
      }
    })
  }
  public Stop() {
    this.historyService.Stop();
  }
  public Resume() {
    this.historyService.Launch();
  }
}
