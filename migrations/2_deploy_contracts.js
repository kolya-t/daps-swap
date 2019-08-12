const DAPSSwap = artifacts.require('DAPSSwap');

module.exports = function (deployer) {
    deployer.deploy(DAPSSwap, process.env.DAPS_ERC_ADDRESS);
};