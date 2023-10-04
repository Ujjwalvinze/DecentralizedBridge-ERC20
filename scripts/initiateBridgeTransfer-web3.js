const { ethers, getNamedAccounts, network } = require("hardhat");
const web3 = require("web3");
require("dotenv").config();

async function initiateBridgeTransfer() {
    const DECIMALS_FOR_ETH = 1000000000000000000;
    const deployer = (await getNamedAccounts()).deployer;
    const AMOUNT = ethers.parseEther("1");

    const bridge = await ethers.getContract("Bridge");

    const users = await ethers.getSigners();
    const someUserAddress = "0x89A4e662CCb3819F881f488dBa96c35093Eec624";

    // sender chain nonce
    let nonce = 1;

    console.log(nonce);

    // ------------------------------ WORKSS ----------------------------
    // from, to, address
    const encodedMessage = web3.utils
        .soliditySha3(
            { t: "address", v: deployer },
            { t: "address", v: someUserAddress },
            { t: "uint256", v: AMOUNT },
            { t: "uint256", v: nonce },
        )
        .toString("hex");

    const PRIVATE_KEY = "0x" + process.env.PRIVATE_KEY.toString();
    const { signature } = web3.eth.accounts.sign(encodedMessage, PRIVATE_KEY);

    console.log(`Expected message = ${encodedMessage}`);
    console.log(`Expected signature = ${signature}`);

    // to, amount, nonce, signature;
    const transferTx = await bridge.initiateTransfer(someUserAddress, AMOUNT, nonce, signature);
    console.log(deployer);
    const txReceipt = await transferTx.wait(1);

    console.log("Bridge Transfer Inititated...");
}

initiateBridgeTransfer()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
