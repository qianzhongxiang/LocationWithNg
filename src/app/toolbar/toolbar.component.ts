import { DeviceService } from './../device.service';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AssetService } from '../asset.service';
import { environment } from '../../environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Extend } from 'vincijs';
interface ICate { title: string, code: string, visable: boolean }
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
      if (!i) return true;
      let c = i.Category.toLowerCase();
      let t = i.Type.toLowerCase();

      return this.Cates.find(cate => cate.code == t).visable && this.CatesDetailed.find(cate => cate.code == c).visable;
    })
    this.DeviceService.SetShowItem(types);
  }
}

