// var Paster = artifacts.require("./Paster.sol");

// module.exports = function(deployer) {
//   deployer.deploy(Paster);
// };

const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const Paster = artifacts.require("Paster");

module.exports = async function (deployer) {
  const instance = await deployProxy(Paster, [], { deployer });
  console.log("Deployed", instance.address);
};
