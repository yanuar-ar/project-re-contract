const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('Project Re: testing', () => {
  let nftContract;

  before(async () => {
    [owner, nonOwner] = await ethers.getSigners();
    const NFTContract = await ethers.getContractFactory('ProjectRe');
    nftContract = await NFTContract.deploy();
  });

  describe('Deployment', async () => {
    it('should deployed', async function () {
      expect(nftContract.address).to.not.equal('');
    });
  });

  describe('Testing ERC721 functionality', async () => {
    it('should set symbol', async () => {
      expect(await nftContract.symbol()).to.eq('PRE');
    });

    it('should set name', async () => {
      expect(await nftContract.name()).to.eq('Project Re:');
    });

    it('devMint should minted by owner', async () => {
      await expect(await nftContract.devMint(1)).to.be.reverted;
    });

    it('devMint should reverted by non owner', async () => {
      await expect(nftContract.connect(nonOwner).devMint(1)).to.be.reverted;
    });
  });
});
