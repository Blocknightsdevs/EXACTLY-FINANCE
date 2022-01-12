// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  
  const Rewards = await hre.ethers.getContractFactory("Rewards");
  
  const accounts = await ethers.getSigners()
  const team = await accounts[0].getAddress()
  const rewards = await Rewards.deploy(team);

  await rewards.deployed();

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
