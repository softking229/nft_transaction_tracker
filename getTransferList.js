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
    const { result: nft_tx_list } = fetch( url + '&action=tokennfttx' + '&startblock=' + startblock);
    
    for(const nft_tx of nft_tx_list) {
        const nft_tx_detail_resp = await fetch( url + '&action=txlist' + '&startblock=' + nft_tx.blockNumber + '&endblock' + nft_tx.blockNumber + '&address=' + nft_tx.from);
        console.log(nft_tx_detail_resp)
        const nft_tx_detail = nft_tx_detail_resp.result.find(each => each.hash == nft_tx.hash);
        var record = {
            blockNumber: nft_tx.blockNumber,
            from: nft_tx.from,
            to: nft_tx.to,
            tokenID: nft_tx.tokenID,
            tokenName: nft_tx.tokenName,
            price: nft_tx_detail.value,
            timeStamp: nft_tx.timeStamp
        };
        console.log(record);

    }

};

export default getTransferList;