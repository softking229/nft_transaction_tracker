import dotenv from "dotenv";
import fetch from "node-fetch"
import SomeModel from './SomeModel.js'
import util from 'util'
import converter from 'hex2dec';
import hex2dec from 'hex2dec'
import fs from 'fs-extra'
import abiDecoder from 'abi-decoder'
dotenv.config({ silent: process.env.NODE_ENV === 'production' });
const abi = fs.readJsonSync("abi.json");
abiDecoder.addABI(abi);

var getTokenNumber = (input) => {
    const buyCallData = abiDecoder.decodeMethod(input).params[3]['value'];
    const token_number = buyCallData.substr(buyCallData.length - 64);
    return token_number;
}

var getTransferList = async() => {
    const queryResult = await SomeModel.find({}).sort({blockNumber: -1}).limit(1).exec();
    var startblock = 0;
    var latestTimeStamp = "0x0000";
    if( queryResult.length) {
        startblock = queryResult[0].blockNumber * 1;
        latestTimeStamp = queryResult[0].timeStamp;
    }
    console.log('checking', new Date());
    var url = 'https://api.etherscan.io/api?module=logs' + '&apikey=CUWP9CGZEG4FTWYUHK7C5MNVQMEJK7YGPK' + "&address=0x7be8076f4ea4a4ad08075c2508e481d6c946d12b" + "&toBlock=latest"
                + '&action=getLogs' + '&topic0=' + "0xc4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9";
    if( startblock)
        url += ("&fromBlock=" + startblock);
    else {
        const latestBlockHex=(await (await fetch('https://api.etherscan.io/api?module=proxy&action=eth_blockNumber&apikey=CUWP9CGZEG4FTWYUHK7C5MNVQMEJK7YGPK')).json()).result;
        const latestBlock = converter.hexToDec(latestBlockHex);
        url += ("&fromBlock=" + (latestBlock - 2));
    }
    const resp = await fetch( url);
    const { result: nft_tx_list } = await resp.json();
    var results = [];
    console.log(nft_tx_list.length);

    var tokenID_list = [];
    var inserted_cnt = 0;
    for(let nft_tx of nft_tx_list) {
        const existCheck = await SomeModel.find({transactionHash: nft_tx_list.transactionHash}).limit(1).exec();
        if( existCheck.length)
            continue;
        if( tokenID_list.find(each => each.hash == nft_tx.transactionHash) === undefined) {
            url = 'https://api.etherscan.io/api?module=account&action=txlist&address=0x' + nft_tx.topics[2].substr(26) 
                + '&startblock=' + nft_tx.blockNumber + '&endblock=' + nft_tx.blockNumber + '&apikey=CUWP9CGZEG4FTWYUHK7C5MNVQMEJK7YGPK';
            const tokenID_resp = await fetch(url);
            tokenID_list = (await tokenID_resp.json()).result;
        }
        const tokenID_tx = tokenID_list.find(each => each.hash == nft_tx.transactionHash);
        const tokenID = getTokenNumber(tokenID_tx.input);
        var result_t = {
            blockNumber: nft_tx.blockNumber,
            transactionHash: nft_tx.transactionHash,
            from: "0x"+nft_tx.topics[2].substr(26),
            to: "0x"+nft_tx.topics[1].substr(26),
            tokenID: tokenID,
            tokenName: 'tx.tokenName',
            value: converter.hexToDec(nft_tx.data.substr(130)),
            timeStamp: nft_tx.timeStamp
        };
        //results.push(0x1618406d203aefa14526f77d79fdbeac9d42137b);
        SomeModel.create(result_t);
        inserted_cnt ++;
    }
    //SomeModel.insertMany(results);
    console.log("inserted " + inserted_cnt + " rows");
};

export default getTransferList;