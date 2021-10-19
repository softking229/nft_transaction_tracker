import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
    blockNumber: String,
    from: String,
    to: String,
    tokenNumber: String,
    //tokenName: String,
    value: String,
    timeStamp: String,
    transactionHash: { type: String, unique: true }
});

// Compile model from schema
export default mongoose.model('sample_airbnb', SomeModelSchema );
