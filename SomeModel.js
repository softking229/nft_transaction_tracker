import mongoose from 'mongoose';

var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
    blockNumber: String,
    from: String,
    to: String,
    tokenID: String,
    tokenName: String,
    Price: String,
    Date: String
});

// Compile model from schema
export default mongoose.model('sample_airbnb', SomeModelSchema );
