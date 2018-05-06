import { Http, HttpModule } from '@angular/http';
import { AppConfigService } from './app-config.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

export function setupAppCofigServiceFactory(appConfig: AppConfigService) {
  return () => appConfig.Load();
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    AppConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupAppCofigServiceFactory,
      deps: [AppConfigService], multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
