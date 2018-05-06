import { GraphicOutInfo } from './../../assets/Component/Graphic';
import { DeviceService } from './../device.service';
import { Component, OnInit, TemplateRef, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../asset.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Extend, DataSource, VinciWindow, VinciTable } from 'vincijs';
import { AppConfigService } from '../app-config.service';
import { ICate } from '../app-config';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  SearchName = "搜索资产名称"
  Timer: string
  Cates: Array<ICate>
  TempCates: Array<ICate>
  MainPageCates: Array<ICate>
  CatesDetailed: Array<ICate>
  TempCatesDetailed: Array<ICate>
  ModalRef: BsModalRef
  SettingModalRef: BsModalRef
  private Unconnected: VinciTable
  private CateIndex: { [code: string]: { ci: number, cdi: number } }
  constructor(private AssetService: AssetService, private DeviceService: DeviceService, private ModalService: BsModalService, private appConfigService: AppConfigService) { }
  ngOnInit() {
    setInterval(() => { this.Timer = new Date().toLocaleTimeString() }, 1000)
    this.Cates = this.appConfigService.Data.toolbar.items;
    this.CatesDetailed = this.appConfigService.Data.toolbar.itemsDetailed;
    this.MainPageCates = this.Cates.filter(c => c.mp).concat(this.CatesDetailed.filter(c => c.mp));
    this.DeviceService.Bind(this.DeviceService.Events.DeviceUpdate, (msg) => {
      var value: { data: GraphicOutInfo, type: "new" | "move" } = msg.Value
      if (value.type == "new") {
        let c = this.Cates.find(c => c.code == (value.data.type || "").toLowerCase())
        if (c) c.count = (c.count || 0) + 1;
        let info = this.AssetService.Get(value.data.Id, value.data.type) || { Category: undefined };
        let cd = this.CatesDetailed.find(c => c.code == (info.Category || "").toLowerCase())
        if (cd) cd.count = (cd.count || 0) + 1;
      }
    })
  }
  OpenAdvancedSearch(template: TemplateRef<any>) {
    this.TempCatesDetailed = this.CatesDetailed.map(c => Extend({}, c))
    this.TempCates = this.Cates.map(c => Extend({}, c))
    this.ModalRef = this.ModalService.show(template);
  }
  AdvancedSearchSave() {
    this.CatesDetailed.forEach((c, i) => Object.assign(c, this.TempCatesDetailed[i]));
    this.Cates.forEach((c, i) => Object.assign(c, this.TempCates[i]));
    this.FilterChanged();
  }
  OpenSetting(template: TemplateRef<any>) {
    this.SettingModalRef = this.ModalService.show(template);
  }
  FilterChanged() {
    let types: Array<[string, boolean]> = [];
    for (let b = 0; b < this.Cates.length; b++) {
      types.push([this.Cates[b].code, this.Cates[b].visable]);
    }
    this.DeviceService.SetShowItem((gif) => {
      let i = this.AssetService.Get(gif.Id, gif.type)
      let catedVisable: boolean = true;
      if (i) {
        let c = i.Category.toLowerCase();
        let cated = this.CatesDetailed.find(cate => cate.code == c);
        catedVisable = (cated ? cated.visable : true);
      }
      let t = gif.type.toLowerCase();
      let cate = this.Cates.find(cate => cate.code == t);
      let visable = (cate ? cate.visable : true) && catedVisable
      return visable;
    })
    // this.DeviceService.SetShowItem(types);
  }
  @ViewChild("unconnected", { read: ElementRef })
  Container: ElementRef
  ShowUnconnected() {
    let c = this.Container.nativeElement as HTMLDivElement;
    // let input = document.createElement("input");
    let list = document.createElement("div");
    list.style.overflow = "auto";
    list.style.height = "400px";
    // input.classList.add("form-control-sm")
    // container.classList.add("");
    // c.appendChild(input);
    c.appendChild(list);

    this.Unconnected = new VinciTable(list, {
      DataSource: new DataSource({
        Read: p => {
          let d = [];
          d = this.AssetService.GetAssets().filter(a => !this.DeviceService.Obtain(a.Uid))
          p.Success(d);
        }
      }), Columns: [{ field: "Title", title: "名称" }, { title: "类型", field: "Type" }, { title: "Id", field: "Uid" }]
    })
    let windo = new VinciWindow(list, { AutoDestory: true, Title: "未上线设备" });
    this.SettingModalRef.hide();
    windo.Open();
  }
}

