// Load dependencies
const { expect } = require('chai');

const { ethers } = require('hardhat');

describe('ERC721A LOCKABLE TESTS', () => {
  let deployer;
  let random;
  let random2;
  let unlocker;
  let spender;
  let allowancesigner;
  let operator;
  const ADDRESS_ZERO = ethers.constants.AddressZero;
  let tokenId;

  beforeEach(async () => {
    [deployer, random, random2, unlocker, spender, allowancesigner, operator] =
      await ethers.getSigners();

    const MockNFT = await ethers.getContractFactory('ProjectRe');
    nftContract = await MockNFT.deploy();
  });

  describe('Deployment', async function () {
    it('deploys', async function () {
      expect(nftContract.address).to.not.equal('');
    });
  });

  /*  ====== ====== ====== ====== ====== ======
   *
   *   ERC721 A LOCKING AND UNLOCKING TESTS
   *
   * ====== ====== ====== ====== ======  ====== */

  describe('ERC721A Lockable NFT Locking and unlocking tests', async function () {
    beforeEach(async () => {
      await nftContract.connect(deployer).devMint(1);
      tokenId = ethers.BigNumber.from(await nftContract.balanceOf(deployer.address)).toNumber();
      //console.log((await nftContract.totalSupply()).toString());
    });

    it('Owner can lock his own token', async function () {
      await nftContract.connect(deployer).lock(await unlocker.address, tokenId);

      await expect(await nftContract.getLocked(1)).to.be.equal(await unlocker.address);
    });

    it('Owner can not approve locked token', async function () {
      await nftContract.connect(deployer).lock(await unlocker.address, tokenId);

      expect(await nftContract.getLocked(tokenId)).to.be.equal(unlocker.address);

      await expect(
        nftContract.connect(deployer).approve(unlocker.address, tokenId),
      ).to.be.revertedWith('Can not approve locked token');
    });

    it('Non Owner can not lock token', async function () {
      await expect(nftContract.connect(random).lock(unlocker.address, tokenId)).to.be.revertedWith(
        'NOT_AUTHORIZED',
      );
    });

    it('Approved can not lock token', async function () {
      await nftContract.connect(deployer).approve(await random2.address, tokenId);

      await expect(nftContract.connect(random).lock(unlocker.address, tokenId)).to.be.revertedWith(
        'NOT_AUTHORIZED',
      );
    });

    it('Approved For All can lock token', async function () {
      expect(await nftContract.ownerOf(tokenId)).to.equal(await deployer.address);

      // verify that operator is not approved before permit is used
      expect(await nftContract.isApprovedForAll(await deployer.address, await operator.address)).to
        .be.false;

      //check that before approval was not able to lock
      await expect(
        nftContract.connect(operator).lock(unlocker.address, tokenId),
      ).to.be.revertedWith('NOT_AUTHORIZED');

      await nftContract.connect(deployer).setApprovalForAll(operator.address, true);
      await nftContract.connect(operator).lock(unlocker.address, tokenId);

      expect(await nftContract.getLocked(tokenId)).to.be.equal(await unlocker.address);
    });

    it('Non unlocker even deployer can not unlock', async function () {
      await nftContract.connect(deployer).lock(await unlocker.address, tokenId);

      await expect(nftContract.connect(deployer).unlock(tokenId)).to.be.revertedWith(
        'NOT_UNLOCKER',
      );
    });

    it('Unlocker can unlock', async function () {
      //lock
      await nftContract.connect(deployer).lock(await unlocker.address, tokenId);
      expect(await nftContract.getLocked(tokenId)).to.be.equal(await unlocker.address);

      //unlock
      await nftContract.connect(unlocker).unlock(tokenId);
      expect(await nftContract.getLocked(tokenId)).to.be.equal(ADDRESS_ZERO);
    });

    it('owner can not transfer locked token', async function () {
      await nftContract.connect(deployer).lock(await unlocker.address, tokenId);

      await expect(
        nftContract
          .connect(deployer)
          .transferFrom(await deployer.address, await random2.address, tokenId),
      ).to.be.revertedWith('LOCKED');
    });

    it('Unlocker can transfer locked token', async function () {
      //lock
      await nftContract.connect(deployer).lock(await unlocker.address, tokenId);
      expect(await nftContract.getLocked(tokenId)).to.be.equal(await unlocker.address);

      //unlock
      await nftContract
        .connect(unlocker)
        .transferFrom(await deployer.address, await random2.address, tokenId);
      expect(await nftContract.ownerOf(tokenId))
        .to.be.equal(await random2.address)
        .and.not.to.be.equal(ADDRESS_ZERO);
    });
  });
});
