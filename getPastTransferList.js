import dotenv from "dotenv";
import fetch from "node-fetch"
import SomeModel from './SomeModel.js'
import util from 'util'
import converter from 'hex2dec';
import fs from 'fs-extra'
import abiDecoder from 'abi-decoder'
dotenv.config({ silent: process.env.NODE_ENV === 'production' });
const timer = util.promisify(setTimeout);
const abi = fs.readJsonSync("abi.json");
abiDecoder.addABI(abi);