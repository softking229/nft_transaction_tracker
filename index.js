import dotenv from "dotenv";
import { MongoClient } from 'mongodb'
import express from 'express';
import mongoose from 'mongoose';
import get_result from './controller.js';
import getTransferList from './getTransferList.js'
const app = express();
const client = new MongoClient("mongodb://localhost:27017");

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

var timerEvent = function() {
    getTransferList();
};

try {
    await mongoose.connect(process.env.DB_PATH, {useNewUrlParser: true, useUnifiedTopology: true});
} catch (err) {
    console.error("Please check MongoDB connection");
    process.exit();
}

setInterval(timerEvent, process.env.INTERVAL_DELAY);

app.get('/', get_result);

app.listen(process.env.PORT, () => {
    console.log(`app listening at http://localhost:${process.env.PORT}`)
});