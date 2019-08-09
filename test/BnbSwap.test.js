const {
  balance,
  BN,
  constants: {ZERO_ADDRESS},
  ether,
  expectEvent,
  expectRevert,
  shouldFail,
  time,
  time: {duration}
} = require("openzeppelin-test-helpers");

require('chai')
    .use(require('bn-chai')(BN));
const { expect } = require('chai');

const BnbSwap = artifacts.require("BnbSwap");
const Token = artifacts.require("DAPSTOKEN");

contract("BaseSwaps", ([owner, ...accounts]) => {
  let token;
  let bnbSwap;

  beforeEach(async () => {
    token = await Token.new(accounts[0], '12000');
    bnbSwap = await BnbSwap.new(token.address);
  });

  it('send & burn', async () => {
    await token.transfer(bnbSwap.address, '12000', { from: accounts[0] });
    await bnbSwap.burn();

    expect(await token.balanceOf(accounts[0])).to.eq.BN(0);
    expect(await token.balanceOf(bnbSwap.address)).to.eq.BN(0);
    expect(await token.totalSupply()).to.eq.BN(0);
  });

  it('put long address', async () => {
    let addressDapsLong = '41kYDmcd27f2ULWE6tfC19UnEHYpEhMBtfiYwVFUYbZhXrjLomZXSovQPGzwTCAgwQLpWiEQPA5uyNjmEVLPr4g71AUMNjaVD3n';
    await bnbSwap.put(addressDapsLong);
    expect(await bnbSwap.registers(owner)).to.equal(addressDapsLong);
  });

  it('put short address', async () => {
    let addressDapsShort = 'DEQsu2RRB5iphm9tKXiP4iWSRMC17gseW5';
    await bnbSwap.put(addressDapsShort);
    expect(await bnbSwap.registers(owner)).to.equal(addressDapsShort);
  });

  it('put some another addresses', async () => {
    let addressDapsShort = 'DEQsu2RRB5iphm9tKXiP4iWSRMC17gseW5';
    let addressDapsLong = '41kYDmcd27f2ULWE6tfC19UnEHYpEhMBtfiYwVFUYbZhXrjLomZXSovQPGzwTCAgwQLpWiEQPA5uyNjmEVLPr4g71AUMNjaVD3n';

    await bnbSwap.put(addressDapsShort, {from: accounts[0]});
    await bnbSwap.put(addressDapsShort, {from: accounts[1]});
    await bnbSwap.put(addressDapsLong, {from: accounts[2]});
    await bnbSwap.put(addressDapsLong, {from: accounts[3]});

    expect(await bnbSwap.registers(accounts[0])).to.equal(addressDapsShort);
    expect(await bnbSwap.registers(accounts[1])).to.equal(addressDapsShort);
    expect(await bnbSwap.registers(accounts[2])).to.equal(addressDapsLong);
    expect(await bnbSwap.registers(accounts[3])).to.equal(addressDapsLong);
  });

  it('can not put more then 1 address per contract', async () => {
    let addressDapsLong = '41kYDmcd27f2ULWE6tfC19UnEHYpEhMBtfiYwVFUYbZhXrjLomZXSovQPGzwTCAgwQLpWiEQPA5uyNjmEVLPr4g71AUMNjaVD3n';
    await bnbSwap.put(addressDapsLong);
    await expectRevert(bnbSwap.put(addressDapsLong), 'Already registered');
  });


  it('send, burn, send, burn...', async () => {
    let count = 5;
    let sum = await token.balanceOf(accounts[0]) / count;
    for (let i = 0; i < count; i++) {
      await token.transfer(bnbSwap.address, sum, { from: accounts[0] });
      await bnbSwap.burn();
    }

    expect(await token.balanceOf(accounts[0])).to.eq.BN(0);
    expect(await token.balanceOf(bnbSwap.address)).to.eq.BN(0);
    expect(await token.totalSupply()).to.eq.BN(0);
  });

  it('send, send, burn', async () => {
    let count = 5;
    let sum = await token.balanceOf(accounts[0]) / count;

    for (let i = 0; i < count; i++) {
      await token.transfer(bnbSwap.address, sum, {from: accounts[0]});
    }

    await bnbSwap.burn();

    expect(await token.balanceOf(accounts[0])).to.eq.BN(0);
    expect(await token.balanceOf(bnbSwap.address)).to.eq.BN(0);
    expect(await token.totalSupply()).to.eq.BN(0);
  });
});
