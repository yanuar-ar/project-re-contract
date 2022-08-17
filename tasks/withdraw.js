const { task, types } = require("hardhat/config");
const { projectContractAddress } = require("./config.json");

task("withdraw", "")
  .addOptionalParam(
    "contractaddress",
    "The contract address",
    projectContractAddress,
    types.string
  )
  .setAction(async ({ contractaddress }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory("ProjectRe");
    const nftContract = nftFactory.attach(contractaddress);

    await (await nftContract.withdraw()).wait();

    console.log(`Withdraw success`);
  });
