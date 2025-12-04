import { Router, Request, Response } from 'express';
import { LircService } from '../services/lircService';

const router = Router();
const lircService = LircService.getInstance();

router.get('/', (_req: Request, res: Response) => {
  const devices = lircService.getDevices();
  res.json(devices);
});

router.post('/send', (req: Request, res: Response) => {
  const { device, command } = req.body;

  if (!device || !command) {
    res.status(400).json({ error: 'Device and command are required' });
    return;
  }

  const success = lircService.sendCommand(device, command);
  res.json({ success, device, command, timestamp: new Date() });
});

export default router;
