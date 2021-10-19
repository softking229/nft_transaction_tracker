import SomeModel from "./SomeModel.js";

const get_result = async ( req, res) => {
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

const clear_collection = async () => {
    await SomeModel.deleteMany();
}

export default {
    get_result,
    clear_collection
}