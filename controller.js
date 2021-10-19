import SomeModel from "./SomeModel.js";

var get_result = async function ( req, res) {
    const from = req.query.from;
    const to = req.query.to;
    const tokenID = req.query.tokenID;

    var query = {};
    if( from !== undefined)
        query['from'] = from;
    if( to !== undefined)
        query['to'] = to;
    if( tokenID !== undefined)
        query['tokenID'] = tokenID;

    var result = await SomeModel.find(query).exec();
    res.json(result);
}

export default get_result;