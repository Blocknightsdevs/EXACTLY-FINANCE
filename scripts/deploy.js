// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Rewards = await hre.ethers.getContractFactory("Rewards");
  
  const accounts = await ethers.getSigners()
  const account = await accounts[0].getAddress()
  const rewards = await Rewards.deploy(account);

  await rewards.deployed();

  //send 1eth as deposit
  
  let balance = await accounts[0].getBalance();
  console.log("balance bd", balance);

  await rewards.deposit({value: ethers.utils.parseEther("1.0")});
  
   balance = await accounts[0].getBalance();
  console.log("balance ad", balance);

  //send 1 eth as reward
  await rewards.depositReward({value: ethers.utils.parseEther("1.0")});

  
   balance = await accounts[0].getBalance();
  console.log("balance ar", balance);

  //wirthdraw
  await rewards.wirthdraw();

  
   balance = await accounts[0].getBalance();
  console.log("balance aw", balance);

  console.log("rewards deployed to:", rewards.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
