import dotenv from 'dotenv';
import cron from 'node-cron';

import app from './app';
import { app as appConfig } from './config';
 
dotenv.config();

cron.schedule(appConfig.cronSchedule, app.run);