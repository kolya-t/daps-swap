const {
  balance,
  BN,
  constants: {ZERO_ADDRESS},
  ether,
  expectEvent,
  shouldFail,
  time,
  time: {duration}
} = require("openzeppelin-test-helpers");

const {expect} = require("chai");

const BnbSwap = artifacts.require("BnbSwap");
const Token = artifacts.require("MyWishToken");

contract("BaseSwaps", ([owner, ...accounts]) => {
  let token;
  let bnbSwap;

  beforeEach(async () => {
    token = await Token.new();
    bnbSwap = await BnbSwap.new();
  });

  it("", async () => {

  })
});
