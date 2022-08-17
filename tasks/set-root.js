const { task, types } = require("hardhat/config");
const { projectContractAddress } = require("./config.json");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { addresses } = require("./whitelist.json");

const leafNodes = addresses.map((addr) => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, {
  sortPairs: true,
});
const rootHash = merkleTree.getRoot();

task("set-root", "Set root of merkletree")
  .addOptionalParam(
    "contractaddress",
    "The contract address",
    projectContractAddress,
    types.string
  )
  .addOptionalParam(
    "root",
    "merkletree root",
    "0x" + rootHash.toString("hex"),
    types.string
  )
  .setAction(async ({ contractaddress, root }, { ethers }) => {
    const nftFactory = await ethers.getContractFactory("ProjectRe");
    const nftContract = nftFactory.attach(contractaddress);

    await (await nftContract.setMerkleRoot(root)).wait();
    //console.log(receipt);

    console.log(`Success`);

    const merkleRoot = await nftContract.merkleRoot();

    console.log("Merkle root= ", merkleRoot);
  });
