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

//Set up default mongoose connection
var mongoDB = 'mongodb://localhost:27017';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

setInterval(timerEvent, process.env.INTERVAL_DELAY);

app.get('/', get_result);

app.listen(process.env.PORT, () => {
    console.log(`app listening at http://localhost:${process.env.PORT}`)
});