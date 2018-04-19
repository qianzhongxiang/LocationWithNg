import { Injectable } from '@angular/core';
import { IncarGraphic } from './../assets/Component/IncarGraphic';
import { GPSTagGraphic } from './../assets/Component/GPSTagGraphic';
import { CellPhoneGraphic } from './../assets/Component/CellPhoneGraphic';
import { GraphicOutInfo, GetGraphicFactory, Graphic } from "./../assets/Component/Graphic";
import { GetConfigManager, IObseverable, ObserverableWMediator, LogHelper, WebSocketor } from 'vincijs';
// import TWEEN = require('@tweenjs/tween.js')../assets/Component/
import VertorSource from 'ol/source/Vector'
import VertorLayer from 'ol/layer/Vector'
import ol_proj from 'ol/proj'
import { environment } from '../environments/environment';
// import ol_style = require('ol/style/Style')
// import ol_stroke = require('ol/style/Stroke')

GetGraphicFactory().SetComponent(CellPhoneGraphic);
GetGraphicFactory().SetComponent(GPSTagGraphic);
GetGraphicFactory().SetComponent(IncarGraphic);
export enum WSType {
  //None = 0,
  Location = 1,
  History = 10,
}
export interface RequestMsgObject {
  Type?: WSType
  Region?: string
  /**
   * svr default 3000
   */
  HistoryDuration?: number
  STime?: Date | string
  ETime?: Date | string
  UIds?: Array<string>
}
/**
 * manager dependent on TWEEN
 */
@Injectable()
export class DeviceService extends ObserverableWMediator {
  private socket: WebSocketor;
  private TIMEOUT: number = 600000 //10 minutes
  public Coms = {}; //{"{Id}":GraphicOutInfo}
  private LastTweens: Object = {}; //{"{Id}":TWEEN.Tween}
  private VectorSource: ol.source.Vector
  private Layer: ol.layer.Vector
  public Events = { WSOpened: "WSOpened", WSClosed: "WSClosed", TweenStart: "TweenStart", DeviceUpdate: "DeviceUpdate" }
  private HighlightedId: string
  private autoReconnectInterval: number = 5000
  private duration: number = 5000
  public durTimes: number = 1
  private Filter: (graphic: GraphicOutInfo) => boolean
  constructor() {
    super();
    this.VectorSource = new VertorSource();
    this.Layer = new VertorLayer({
      source: this.VectorSource, style: (feature) => {
        let f = (feature as ol.Feature), id = f.getId(), c = this.Coms[id]
        if (this.Filter && !c.Visable) { c.Visable = this.Filter(c) }
        let v = c ? c.Visable : false;
        let s = GetGraphicFactory().GetComponent(f.get("type")).GetStyle(f.get('mainColor'), f.get('name'), v);
        if (this.HighlightedId && this.HighlightedId == id) {
          let c = s.getImage() as ol.style.Circle
          c.getStroke().setColor('yellow');
          s.setZIndex(99);
          s.getText().setFont("Normal bold 18px Arial");
          s.getText().getStroke().setWidth(5)
          // s.getText().getStroke().setColor('red');
        }
        return s;
      }
    });
    this.Layer.setZIndex(80);
  }
  public GetLayer(): ol.layer.Vector {
    return this.Layer;
  }
  private ClearTimeOutComs() {
    // let now = new Date();
    // for (let n in this.Coms) {
    //     let obj = this.Coms[n] as GraphicOutInfo
    //     if ((now.getTime() - obj.ReveiveTime.getTime()) > this.TIMEOUT) { //因为小车也有时间 所以也会清除
    //         if (obj.Title3D) GetScene().remove(obj.Title3D)
    //         GetScene().remove(obj.ThreeObject3D)
    //         delete this.Coms[n];
    //     }
    // }
  }
  /**
   * 获取GraphicOutInfo
   * @param Id
   */
  public Obtain(Id: string): GraphicOutInfo {
    return this.Coms[Id];
  }
  public GetPosition(Id: string): [number, number] {
    return (this.Layer.getSource().getFeatureById(Id).getGeometry() as ol.geom.Point).getCoordinates();
  }

  public Find(fn: (obj: GraphicOutInfo) => boolean): Array<GraphicOutInfo> {
    let res: Array<GraphicOutInfo> = []
    for (let n in this.Coms) {
      let obj = this.Coms[n] as GraphicOutInfo
      if (fn(obj)) res.push(obj)
    }
    return res;
  }

  public Update() {
  }

