import dotenv from 'dotenv';
dotenv.config();

// This file is the single entry point for the background worker.
// Its purpose is to initialize the environment and start the schedulers.

console.log('Background worker process started.');

// Import the scheduler file. This will set up the `node-cron` tasks.
// The `cron.schedule` calls within this file will keep the process alive.
import './schedulers/medicineReminder';