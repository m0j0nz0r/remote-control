# Remote Control Utility

A web-based remote control application built with Node.js and Angular, integrating with LIRC (Linux Infrared Remote Control) to send IR commands.

## Features

- **Web Interface**: Modern Angular UI for controlling IR devices
- **LIRC Integration**: Send infrared commands via LIRC daemon
- **Device Management**: Configure and manage multiple IR devices
- **Command History**: Track sent commands
- **Real-time Updates**: WebSocket support for live status updates
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- LIRC daemon installed and configured on the system
- Linux-based OS (LIRC support)

## Installation

### Backend Setup

```bash
cd server
npm install
```

### Frontend Setup

```bash
cd client
npm install
```

### LIRC Configuration

Ensure LIRC is installed and running:

```bash
sudo apt-get install lirc
sudo systemctl start lircd
sudo systemctl enable lircd
```

Verify LIRC is working:

```bash
irsend LIST
```

## Running the Application

### Development Mode

Start the backend server:

```bash
cd server
npm run dev
```

Start the Angular development server:

```bash
cd client
ng serve
```

Access the application at `http://localhost:4200`

### Production Mode

```bash
cd server
npm run build
npm start

cd client
ng build --prod
```

## Project Structure

```
remote-control/
├── server/                 # Node.js Express backend
│   ├── src/
│   │   ├── routes/        # API endpoints
│   │   ├── services/      # LIRC service integration
│   │   └── app.ts         # Express app setup
│   └── package.json
├── client/                # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── app.module.ts
│   │   └── index.html
│   └── angular.json
└── README.md
```

## API Endpoints

- `GET /api/devices` - List available IR devices
- `POST /api/send` - Send IR command
- `GET /api/commands` - Get command history
- `GET /api/status` - Get LIRC daemon status

## Configuration

Edit `server/config/lirc.config.json` to configure LIRC settings and device mappings.

## Troubleshooting

- **LIRC not found**: Ensure LIRC daemon is running (`sudo systemctl status lircd`)
- **Permission denied**: Add user to `lirc` group or run with sudo
- **No devices detected**: Verify IR receiver is connected and LIRC is configured

## Contributing

Pull requests welcome. Please follow the existing code style.

## License

MIT
