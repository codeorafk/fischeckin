import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { RenderPipe } from './pipes/render.pipe';
import { AppService } from './service/app-service';
import { EventEmitterService } from './service/event-emitter.service';
import { LocationUnit } from './service/location';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './router/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
registerLocaleData(localeVi);
@NgModule({
  declarations: [AppComponent, HomeComponent, RenderPipe],
  imports: [
    BrowserModule,
    LeafletModule,
    HttpClientModule,
    AppRoutingModule,

    BrowserAnimationsModule,
  ],
  providers: [
    AppService,
    LocationUnit,
    EventEmitterService,
    { provide: LOCALE_ID, useValue: localeVi },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
