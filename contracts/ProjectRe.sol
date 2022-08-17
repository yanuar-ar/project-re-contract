//SPDX-License-Identifier: unlicensed

pragma solidity ^0.8.15;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract ProjectRe is ERC721A,ERC2981, Ownable {

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant MAX_DEV_MINTS = 100;

    uint256 public MAX_MINT_PUBLIC_SALE = 1;
    uint256 public MAX_MINT_WHITELIST_SALE = 1;

    uint256 public constant PUBLIC_SALE_PRICE = 0.055 ether;
    uint256 public constant WHITELIST_SALE_PRICE = 0.065 ether;

    bytes32 public merkleRoot;

    address public constant withdrawWallet = 0xB3acE183a173dc497F71f1A66bA1cEEF8773923D;

    bool public isPublicSale = false;
    bool public isWhitelistSale = false;

    //dev mint
    uint256 public DEV_MINTS;

    string public baseTokenURI = "https://ikzttp.mypinata.cloud/ipfs/QmQFkLSQysj94s5GvTHPyzTxrawwtjgiiYS2TBLgrvw8CW/";

    mapping(address => uint256) public whitelistMintData;
    mapping(address => uint256) public publicMintData;

    constructor() ERC721A("Project Re", "PRE") {
      _setDefaultRoyalty(msg.sender, 500);
    }

    function whitelistMint(uint256 quantity, bytes32[] memory proof) external payable {
      require(isWhitelistSale, "Whitelist sale not active");
      require(quantity <= MAX_MINT_WHITELIST_SALE, "Mint quantity exceeds the limit");
      require(whitelistMintData[msg.sender] + quantity <= MAX_MINT_WHITELIST_SALE, "Max mint exceeds the limit");
      require(msg.value >= (WHITELIST_SALE_PRICE * quantity), "Not enough ETH to pay");
      require(isWhitelist(proof), "User not on Whitelist");

      whitelistMintData[msg.sender] += quantity;
      _mint(msg.sender, quantity);
    }

    function publicMint(uint256 quantity) external payable {
      require(isPublicSale, "Public sale not active");
      require(quantity <= MAX_MINT_PUBLIC_SALE, "Mint quantity exceeds the limit");
      require(publicMintData[msg.sender] + quantity <= MAX_MINT_PUBLIC_SALE, "Max mint exceeds the limit");
      require(msg.value >= (PUBLIC_SALE_PRICE * quantity), "Not enough ETH to pay");

      publicMintData[msg.sender] += quantity;
      _mint(msg.sender, quantity);
    }

    function devMint(uint256 quantity) external onlyOwner {
      require(totalSupply() + quantity <= MAX_SUPPLY,"Sold out");
      require(DEV_MINTS + quantity <= MAX_DEV_MINTS,"Dev Mint sold out");

      DEV_MINTS += quantity;
      _mint(msg.sender, quantity);
    }


    // token URI
    function setBaseURI(string calldata _baseTokenURI) external onlyOwner {
        baseTokenURI = _baseTokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
      require( _exists(tokenId), "Token does not exists !");
      return bytes(baseTokenURI).length > 0 ? string(abi.encodePacked(baseTokenURI, Strings.toString(tokenId))) : "";
    }

    //withdraw
    function withdraw() external onlyOwner {
      require(address(this).balance > 0, "No amount to withdraw");
      (bool success, ) = withdrawWallet.call{ value: address(this).balance }("");
      require(success, "Unable to transfer ETH");
    }

    // private
    function _startTokenId() internal pure override returns (uint256){
      return 1;
    }

    //whitelist
    function isWhitelist(bytes32[] memory proof) internal view returns (bool) {
      return MerkleProof.verify(proof, merkleRoot, keccak256(abi.encodePacked(msg.sender)));
    }

    function setMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
      merkleRoot = _merkleRoot;
    }

    function setPublicSale(bool status) public onlyOwner {
      isPublicSale = status;
    }

    function setWhitelistSale(bool status) public onlyOwner {
      isWhitelistSale  = status;
    }

    function setRoyalties(address to, uint96 amount)  external onlyOwner {
        _setDefaultRoyalty(to, amount);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721A, ERC2981) returns (bool) {
      // IERC165: 0x01ffc9a7, IERC721: 0x80ac58cd, IERC721Metadata: 0x5b5e139f, IERC29081: 0x2a55205a
      return ERC721A.supportsInterface(interfaceId) || ERC2981.supportsInterface(interfaceId);
    }


}