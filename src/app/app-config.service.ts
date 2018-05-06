import { LogHelper } from 'vincijs';
import { AppConfig } from './app-config';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { environment } from '../environments/environment';
@Injectable()
export class AppConfigService {
  private default: AppConfig = { map: { geoServerGroup: "SL" } }
  public Data: AppConfig
  constructor(private http: Http) { }

  public Load(): Promise<AppConfig> {
    return new Promise<AppConfig>((resolve, reject) => {
      this.http.get(environment.configuration).subscribe(response => {
        LogHelper.Log("using server-side configuration");
        this.Data = Object.assign({}, this.default || {}, response.json() || {});
        resolve(this.Data);
      }, error => {
        LogHelper.Log("using default configuration");
        this.Data = Object.assign({}, this.default || {});
        resolve(this.Data);
      })
    })
  }
}
