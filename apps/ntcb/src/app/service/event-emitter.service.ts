import { Injectable, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Injectable({
  providedIn: 'root',
})
export class EventEmitterService {
  invokeonEventUserChange = new EventEmitter();
  subsVar?: Subscription;

  onEventUserChange(value?: { [key: string]: string | number | boolean }) {
    this.invokeonEventUserChange.emit(value);
  }
}
