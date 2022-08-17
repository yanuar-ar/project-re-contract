const { task, types } = require('hardhat/config');
const { projectContractAddress } = require('./config.json');

task('set-base-uri', 'Set base URI')
  .addOptionalParam('contractaddress', 'The contract address', projectContractAddress, types.string)
  .setAction(async ({ contractaddress }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('ProjectRe');
    const nftContract = nftFactory.attach(contractaddress);

    await (await nftContract.setBaseURI('https://projectre.com/')).wait();
    console.log(`Success to set base URI`);

    const tokenURI = await nftContract.tokenURI(1);

    console.log('Check token URI: ', tokenURI);
  });
