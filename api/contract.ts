import { ethers } from "ethers";
import {ABI, address} from '../ABI';
require('dotenv').config();
console.log(process.env.PRIVATE_KEY);

const provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_ENDPOINT);

const signer = new ethers.Wallet("5a523dc46a58817c4c59c3acee9bd0a0f9c1291b572aa9a636d010c7c244e578", provider);

console.log(signer.address);

export async function checkActivity() {
    console.log("check activity called :D");
    const ListContract = await new ethers.Contract(
        address, ABI, provider
    );
    const listWithSigner = await ListContract.connect(signer);

    const tx = await listWithSigner.check();

    tx.wait();
}
export async function sendList() {
    console.log("send list called :D");
    const ListContract = await new ethers.Contract(
        address, ABI, provider
    );
    const listWithSigner = await ListContract.connect(signer);
    const tx = await listWithSigner.checkList();
    tx.wait();
}