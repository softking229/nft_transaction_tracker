import express from 'express';
import mongoose from 'mongoose';
import { clear_collection} from './controller.js';
const app = express();

try {
    await mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});
    await clear_collection();    
} catch (err) {
    console.error("Please check MongoDB connection");
    process.exit();
}
