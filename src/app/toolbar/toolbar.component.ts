import { GraphicOutInfo } from './../../assets/Component/Graphic';
import { DeviceService } from './../device.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../asset.service';
import { environment } from '../../environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Extend } from 'vincijs';
interface ICate { title: string, code: string, visable: boolean, count?: number }
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
  CatesDetailed: Array<ICate>
  TempCatesDetailed: Array<ICate>
  ModalRef: BsModalRef
  private CateIndex: { [code: string]: { ci: number, cdi: number } }
  constructor(private AssetService: AssetService, private DeviceService: DeviceService, private ModalService: BsModalService) { }
  ngOnInit() {
    setInterval(() => { this.Timer = new Date().toLocaleTimeString() }, 1000)
    this.Cates = environment.toolbar.items;
    this.CatesDetailed = environment.toolbar.itemsDetailed;
    this.DeviceService.Bind(this.DeviceService.Events.DeviceUpdate, (msg) => {
      var value: { data: GraphicOutInfo, type: "new" | "move" } = msg.Value
      if (value.type == "new") {
        let c = this.Cates.find(c => c.code == value.data.type.toLowerCase())
        if (c) c.count = (c.count || 0) + 1;
      }
    })
  }
  OpenAdvancedSearch(template: TemplateRef<any>) {
    this.TempCatesDetailed = this.CatesDetailed.map(c => Extend({}, c))
    this.TempCates = this.Cates.map(c => Extend({}, c))
    this.ModalRef = this.ModalService.show(template);
  }
  AdvancedSearchSave() {
    this.CatesDetailed = this.TempCatesDetailed;
    this.Cates = this.TempCates;
    this.FilterChanged();
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
}

