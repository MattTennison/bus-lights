import 'dotenv/config';
import cron from 'node-cron';

import app from './app';
import { app as appConfig } from './config';
import { log } from './logger';

log(`🚀 Starting polling on cron-schedule: ${appConfig.cronSchedule}`)
cron.schedule(appConfig.cronSchedule, app.run);