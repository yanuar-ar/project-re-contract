const { task, types } = require('hardhat/config');
const { projectContractAddress } = require('./config.json');

task('toggle-public', 'Toggle public minting')
  .addOptionalParam('contractaddress', 'The contract address', projectContractAddress, types.string)
  .setAction(async ({ contractaddress, root }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('ProjectRe');
    const nftContract = nftFactory.attach(contractaddress);

    let isPublicSale = await nftContract.isPublicSale();

    console.log('isPublicSale= ', isPublicSale);

    await (await nftContract.setPublicSale(!isPublicSale)).wait();

    isPublicSale = await nftContract.isPublicSale();

    console.log('isPublicSale= ', isPublicSale);
  });