  /**
   *
   * @param id
   * @param location
   * @param duration
   */
  ComponentMove(id: string, loc: { x: number; y: number; }, duration: number): DeviceService { //TODO 若chain堆积太多 则必须对象位置需跳过前面tweens
    let that = this, graphic: GraphicOutInfo
    //TODO 判断位置如果相同不进行任何操作;
    if (graphic = this.Coms[id]) {
      let feature = this.VectorSource.getFeatureById(graphic.Id);
      (feature.getGeometry() as ol.geom.Point).setCoordinates([loc.x, loc.y])
      // ******TWEEN****************
      // if (!graphic.PArray) graphic.PArray = [];
      // graphic.PArray.push({ x: loc.x, y: loc.y, dur: duration, time: graphic.Time as string });
      // if (!that.LastTweens[graphic.Id]) {
      //     // LogHelper.Log("tween launch")
      //     that.LastTweens[graphic.Id] = this.Tween(graphic.Location, graphic).start();
      // }
    }
    else
      console.log("err: id:" + id + " 在Coms中不存在");
    return this;
  }
  /**
   * to launch procession to process data from coordinate websocket which can be closed by invoke "ProcessClose" method
   * @param callback
   * @param posiConvertor coordinate convertor
   */
  DataProcess(callback: (gif: GraphicOutInfo, type: "new" | "move") => void
    , posiConvertor?: (posi: [number, number]) => [number, number]): DeviceService {
    if (this.socket) return this;
    let url = environment.map.locationSocketURI
    this.socket = new WebSocketor({ Url: url });
    this.socket.Open(evt => {
      try {
        let datas = JSON.parse(evt.data), now = new Date();
        for (var i = 0; i < datas.length; i++) {
          let data = datas[i]
          if (data.X == 0 && data.Y == 0) continue;
          let graphic = GetGraphicFactory().GetComponent(data.Type);
          let profile: GraphicOutInfo, type: "new" | "move"
          let ps: [number, number] = [data.X, data.Y];
          // ps = coordtransform.wgs84togcj02(ps[0], ps[1]) as [number, number]
          ps = ol_proj.transform(ps, 'EPSG:4326', 'EPSG:3857')
          if (posiConvertor)
            ps = posiConvertor(ps);
          let feature: ol.Feature
          if (!this.Coms[data.UniqueId]) {
            profile = {
              type: data.Type, Graphic: graphic, Id: data.UniqueId, Location: { x: ps[0], y: ps[1] }
              , Parent: null
              , Title: data.Name
              , ReveiveTime: now
            }
            feature = graphic.Buid(ps);
            feature.setId(profile.Id);
            this.VectorSource.addFeature(feature);
            this.Coms[data.UniqueId] = profile;
            type = "new";
          } else {
            profile = this.Coms[data.UniqueId];
            this.ComponentMove(data.UniqueId, { x: ps[0], y: ps[1] }, data.Duration);
            type = "move";
          }
          profile.Duration = data.Duration;
          profile.ReveiveTime = now;
          profile.Time = data.CollectTime;
          profile.Location = { x: ps[0], y: ps[1] }
          callback(profile, type);
          this.SetState(this.Events.DeviceUpdate, { data: profile, type: type })
          if (type == 'new') {
            feature.setProperties({ name: profile.Title })
            feature.setProperties({ mainColor: profile.Color })
          }
        }
      } catch (error) {
        LogHelper.Error(error)
      }
    }, () => {
      this.SetState(this.Events.WSOpened, this.socket);
    })
    return this;
  }
  SetShowItem(filter: (graphic: GraphicOutInfo) => boolean) {//filter: Array<[string, boolean]> | ((graphic: GraphicOutInfo) => boolean)
    // if (filter instanceof Array) {
    //   filter.forEach(t => {
    //     GetGraphicFactory().GetComponent(t[0]).Visable = t[1];
    //     //this.VectorSource.getFeatureById(t[0]).set("visible",t[1]);
    //   })
    // }
    // else {
    this.Filter = filter;
    for (let c in this.Coms) {
      let i: GraphicOutInfo = this.Coms[c];
      i.Visable = filter(i);
    }
    // }
    //update
    this.Layer.getSource().refresh();
    return this;
  }
  SendMsg(postData: Object): DeviceService {
    this.socket.SendMsg(postData);
    return this;
  }
  ProcessClose(onclose?: () => void): DeviceService {
    this.socket.Close();
    this.socket = undefined;
    return this;
  }
  EmptyComponents(): DeviceService {
    // for (let n in this.Coms) {
    //     let obj = this.Coms[n] as GraphicOutInfo
    //     if (obj.Title3D) GetScene().remove(obj.Title3D)
    //     GetScene().remove(obj.ThreeObject3D)
    //     delete this.Coms[n];
    // }
    return this;
  }
  private ShowTitleSingle(info: GraphicOutInfo): DeviceService {
    // let scene = GetScene(), render = GetWebGLRender()
    // if (info.Title) {
    //     if (!(info.Title3D)) {
    //         info.Title3D = TextSprites.makeTextSprite(info.Title,
    //             { fontsize: 18, borderColor: { r: 0, g: 0, b: 255, a: 1.0 } });
    //         scene.add(info.Title3D);
    //     }
    //     else {
    //         TextSprites.updateText(info.Title, info.Title3D.children[0] as THREE.Sprite, { fontsize: 18, fontface: "Georgia", borderColor: { r: 0, g: 0, b: 255, a: 1.0 } });
    //     }
    //     info.Title3D.position.set(info.ThreeObject3D.position.x, info.Graphic.Height * info.ThreeObject3D.scale.y, info.ThreeObject3D.position.z);
    // }
    return this;
  }
  ShowTitle(): DeviceService {
    // let scene = GetScene(), render = GetWebGLRender()
    // for (let n in this.Coms) {
    //     let c = this.Coms[n] as GraphicOutInfo;
    //     if (c.Title) {
    //         if (!(c.Title3D)) {
    //             c.Title3D = TextSprites.makeTextSprite(c.Title,
    //                 { fontsize: 18, fontface: "Georgia", borderColor: { r: 0, g: 0, b: 255, a: 1.0 } });
    //             scene.add(c.Title3D);
    //         }
    //         TextSprites.updateText(c.Title, c.Title3D.children[0] as THREE.Sprite, { fontsize: 18, fontface: "Georgia", borderColor: { r: 0, g: 0, b: 255, a: 1.0 } });
    //         c.Title3D.position.set(c.ThreeObject3D.position.x, c.Graphic.Height * c.ThreeObject3D.scale.y, c.ThreeObject3D.position.z);

    //         // var dir = new THREE.Vector3(c.ThreeObject3D.position.x, c.Graphic.Height * c.ThreeObject3D.scale.y, c.ThreeObject3D.position.z);
    //         // //normalize the direction vector (convert to vector of length 1)
    //         // // dir.normalize();
    //         // var origin = new THREE.Vector3(c.ThreeObject3D.position.x, 0, c.ThreeObject3D.position.z );
    //         // var length = 100;
    //         // var hex = 0xffff00;
    //         // var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
    //         // scene.add( arrowHelper );
    //     }
    // }
    return this;
  }
  HideTitle(): DeviceService {
    //for (let n in this.Coms) {
    //    let c = this.Coms[n] as GraphicOutInfo;
    //    if (c.TitleDoc) {
    //        c.TitleDoc.style.display = "none";
    //    }
    //}
    return this;
  }
  ShowProfile(event: MouseEvent): DeviceService {
    // console.log("dblclick")
    // let clientX = event.clientX, clientY = event.clientY;
    // // update the mouse variable
    // clientX = (event.clientX / window.innerWidth) * 2 - 1;
    // clientY = - (event.clientY / window.innerHeight) * 2 + 1;
    // let vector = new THREE.Vector3(clientX, clientY, 1).unproject(GetPCamera());
    // let ray = new THREE.Raycaster(GetPCamera().position, vector.sub(GetPCamera().position).normalize());
    // //ray.setFromCamera({ x: clientX, y: clientY }, GetPCamera());
    // ray.linePrecision = 8;
    // let cranes = Object.getOwnPropertyNames(this.Coms).filter(n => this.Coms[n] && this.Coms[n].type == "crane").map(n => {
    //     return (this.Coms[n] as GraphicOutInfo).ThreeObject3D;
    // })
    // let crane = ray.intersectObjects(cranes, true)[0];
    // if (crane) {
    //     if (!this.BoxHelper) {
    //         this.BoxHelper = new THREE.BoxHelper(crane.object); GetScene().add(this.BoxHelper);
    //     }
    //     else this.BoxHelper.update(crane.object)
    //     let ip = crane.object["remoteAddr"]
    //     window.open("http://" + ip + "/pds.php", 'newwindow', 'height=572, width=1016, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
    // }
    return this;
  }
  public HighLight(com: GraphicOutInfo) {
    if (!com || this.HighlightedId) {
      delete this.HighlightedId
    }
    this.HighlightedId = com ? com.Id : undefined;
  }
}
// export let GetDeviceService: () => DeviceService = Singleton(DeviceService, true);
