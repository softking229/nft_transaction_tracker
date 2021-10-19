import dotenv from "dotenv";
import fetch from "node-fetch"
import SomeModel from './SomeModel.js'

dotenv.config({ silent: process.env.NODE_ENV === 'production' });

var getLastBlock = async() => {
    var lastblock = 0;
    var results = await SomeModel.find().sort({blockNumber: -1}).limit(1).exec();
    if( results.length) {
        lastblock = results[0].blockNumber * 1;
    }
    return lastblock;
}

var updateDatabase = async(tokennfttx, txlist, lastblock) => {
    if( !tokennfttx.length) {
        console.log("inserted rows: 0");
        return;
    }
    var tokennfttx_map = {};
    var temp_lastblock = tokennfttx[0].blockNumber * 1;
    for( var i = 0; i < tokennfttx.length; i ++) {
        tokennfttx_map[tokennfttx[i].blockNumber] = tokennfttx[i];
    }
    var result = [];
    for( var i = 0; i < txlist.length; i ++) {
        if( tokennfttx_map[txlist[i].blockNumber]) {
            var tx_t = txlist[i];
            var tokennfttx_t = tokennfttx_map[tx_t.blockNumber];
            var result_t = {};
            result_t['blockNumber'] = tokennfttx_t.blockNumber;
            result_t['from'] = tokennfttx_t.from;
            result_t['to'] = tokennfttx_t.to;
            result_t['tokenID'] = tokennfttx_t.tokenID;
            result_t['tokenName'] = tokennfttx_t.tokenName;
            result_t['Price'] = tx_t.value;
            result_t['Date'] = Date(tokennfttx_t.timeStamp);
            result.push(result_t);
            if( lastblock < tx_t.blockNumber * 1)
                lastblock = tx_t.blockNumber * 1;
        }
    }
    if( result.length == 0) {
        console.log("inserted rows: 0");
        return;
    }
    console.log("inserted rows: ", result.length);
    SomeModel.insertMany(result);
}

var getTransferList = async() => {
    console.log('checking', new Date());
    var lastblock = await getLastBlock();
    var startblock = lastblock + 1;
    var url = 'https://api.etherscan.io/api?module=account&sort=desc' + '&apikey='+ process.env.API_KEY + '&address=' + process.env.ADDRESS;
    var tokennfttx_data = fetch( url + '&action=tokennfttx' + '&startblock=' + startblock);
    var txlist_data = fetch( url + '&action=txlist' + '&startblock=' + startblock);
    Promise.all([tokennfttx_data, txlist_data]).then((values) => {
        Promise.all([values[0].json(), values[1].json()]).then(values => {
            var tokennfttx = values[0].result;
            var txlist = values[1].result;
            updateDatabase(tokennfttx, txlist, lastblock);
        });
    });
};

export default getTransferList;