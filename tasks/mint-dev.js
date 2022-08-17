const { task, types } = require("hardhat/config");
const { projectContractAddress } = require("./config.json");

task("mint-dev", "Mint for dev")
  .addOptionalParam(
    "contractaddress",
    "The contract address",
    projectContractAddress,
    types.string
  )
  .addOptionalParam("quantity", "Mint quanty", 1, types.int)
  .setAction(async ({ contractaddress, quantity }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory("ProjectRe");
    const nftContract = nftFactory.attach(contractaddress);

    const receipt = await (await nftContract.devMint(quantity)).wait();
    //console.log(receipt);

    if (!receipt.events?.length) {
      throw new Error("Failed to mint");
    }
    console.log(`NFT minted`);

    const totalSupply = await nftContract.totalSupply();

    console.log(
      "total supply= ",
      ethers.BigNumber.from(totalSupply).toNumber()
    );
  });
