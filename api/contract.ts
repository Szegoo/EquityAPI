import { ethers } from "ethers";
import {ABI, address} from '../ABI';
require('dotenv').config();
console.log(process.env.PRIVATE_KEY);

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_ENDPOINT);

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

console.log(signer.address);

export async function checkActivity() {
    const ListContract = await new ethers.Contract(
        address, ABI, provider
    );
    const listWithSigner = await ListContract.connect(signer);

    const tx = await listWithSigner.check();

    tx.wait();
}