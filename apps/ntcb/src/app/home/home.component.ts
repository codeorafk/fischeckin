import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { LoctionService } from '../../service/locationService';
import { AppService } from '../service/app-service';
import { EventEmitterService } from '../service/event-emitter.service';
import { timer } from 'rxjs';
import { LocationUnit } from '../service/location';
@Component({
  selector: 'js-sdk-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements AfterViewInit, OnInit {
  constructor(
    private readonly loctionService: LoctionService,
    private readonly appService: AppService,
    private readonly locationUnit: LocationUnit,
    private eventEmitterService: EventEmitterService
  ) {
    //
  }

  public checkLogin = false;
  public isStartTrip = true;
  private map?: L.Map;
  private user?: { [key: string]: string | number | boolean };

  public trip?: {
    [key: string]:
      | string
      | number
      | boolean
      | { [key: string]: string | number | boolean }[];
  };
  public listTrip: any[] = [];

  public markers: L.CircleMarker[] = [];

  ngOnInit(): void {
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar =
        this.eventEmitterService.invokeonEventUserChange.subscribe(
          (user: { [key: string]: string | number | boolean }) => {
            if (user) {
              this.checkLogin = true;
              this.user = user;
              this.checkTrip(user['phone'] as string);
            } else {
              this.checkLogin = false;
            }
          }
        );
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [10.776156, 106.701019],
      zoom: 15,
      doubleClickZoom: true,
    });

    const tiles = L.tileLayer('https://map.stis.vn/bus/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
    });

    tiles.addTo(this.map);

    this.map.attributionControl.setPrefix('').addAttribution('');
  }

  getLocation(val: number) {
    this.loctionService
      .getPosition()
      .then((pos) => {
        if (this.map) {
          this.markerDelAgain();
          const value = pos as { [key: string]: number };
          this.map?.panTo(L.latLng(value['lat'], value['lng']));
          const marker = new L.CircleMarker(
            L.latLng(value['lat'], value['lng']),
            { className: Date.now().toLocaleString() }
          );
          this.markers.push(marker);
          this.map.addLayer(marker);
        }
      })
      .catch(() => {
        if (val === 0) {
          alert('Vui lòng cấp quyền vị trí để sử dụng');
        }
      });
  }

  markerDelAgain() {
    const temp = [...this.markers];
    for (let i = 0; i < temp.length; i++) {
      this.map && this.map.removeLayer(this.markers[i]);
      this.markers = this.markers.filter(
        (c) => c.options.className !== this.markers[i].options.className
      );
    }
  }

  async checkTrip(phone: string) {
    await this.appService.checkTrip(phone).then((value) => {
      if (value && value.data) {
        this.isStartTrip = value.data['finishTrip'] as boolean;
        if (value.data['trip']) {
          this.trip = value.data['trip'] as {
            [key: string]: string | number | boolean;
          };
        }
      } else {
        this.isStartTrip = true;
      }
    });
  }

  async startTrip() {
    this.openLoading();
    if (this.user) {
      const value: { [key: string]: string | number | boolean } = {
        ...this.user,
      };
      const pos = await this.loctionService.getPosition();
      value['lat'] = (pos as { [key: string]: number })['lat'];
      value['lng'] = (pos as { [key: string]: number })['lng'];

      const trip = await this.appService.startTrip(value);

      if (trip.data) {
        this.trip = trip.data;
        this.isStartTrip = !this.isStartTrip;
      }
    }
    this.closeLoading();
  }

  async trips() {
    if (this.user) {
      const trip = await this.appService.trips(this.user['phone'] as string);
      if (trip) {
        this.listTrip = trip.data as unknown as {
          [key: string]: string | number | boolean;
        }[];

        if (document.getElementById('myList')) {
          const html = document.getElementById('myList') as HTMLFormElement;
          html.style.display = 'flex';
        }
      }
    }
  }

  async endTrip() {
    this.openLoading();
    if (this.user && this.trip) {
      const value: {
        [key: string]:
          | string
          | number
          | boolean
          | { [key: string]: string | number | boolean }[];
      } = {
        ...this.user,
      };

      const pos = await this.loctionService.getPosition();

      value['lat'] = (pos as { [key: string]: number })['lat'];
      value['lng'] = (pos as { [key: string]: number })['lng'];

      const detail = this.trip['detail'] as {
        [key: string]: string | number | boolean;
      }[];

      const distan = this.locationUnit.getDistanceFromLatLonInKm(
        value['lat'] as number,
        value['lng'] as number,
        this.trip['lat'] as number,
        this.trip['lng'] as number
      );
      // console.log(distan);
      // if (!distan || distan < 0.25) {
      //   this.closeLoading();
      //   return;
      // }

      value['_id'] = this.trip['_id'];

      const trip = await this.appService.endTrip(value);

      if (trip.data) {
        this.isStartTrip = !this.isStartTrip;
      }
    }
    this.closeLoading();
  }

  openForm() {
    if (document.getElementById('myForm')) {
      const html = document.getElementById('myForm') as HTMLFormElement;
      html.style.display = 'flex';
    }
  }

  closeForm() {
    if (document.getElementById('myForm')) {
      const html = document.getElementById('myForm') as HTMLFormElement;
      html.style.display = 'none';
    }
  }

  closeFormList() {
    if (document.getElementById('myList')) {
      const html = document.getElementById('myList') as HTMLFormElement;
      html.style.display = 'none';
    }
  }

  openLoading() {
    if (document.getElementById('myLoading')) {
      const html = document.getElementById('myLoading') as HTMLFormElement;
      html.style.display = 'flex';
    }
  }

  closeLoading() {
    if (document.getElementById('myLoading')) {
      const html = document.getElementById('myLoading') as HTMLFormElement;
      html.style.display = 'none';
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
    const source = timer(0, 5000);

    source.subscribe((val) => this.getLocation(val));
  }
}
