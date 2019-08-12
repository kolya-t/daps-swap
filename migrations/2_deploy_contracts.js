const DAPSSwap = artifacts.require("DAPSSwap");
// const DAPSTOKEN = artifacts.require("DAPSTOKEN");

module.exports = function(deployer, network, [owner]) {
  // deployer.deploy(DAPSTOKEN, owner, 1000).then(dapsToken => deployer.deploy(DAPSSwap, dapsToken.address));

  deployer.deploy(DAPSSwap, process.env.DAPS_ERC_ADDRESS);
};
