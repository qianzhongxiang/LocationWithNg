import { AssetService } from './../asset.service';
import { Component, OnInit } from '@angular/core';
import { WebSocketor, LogHelper } from 'vincijs';
import { environment } from '../../environments/environment';
interface WarningEntity {
  WarningType: { Code: string, Description: string, Name: string }
  Task_Assets: { TerminalType: { Description: string }, UniqueidGPSTerminal: string }
  AssetName: string
}
@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  Msgs: Array<{ msg: string, data: WarningEntity }> = []
  constructor(private AssetService: AssetService) { }

  ngOnInit() {
    new WebSocketor({ Url: environment.map.warningService }).Open(evt => {
      let datas: Array<WarningEntity> = JSON.parse(evt.data);
      datas.forEach(d => {
        try {
          this.Msgs.unshift({ msg: `${d.WarningType.Name}:*** --${new Date().toLocaleTimeString()}`, data: d })
          if (this.Msgs.length > 20)
            this.Msgs.pop()
          // let i = this.AssetService.Get(d.Task_Assets.UniqueidGPSTerminal, d.Task_Assets.TerminalType.Description)
          // this.Msgs.push({ msg: `${d.WarningType.Name}:${i.Title}--${new Date().toLocaleTimeString()}`, data: d })
          //TODO show modal window
          //TODO update data
        }
        catch (e) {
          LogHelper.Log(e);
        }
      })
    })
  }
}
