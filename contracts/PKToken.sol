// SPDX-License-Identifier: MIT
pragma solidity <0.9.0;
pragma experimental ABIEncoderV2;

contract PKToken {
  struct PK {
    uint timestamp;
    address from;
  }
  struct PKData {
    uint id;
    uint timestamp;
    address from;
    address to;
  }
  event Gee(address from, address to, uint tokenID);
  event Log(uint tokenID);

  string private _name = "PoesKlap";
  string private _symbol = "PK";

  PK[] private _tokens;
  mapping (uint => address) private _owners;
  mapping (address => uint) private _balances;
  mapping (address => uint[]) private _ownersTokens;

  function gee(address to) public returns (bool) {
    require(to != address(0), "gee to the zero address");
    address from = msg.sender;
    require(to != from, "gee to own address");
    uint tokenID = _tokensCount();

    _tokens.push(PK({
      timestamp: block.timestamp,
      from: from
    }));
    _owners[tokenID] = to;
    _balances[to] += 1;
    _ownersTokens[to].push(tokenID);

    emit Gee(from, to, tokenID);
    return true;
  }

  function balanceOf(address owner) public view returns (uint) {
    require(owner != address(0), "balance query for the zero address");
    return _balances[owner];
  }

  function ownerOf(uint tokenID) public view returns (address) {
    require(_tokenExists(tokenID), "owner query for nonexistant token");
    return _owners[tokenID];
  }

  function name() public view returns (string memory) {
    return _name;
  }

  function symbol() public view returns (string memory) {
    return _symbol;
  }

  function tokenData(uint tokenID) public view returns (PKData memory) {
    require(_tokenExists(tokenID), "data query for nonexistant token");

    PK memory token = _tokens[tokenID];
    address owner = _owners[tokenID];

    return PKData({
      id: tokenID,
      timestamp: token.timestamp,
      from: token.from,
      to: owner
    });
  }

  function ownersTokens(address owner) public view returns (PKData[] memory) {
    uint[] memory tokenIDs = _ownersTokens[owner];
    uint balance = tokenIDs.length;
    require(balance != 0, "tokens query for nonexistant owner");

    PKData[] memory out = new PKData[](balance);
    for (uint i = 0; i < balance; i++) {
      out[i] = tokenData(tokenIDs[i]);
    }

    return out;
  }

  function last100() public view returns (PKData[] memory) {
    uint end = _tokensCount() - 1;
    uint start = end < 100 ? 0 : end - 100;

    PKData[] memory out = new PKData[](end-start+1);
    for (uint i = start; i <= end; i++) {
      out[i-start] = tokenData(i);
    }

    return out;
  }

  function _tokenExists(uint tokenID) private view returns (bool) {
    return tokenID < _tokensCount();
  }

  function _tokensCount() private view returns (uint) {
    return _tokens.length;
  }
}
