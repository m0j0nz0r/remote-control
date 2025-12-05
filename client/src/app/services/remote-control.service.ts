import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface IRDevice {
  name: string;
  commands: string[];
}

export interface CommandEntry {
  device: string;
  command: string;
  timestamp: Date;
}

export interface ServerStatus {
  status: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RemoteControlService {
  private apiUrl = 'http://localhost:3000/api';
  private devicesSubject = new BehaviorSubject<IRDevice[]>([]);
  private commandHistorySubject = new BehaviorSubject<CommandEntry[]>([]);

  public devices$ = this.devicesSubject.asObservable();
  public commandHistory$ = this.commandHistorySubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadDevices();
  }

  getDevices(): Observable<IRDevice[]> {
    return this.http.get<IRDevice[]>(`${this.apiUrl}/devices`).pipe(
      tap(devices => this.devicesSubject.next(devices)),
      catchError(error => {
        console.error('Error fetching devices:', error);
        return of([]);
      })
    );
  }

  loadDevices(): void {
    this.getDevices().subscribe();
  }

  sendCommand(device: string, command: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/devices/send`, { device, command }).pipe(
      catchError(error => {
        console.error('Error sending command:', error);
        return of({ success: false, error: error.message });
      })
    );
  }

  getServerStatus(): Observable<ServerStatus> {
    return this.http.get<ServerStatus>(`${this.apiUrl}/status`).pipe(
      catchError(error => {
        console.error('Error fetching server status:', error);
        return of({ status: 'unavailable', timestamp: new Date() });
      })
    );
  }
}
