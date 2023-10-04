const { ethers, getNamedAccounts } = require("hardhat");

// const { updateOwner } = require("./updateOwner");

const DECIMALS_FOR_ETH = 1000000000000000000;
async function mintToken() {
    const deployer = (await getNamedAccounts()).deployer;
    const signers = await ethers.getSigners();
    const user = signers[0];
    // console.log(deployer);
    const OurToken = await ethers.getContract("OurToken", user.address);

    // const IOurToken = require("../artifacts/contracts/IOurToken.sol");
    // console.log(deployer);

    const amount = ethers.parseEther("1000");
    const txResponse = await OurToken.mint(user.address, amount);
    // const txReceipt = await txResponse.wait(1);

    // const userBalance = await OurToken.balanceOf(deployer);

    // console.log(
    //     `User balance for [${deployer}] is now ${userBalance.toString() / DECIMALS_FOR_ETH}`,
    // );
}

mintToken()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
