import { Injectable } from '@angular/core';

import * as axios from 'axios';
@Injectable()
export class AppService {
  checkUser(data: { [key: string]: string | number | boolean }) {
    return axios.default.get<{ [key: string]: string | number | boolean }>(
      'http://localhost:3333/api/user/' + data['phone']
    );
  }

  getLocation() {
    return axios.default.get<{ [key: string]: string | number | boolean }>(
      'http://ip-api.com/json'
    );
  }

  checkTrip(phone: string) {
    return axios.default.get<{
      [key: string]:
        | string
        | number
        | boolean
        | {
            [key: string]: string | number | boolean;
          };
    }>('http://localhost:3333/api/trip/check/' + phone);
  }

  startTrip(data: object) {
    return axios.default.post<{ [key: string]: string | number | boolean }>(
      'http://localhost:3333/api/trip/start',
      data
    );
  }

  endTrip(data: object) {
    return axios.default.post<{ [key: string]: string | number | boolean }>(
      'http://localhost:3333/api/trip/end',
      data
    );
  }

  trips(phone: string) {
    return axios.default.get<{
      [key: string]: string | number | boolean;
    }>('http://localhost:3333/api/trip/' + phone);
  }
}
