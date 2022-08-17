const { task } = require("hardhat/config");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { addresses } = require("./whitelist.json");

task("generate-merkletree", "Generate merkletree").setAction(async () => {
  const leafNodes = addresses.map((addr) => keccak256(addr));
  const merkleTree = new MerkleTree(leafNodes, keccak256, {
    sortPairs: true,
  });

  const rootHash = merkleTree.getRoot();

  console.log("Root Hash: ", "0x" + rootHash.toString("hex"));

  const claimingAddress = keccak256(process.env.WALLET_PUBLIC_KEY);

  const hexProof = merkleTree.getHexProof(claimingAddress);
  console.log(hexProof);

  console.log(merkleTree.verify(hexProof, claimingAddress, rootHash));
});
