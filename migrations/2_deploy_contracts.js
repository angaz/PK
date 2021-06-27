var PKToken = artifacts.require("./PKToken.sol");

module.exports = function(deployer) {
  deployer.deploy(PKToken);
};
