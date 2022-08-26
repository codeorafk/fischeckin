import { Component, NgZone, OnInit } from '@angular/core';
import { AppService } from './service/app-service';
import { EventEmitterService } from './service/event-emitter.service';

@Component({
  selector: 'nx-project-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ntcb';

  public constructor(
    private ngZone: NgZone,
    private appService: AppService,
    private eventEmitterService: EventEmitterService
  ) {}

  ngOnInit() {
    (window as { [key: string]: any })['angularComponentReference'] = {
      component: this,
      zone: this.ngZone,
      loadAngularFunction: (data: {
        [key: string]: string | number | boolean;
      }) => this.getUser(data),
    };
  }

  getUser(data: { [key: string]: string | number | boolean }) {
    this.appService.checkUser(data).then((value) => {
      if (value) {
        this.eventEmitterService.onEventUserChange(
          value.data as { [key: string]: string | number | boolean }
        );
      } else {
        this.eventEmitterService.onEventUserChange();
      }
    });
  }
}
