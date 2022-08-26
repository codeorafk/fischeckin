import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoctionService {
  public getPosition(): Promise<
    { [key: string]: number } | GeolocationPositionError
  > {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
