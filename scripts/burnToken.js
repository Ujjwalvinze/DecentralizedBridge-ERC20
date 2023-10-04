const { ethers, getNamedAccounts } = require("hardhat");

const DECIMALS_FOR_ETH = 1000000000000000000;
async function mintToken() {
    const deployer = (await getNamedAccounts()).deployer;
    const OurToken = await ethers.getContract("OurToken");

    // const IOurToken = require("../artifacts/contracts/IOurToken.sol");
    // console.log(deployer);

    const amount = ethers.parseEther("1");
    const txResponse = await OurToken.burn(deployer, amount);
    const txReceipt = await txResponse.wait(1);

    const userBalance = (await OurToken.balanceOf(deployer)).toString();

    console.log(`User balance for [${deployer}] is now ${userBalance / DECIMALS_FOR_ETH}`);
}

mintToken()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
