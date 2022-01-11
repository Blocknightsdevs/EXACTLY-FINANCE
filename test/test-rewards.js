const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Rewards", function () {

  it("Should make a deposit of user", async function () {
    
    const accounts = await ethers.getSigners()
    const Rewards = await ethers.getContractFactory("Rewards");
    const account = await accounts[0].getAddress()
    const rewards = await Rewards.deploy(account);
    await rewards.deployed();

    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
    
    let contractBalance = await ethers.provider.getBalance(rewards.address);
    expect(contractBalance).to.equal(ethers.utils.parseEther("1.0"));
  });

  it("Should make a deposit of team (reward)", async function () {
    
    const accounts = await ethers.getSigners()
    const Rewards = await ethers.getContractFactory("Rewards");
    const account = await accounts[0].getAddress()
    const rewards = await Rewards.deploy(account);
    await rewards.deployed();

    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
    await rewards.depositReward({value: ethers.utils.parseEther("1.0")});
    
    let contractBalance = await ethers.provider.getBalance(rewards.address);
    expect(contractBalance).to.equal(ethers.utils.parseEther("2.0"));

  });

  it("Should wirthdraw without reward", async function () {
    
    const accounts = await ethers.getSigners()
    const Rewards = await ethers.getContractFactory("Rewards");
    const account = await accounts[0].getAddress()
    const rewards = await Rewards.deploy(account);
    await rewards.deployed();

    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
    
    let beforeWirthdraw = await ethers.provider.getBalance(account);
    let tx = await rewards.wirthdraw();
    let afterWirthdraw = await ethers.provider.getBalance(account);

    const receipt = await tx.wait();

    expect(afterWirthdraw.add(receipt.gasUsed*receipt.effectiveGasPrice)).to.eq(beforeWirthdraw.add(ethers.utils.parseEther("1")));

  });

  it("Should wirthdraw expected amount", async function () {
    //for time increase https://ethereum.stackexchange.com/questions/86633/time-dependent-tests-with-hardhat
    //'connect' https://hardhat.org/tutorial/testing-contracts.html#using-a-different-account
    const accounts = await ethers.getSigners()
    const Rewards = await ethers.getContractFactory("Rewards");
    const account = await accounts[0]
    const team = await accounts[1];
    const account2 = await accounts[2]
    const rewards = await Rewards.deploy(team.getAddress());

    await rewards.deployed();

    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
    
    await rewards.connect(account2).deposit({value: ethers.utils.parseEther("2.0")});
     
    await rewards.connect(team).depositReward({value: ethers.utils.parseEther("1.0")});

    let beforeWirthdraw = await ethers.provider.getBalance(account.getAddress());
    let tx = await rewards.wirthdraw();
    let afterWirthdraw = await ethers.provider.getBalance(account.getAddress());

    const receipt = await tx.wait();

    //1(deposit)+1(deposit)+0.5(reward) = 2.5eth
    expect(afterWirthdraw.add(receipt.gasUsed*receipt.effectiveGasPrice)).to.eq(beforeWirthdraw.add(ethers.utils.parseEther("2.5")));


  });

  

  it("Should wirthdraw multiple rewards", async function () {
    //for time increase https://ethereum.stackexchange.com/questions/86633/time-dependent-tests-with-hardhat
    //'connect' https://hardhat.org/tutorial/testing-contracts.html#using-a-different-account
    const accounts = await ethers.getSigners()
    const Rewards = await ethers.getContractFactory("Rewards");
    const account = await accounts[0]
    const team = await accounts[1];
    const account2 = await accounts[2]
    const rewards = await Rewards.deploy(team.getAddress());

    await rewards.deployed();

    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
    
    await rewards.connect(account2).deposit({value: ethers.utils.parseEther("2.0")});
     
    await rewards.connect(team).depositReward({value: ethers.utils.parseEther("1.0")});

    
    //7 days from now
    await ethers.provider.send("evm_increaseTime", [604800]); //604800 -> 1 week 

    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
    
    await rewards.connect(account2).deposit({value: ethers.utils.parseEther("2.0")});
     
    await rewards.connect(team).depositReward({value: ethers.utils.parseEther("1.0")});

  
    let beforeWirthdraw = await ethers.provider.getBalance(account.getAddress());
    let tx = await rewards.wirthdraw();
    let afterWirthdraw = await ethers.provider.getBalance(account.getAddress());

    let receipt = await tx.wait();

    //2*(1(deposit)+1(deposit)+0.5(reward)) = 5eth
    expect(afterWirthdraw.add(receipt.gasUsed*receipt.effectiveGasPrice)).to.eq(beforeWirthdraw.add(ethers.utils.parseEther("5")));

  });

  
  it("Should not deposit reward if not team", async function () {
    
    const accounts = await ethers.getSigners()
    const Rewards = await ethers.getContractFactory("Rewards");
    const team = await accounts[1];
    const rewards = await Rewards.deploy(team.getAddress());

    await rewards.deployed();

    //not team
    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
  
     
    await expect(rewards.depositReward({value: ethers.utils.parseEther("1.0")})).to.be.revertedWith('only team can deposit rewards');
    

  });

  
  
  it("Should not deposit reward if not 1 week later", async function () {
    
    const accounts = await ethers.getSigners()
    const Rewards = await ethers.getContractFactory("Rewards");
    const team = await accounts[1];
    const rewards = await Rewards.deploy(team.getAddress());

    await rewards.deployed();

    await rewards.deposit({value: ethers.utils.parseEther("1.0")});
  
    rewards.connect(team).depositReward({value: ethers.utils.parseEther("1.0")})
    await expect(rewards.connect(team).depositReward({value: ethers.utils.parseEther("1.0")})).to.be.revertedWith('not 7 days after last reward deposit');
    

  });
});
