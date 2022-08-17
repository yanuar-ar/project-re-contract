const { task, types } = require('hardhat/config');
const { projectContractAddress } = require('./config.json');

task('check-config', 'Check config')
  .addOptionalParam('contractaddress', 'The contract address', projectContractAddress, types.string)
  .setAction(async ({ contractaddress }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory('ProjectRe');
    const nftContract = nftFactory.attach(contractaddress);

    // const tokenURI = await nftContract.tokenURI(1);

    const MAX_SUPPLY = await nftContract.MAX_SUPPLY();
    const MAX_DEV_MINTS = await nftContract.MAX_DEV_MINTS();

    const MAX_MINT_PUBLIC_SALE = await nftContract.MAX_MINT_PUBLIC_SALE();
    const MAX_MINT_WHITELIST_SALE = await nftContract.MAX_MINT_WHITELIST_SALE();

    const PUBLIC_SALE_PRICE = await nftContract.PUBLIC_SALE_PRICE();
    const WHITELIST_SALE_PRICE = await nftContract.WHITELIST_SALE_PRICE();

    const isPublicSale = await nftContract.isPublicSale();
    const isWhitelistSale = await nftContract.isWhitelistSale();

    // const royaltyInfo = await nftContract.royaltyInfo();

    console.log('MAX_SUPPLY= ', ethers.BigNumber.from(MAX_SUPPLY).toNumber());
    console.log('MAX_DEV_MINTS= ', ethers.BigNumber.from(MAX_DEV_MINTS).toNumber());
    console.log('MAX_MINT_PUBLIC_SALE= ', ethers.BigNumber.from(MAX_MINT_PUBLIC_SALE).toNumber());
    console.log(
      'MAX_MINT_WHITELIST_SALE= ',
      ethers.BigNumber.from(MAX_MINT_WHITELIST_SALE).toNumber(),
    );
    console.log('PUBLIC_SALE_PRICE= ', ethers.utils.formatEther(PUBLIC_SALE_PRICE), 'ETH');
    console.log('WHITELIST_SALE_PRICE= ', ethers.utils.formatEther(WHITELIST_SALE_PRICE), 'ETH');

    //console.log("royaltyInfo= ", royaltyInfo);

    console.log('isPublicSale= ', isPublicSale);

    console.log('isWhitelistSale= ', isWhitelistSale);
  });
