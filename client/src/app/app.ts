import { Component, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { IRDevice, RemoteControlService } from './services/remote-control.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true,
})
export class App {
  constructor(private svc: RemoteControlService) {
  }
  commands: string[] = [];
  devices$!: Observable<IRDevice[]>;
  devices = new FormControl<IRDevice | null>(null);
  ngOnInit() {
    this.devices$ = this.svc.getDevices();
  }
  onDeviceChange(device: IRDevice | null) {
    this.commands = device ? device.commands : [];
  }
  sendCommand(command: string) {
    const device = this.devices.value;
    if (device) {
      this.svc.sendCommand(device.name, command).subscribe(response => {
        console.log('Command sent response:', response);
      });
    }
  }
}