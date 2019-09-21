import dotenv from 'dotenv';
import cron from 'node-cron';

import app from './app';
import { app as appConfig } from './config';
import { log } from './logger';
 
dotenv.config();

log(`🚀 Starting polling on cron-schedule: ${appConfig.cronSchedule}`)
cron.schedule(appConfig.cronSchedule, app.run);