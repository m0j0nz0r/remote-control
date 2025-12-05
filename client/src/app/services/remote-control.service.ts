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
  // apiUrl will be determined at runtime so it can target a server IP on the LAN.
  private apiUrl = '';

  private devicesSubject = new BehaviorSubject<IRDevice[]>([]);
  private commandHistorySubject = new BehaviorSubject<CommandEntry[]>([]);

  public devices$ = this.devicesSubject.asObservable();
  public commandHistory$ = this.commandHistorySubject.asObservable();

  constructor(private http: HttpClient) {
    // Determine server host/port/protocol at runtime.
    const host = '192.168.100.23';
    const port = '3000';
    // SERVER_PROTOCOL allows forcing http/https; otherwise use current page protocol.
    const protocol = window.location.protocol ? window.location.protocol.replace(':', '') : 'http';
    this.apiUrl = `${protocol}://${host}:${port}/api`;

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
    console.log(`Sending command ${command} to device ${device}`);
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
