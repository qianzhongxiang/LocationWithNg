import { AppConfigService } from './../app-config.service';
import { DataItem } from './../../utilities/entities';
import { Injectable } from '@angular/core';
import * as jQuery from 'jquery'
@Injectable()
export class HistoryService {

  constructor(private config: AppConfigService) { }
  private callbacks: Array<(data: Array<DataItem>) => void> = []
  private currentUpdates: Array<(item: DataItem, index: number) => void> = []
  private interval: number = 5000;
  private intervalFlag: number
  private data: Array<DataItem>
  public Subscribe(callback?: (data: Array<DataItem>) => void, currentUpdate?: (item: DataItem, index: number) => void) {
    if (callback) this.callbacks.push(callback);
    if (currentUpdate) this.currentUpdates.push(currentUpdate);
  }

  private Launch(index: number = 0) {
    if (!this.data) return;
    if (this.intervalFlag) window.clearInterval(this.intervalFlag);
    this.intervalFlag = window.setInterval(i => {
      this.currentUpdates.forEach(c => c(this.data[index], i));
      i++;
    }, this.interval, index);
  }
  /**
   * 获取历史数据 通过jsonp
   * @param uid 
   * @param type 
   * @param sTime 
   * @param eTime 
   * @param callback 
   */
  public GetData(uid: string, type: string, sTime: Date, eTime: Date, callback?: (data: Array<DataItem>) => void) {
    let res: Location;
    let url = this.config.Data.map.webService + `/LocGet?callback=?`
    jQuery.ajax(url, {
      type: "GET", dataType: "jsonp", data: { uid: uid, type: type }, success: (d) => {
        if (typeof d === "string") d = JSON.parse(d);
        if (callback) callback(d);
        this.callbacks.forEach(c => c(d));
      }, error: (xhr, s, e) => {
        console.log("err")
      }
    })

  }
}
