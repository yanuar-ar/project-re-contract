const { task, types } = require('hardhat/config');
const { projectContractAddress } = require('./config.json');
const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const { addresses } = require('./whitelist.json');

task('mint-whitelist', 'Mints for whitelist')
  .addOptionalParam('contractaddress', 'The contract address', projectContractAddress, types.string)
  .addOptionalParam('quantity', 'Mint quantyty', 1, types.int)
  .setAction(async ({ contractaddress, quantity }, { ethers }) => {
    const leafNodes = addresses.map(addr => keccak256(addr));
    const merkleTree = new MerkleTree(leafNodes, keccak256, {
      sortPairs: true,
    });

    const claimingAddress = keccak256(process.env.WALLET_PUBLIC_KEY);

    const hexProof = merkleTree.getHexProof(claimingAddress);

    const nftFactory = await ethers.getContractFactory('ProjectRe');
    const nftContract = nftFactory.attach(contractaddress);

    await (
      await nftContract.witelistMint(quantity, hexProof, {
        value: ethers.utils.parseEther('1.0'),
      })
    ).wait();

    console.log(`NFT minted`);

    const totalSupply = await nftContract.totalSupply();

    console.log('total supply= ', ethers.BigNumber.from(totalSupply).toNumber());
  });
