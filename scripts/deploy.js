const { task } = require("hardhat/config");
const { getAccount } = require("./helper");
const fs = require("fs");

const info = require("./token_info.json");

task("check-balance", "Prints out the balance of your account").setAction(
  async function (taskArguments, hre) {
    const account = getAccount();
    console.log(
      `Account balance for ${account.address}: ${
        (await account.getBalance()) / 10.0 ** 18
      }`
    );
  }
);

task("deploy", "Deploys the NFT.sol contract")
  .addParam("token", "The name of token")
  .setAction(async function (taskArguments, hre) {
    const nftContractFactory = await hre.ethers.getContractFactory(
      taskArguments.token,
      getAccount(hre)
    );
    const nft = await nftContractFactory.deploy();
    console.log(`Contract deployed to address: ${nft.address}`);

    // update token address info
    info[taskArguments.token] = nft.address;
    file_name = __dirname + "/token_info.json";
    fs.writeFile(file_name, JSON.stringify(info), (err) => {
      if (err) return console.log(err);
    });
  });
