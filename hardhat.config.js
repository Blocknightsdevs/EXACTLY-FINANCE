require("@nomiclabs/hardhat-waffle");

// This is a sample Hardhat task. To learn how to create your own go to
// contract address rinkeby: 0x9940B95cDAE949D50DbD8817C2Da19be7Ec49E7a
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("balance", "Prints contract balance",async (taskArgs, hre) => {
  
    const contractAddress = "0x9940B95cDAE949D50DbD8817C2Da19be7Ec49E7a";
    let balance = await hre.ethers.provider.getBalance(contractAddress); 

    console.log(balance);
  });


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.4",

};
