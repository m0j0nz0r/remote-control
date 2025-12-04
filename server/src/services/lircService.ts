import { execSync } from 'child_process';

export interface IRDevice {
  name: string;
  commands: string[];
}

export class LircService {
  private static instance: LircService;

  private constructor() { }

  static getInstance(): LircService {
    if (!LircService.instance) {
      LircService.instance = new LircService();
    }
    return LircService.instance;
  }

  getDevices(): IRDevice[] {
    try {
      const output = execSync('irsend LIST ""').toString();
      return this.parseDevices(output);
    } catch (error) {
      console.error('Error fetching LIRC devices:', error);
      return [];
    }
  }

  sendCommand(device: string, command: string): boolean {
    const devices = this.getDevices();
    const targetDevice = devices.find(d => d.name === device);
    if (!targetDevice) {
      console.error(`Device ${device} not found`);
      return false;
    }
    if (!targetDevice.commands.includes(command)) {
      console.error(`Command ${command} not found for device ${device}`);
      return false;
    }
    try {
      execSync(`irsend SEND_ONCE ${device} ${command}`);
      return true;
    } catch (error) {
      console.error(`Error sending command to ${device}:`, error);
      return false;
    }
  }

  isLircRunning(): boolean {
    try {
      execSync('systemctl is-active --quiet lircd');
      return true;
    } catch {
      return false;
    }
  }

  private parseDevices(output: string): IRDevice[] {
    const devices: IRDevice[] = [];
    const lines = output.trim().split('\n');

    lines.forEach(line => {
      if (line.trim() === '') return;
      const device: IRDevice = {
        name: line.trim(),
        commands: [],
      }
      try {
        execSync(`irsend LIST ${device.name} ""`).toString().split('\n').forEach(cmdLine => {
          const cmd = cmdLine.trim();
          if (cmd) {
            device.commands.push(cmd);
          }
        });
      } catch (error) {
        console.error(`Error fetching commands for device ${device.name}:`, error);
      }
      devices.push(device);
    });

    return devices;
  }
}
