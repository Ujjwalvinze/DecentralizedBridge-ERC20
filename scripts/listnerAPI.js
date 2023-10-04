const { ethers } = require("ethers");
require("dotenv").config();

async function receiveTransfer() {
    const localProvider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
    const ganacheProvider = new ethers.JsonRpcProvider("http://127.0.0.1:7545/");
    const localSigner = new ethers.Wallet(
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
        localProvider,
    );

    const ganacheSigner = new ethers.Wallet(
        "3e13cb114e8b6d65cc7eee7520786ce128eac21856bfc194554952f28d043370",
        ganacheProvider,
    );
    const localBridgeFile = require("../deployments/localhost/Bridge.json");
    const ganacheBridgeFile = require("../deployments/ganache/Bridge.json");

    const localBridgeABI = localBridgeFile.abi;
    const localBridgeAddress = localBridgeFile.address;

    const ganacheBridgeABI = ganacheBridgeFile.abi;
    const ganacheBridgeAddress = ganacheBridgeFile.address;
    console.log(localBridgeAddress, "\n", ganacheBridgeAddress);

    const localBridge = new ethers.Contract(localBridgeAddress, localBridgeABI, localSigner);
    const ganacheBridge = new ethers.Contract(
        ganacheBridgeAddress,
        ganacheBridgeABI,
        ganacheSigner,
    );

    localBridge.addListener("TransferInitiated", async (from, to, amount, nonce, signature) => {
        console.log(`from = ${from}\nto = ${to}`);

        await ganacheBridge.mintTransferredAmount(from, to, amount, nonce, signature);
        // const txReceipt = await txResponse.wait(1);

        console.log("Bridge Complete");
        // console.log(txResponse);
    });
}

receiveTransfer();
