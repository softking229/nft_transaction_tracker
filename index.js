import dotenv from "dotenv";
import express from 'express';
import mongoose from 'mongoose';
import {getAll, getByWallet, clear_collection} from './controller.js';
import {getNewestTransferList, getPastTransferList} from './getTransferList_1.js'
import util from 'util'
const timer = util.promisify(setTimeout);
const app = express();

try {
    await mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});
    //await clear_collection();    
} catch (err) {
    console.error("Please check MongoDB connection");
    process.exit();
}

app.get('/', getAll);
app.get('/api/wallet-watch/:wallet_address', getByWallet);

app.listen(80, () => {
    console.log(`app listening at http://localhost:80`)
});
try{
    getPastTransferList();
}catch(e){}
while(true) {
    try{
        await getNewestTransferList();

    }catch(e){}
    await timer(1000);
}