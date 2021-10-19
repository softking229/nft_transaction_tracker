import SomeModel from "./SomeModel.js";
import {getTransferList} from './getTransferList_1.js';

export const getAll = async ( req, res) => {
    const from = req.query.from;
    const to = req.query.to;
    const tokenID = req.query.tokenID;

    const query = {};
    if( from !== undefined)
        query['from'] = from;
    if( to !== undefined)
        query['to'] = to;
    if( tokenID !== undefined)
        query['tokenID'] = tokenID;

    const result = await SomeModel.find(query).exec();
    res.json(result);
}

export const getByWallet = async ( req, res) => {
    let topic2 = "0x000000000000000000000000" + req.params.wallet_address.substr(2);
    var url = 'https://api.etherscan.io/api?module=logs' + '&apikey=CUWP9CGZEG4FTWYUHK7C5MNVQMEJK7YGPK' + "&address=0x7be8076f4ea4a4ad08075c2508e481d6c946d12b" + "&toBlock=latest" + '&fromBlock=0'
                + '&action=getLogs' + '&topic0=' + "0xc4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9" + "&topic2=" + topic2;
    let result = await getTransferList(url, false);
    url = 'https://api.etherscan.io/api?module=logs' + '&apikey=CUWP9CGZEG4FTWYUHK7C5MNVQMEJK7YGPK' + "&address=0x7be8076f4ea4a4ad08075c2508e481d6c946d12b" + "&toBlock=latest" + '&fromBlock=0'
                + '&action=getLogs' + '&topic0=' + "0xc4109843e0b7d514e4c093114b863f8e7d8d9a458c372cd51bfe526b588006c9" + "&topic1=" + topic2;
                console.log(url);
    result = result.concat(await getTransferList(url, false));
    res.json(result);
}

export const clear_collection = async () => {
    await SomeModel.deleteMany();
}
