const { task, types } = require('hardhat/config');
const { projectContractAddress } = require('./config.json');

task('mint-public', 'Mint for public')
  .addOptionalParam('contractaddress', 'The contract address', projectContractAddress, types.string)
  .addOptionalParam('quantity', 'Mint quanty', 1, types.int)
  .setAction(async ({ contractaddress, quantity }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('ProjectRe');
    const nftContract = nftFactory.attach(contractaddress);

    const receipt = await (
      await nftContract.publicMint(quantity, {
        value: ethers.utils.parseEther('1.0'),
      })
    ).wait();

    console.log(`NFT minted`);

    const totalSupply = await nftContract.totalSupply();

    console.log('total supply= ', ethers.BigNumber.from(totalSupply).toNumber());
  });
