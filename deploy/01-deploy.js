const { network, ethers } = require("hardhat");
const { developmentChains, networkConfig } = require("../helper-hardhat.config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    log("Deploying Token...");
    const OurToken = await deploy("OurToken", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log("Token Deployed. Deploying Bridge...");

    const Bridge = await deploy("Bridge", {
        from: deployer,
        args: [OurToken.address],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    log(`Bridge deployed! At : ${Bridge.address}`);

    // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    //     log("Verifying...");
    //     await verify(Bridge.address, [OurToken.address]);
    //     await verify(OurToken.address, []);
    // }
};

// module.exports.tags = ["all", "bridgeToken"];
