const { task, types } = require('hardhat/config');
const { projectContractAddress } = require('./config.json');

task('toggle-whitelist', 'Toggle whitelist minting')
  .addOptionalParam('contractaddress', 'The contract address', projectContractAddress, types.string)
  .setAction(async ({ contractaddress, root }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('ProjectRe');
    const nftContract = nftFactory.attach(contractaddress);

    let isWhitelist = await nftContract.isWhitelistSale();

    console.log('isWhitelist= ', isWhitelist);

    await (await nftContract.setWhitelistSale(!isWhitelist)).wait();

    isWhitelist = await nftContract.isWhitelistSale();

    console.log('isWhitelist= ', isWhitelist);
  });
