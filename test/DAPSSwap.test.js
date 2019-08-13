const {
  BN,
  constants: {ZERO_ADDRESS},
  expectRevert,
} = require("openzeppelin-test-helpers");

require("chai").use(require("bn-chai")(BN));
const {expect} = require("chai");

const DAPSSwap = artifacts.require("DAPSSwap");
const Token = artifacts.require("DAPSTOKEN");

contract("DAPS swap", ([owner, ...accounts]) => {
  let token;
  let dapsSwap;

  beforeEach(async () => {
    token = await Token.new(accounts[0], "12000");
    dapsSwap = await DAPSSwap.new(token.address);
  });

  it("send & burn", async () => {
    await token.transfer(dapsSwap.address, "12000", {from: accounts[0]});
    await dapsSwap.burn();

    expect(await token.balanceOf(accounts[0])).to.eq.BN(0);
    expect(await token.balanceOf(dapsSwap.address)).to.eq.BN(0);
    expect(await token.totalSupply()).to.eq.BN(0);
  });

  it("connect long address", async () => {
    const addressDapsLong =
      "41kYDmcd27f2ULWE6tfC19UnEHYpEhMBtfiYwVFUYbZhXrjLomZXSovQPGzwTCAgwQLpWiEQPA5uyNjmEVLPr4g71AUMNjaVD3n";
    expect(await dapsSwap.isConnected(owner)).to.be.equal(false);
    await dapsSwap.connect(addressDapsLong);
    expect(await dapsSwap.isConnected(owner)).to.be.equal(true);
    expect(await dapsSwap.getCurrentDAPSAddress(owner)).to.equal(addressDapsLong);
  });

  it("connect short address", async () => {
    const addressDapsShort = "DEQsu2RRB5iphm9tKXiP4iWSRMC17gseW5";
    await dapsSwap.connect(addressDapsShort);
    expect(await dapsSwap.getCurrentDAPSAddress(owner)).to.equal(addressDapsShort);
  });

  it("connect some another addresses", async () => {
    const addressDapsShort = "DEQsu2RRB5iphm9tKXiP4iWSRMC17gseW5";
    const addressDapsLong =
      "41kYDmcd27f2ULWE6tfC19UnEHYpEhMBtfiYwVFUYbZhXrjLomZXSovQPGzwTCAgwQLpWiEQPA5uyNjmEVLPr4g71AUMNjaVD3n";

    await dapsSwap.connect(addressDapsShort, {from: accounts[0]});
    await dapsSwap.connect(addressDapsShort, {from: accounts[1]});
    await dapsSwap.connect(addressDapsLong, {from: accounts[2]});
    await dapsSwap.connect(addressDapsLong, {from: accounts[3]});

    expect(await dapsSwap.isConnected(accounts[0])).to.be.equal(true);

    expect(await dapsSwap.getCurrentDAPSAddress(accounts[0])).to.equal(addressDapsShort);
    expect(await dapsSwap.getCurrentDAPSAddress(accounts[1])).to.equal(addressDapsShort);
    expect(await dapsSwap.getCurrentDAPSAddress(accounts[2])).to.equal(addressDapsLong);
    expect(await dapsSwap.getCurrentDAPSAddress(accounts[3])).to.equal(addressDapsLong);
  });

  it("can reconnect", async () => {
    const addressDapsLong =
      "41kYDmcd27f2ULWE6tfC19UnEHYpEhMBtfiYwVFUYbZhXrjLomZXSovQPGzwTCAgwQLpWiEQPA5uyNjmEVLPr4g71AUMNjaVD3n";
    await dapsSwap.connect(addressDapsLong);
    const anotherDapsAddress = "abcdabcd";
    await dapsSwap.connect(anotherDapsAddress);
    expect(await dapsSwap.getCurrentDAPSAddress(owner)).to.equal(anotherDapsAddress);
  });

  it("stores all connected addresses", async () => {
    const addresses = ["addr1", "addr2", "addr3"];
    for (let addr of addresses) {
      await dapsSwap.connect(addr);
    }
    expect(await dapsSwap.isConnected(owner)).to.be.equal(true);
    for (let index in addresses) {
      const address = await dapsSwap.getDAPSAddressByIndex(owner, index);
      expect(address).to.be.equal(addresses[index]);
    }
  });

  it("can't reconnect more than 5 times", async () => {
    const addresses = ["a1", "a2", "a3", "a4", "a5"];
    for (let addr of addresses) {
      await dapsSwap.connect(addr);
    }
    await expectRevert(dapsSwap.connect("a6"), "Address change limit exceeded");
  });

  it("send, burn, send, burn...", async () => {
    const count = 5;
    const sum = (await token.balanceOf(accounts[0])) / count;
    for (let i = 0; i < count; i++) {
      await token.transfer(dapsSwap.address, sum, {from: accounts[0]});
      await dapsSwap.burn();
    }

    expect(await token.balanceOf(accounts[0])).to.eq.BN(0);
    expect(await token.balanceOf(dapsSwap.address)).to.eq.BN(0);
    expect(await token.totalSupply()).to.eq.BN(0);
  });

  it("send, send, burn", async () => {
    const count = 5;
    const sum = (await token.balanceOf(accounts[0])) / count;

    for (let i = 0; i < count; i++) {
      await token.transfer(dapsSwap.address, sum, {from: accounts[0]});
    }

    await dapsSwap.burn();

    expect(await token.balanceOf(accounts[0])).to.eq.BN(0);
    expect(await token.balanceOf(dapsSwap.address)).to.eq.BN(0);
    expect(await token.totalSupply()).to.eq.BN(0);
  });
});
