import SomeModel from "./SomeModel.js";

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
    const result = await SomeModel.find({$or:[{from: req.params.wallet_address}, {to: req.params.wallet_address}]}).exec();
    res.json(result);
}

export const clear_collection = async () => {
    await SomeModel.deleteMany();
}
