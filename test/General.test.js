const assert = require('assert');
const assertRevert = require('./utils/assertRevert')
const { ethers } = require('hardhat');

describe('Ethernauts', () => {
  let factory, Ethernauts;

  let owner;

  before('identify signers', async () => {
    ([owner] = await ethers.getSigners());
  });

  before('prepare factory', async () => {
    factory = await ethers.getContractFactory('Ethernauts');
  });

  describe('when deploying the contract with invalid parameters', () => {
    describe('when deploying with too many giftable tokens', () => {
      it('reverts', async () => {
        await assertRevert(
          factory.deploy(200, 10000, 500000, 500000),
          "Max giftable supply too large"
        );
      });
    });

    describe('when deploying with too many tokens', () => {
      it('reverts', async () => {
        await assertRevert(
          factory.deploy(100, 20000, 500000, 500000),
          "Max token supply too large"
        );
      });
    });

    describe('when deploying with invalid distribution percentages', () => {
      it('reverts', async () => {
        await assertRevert(
          factory.deploy(100, 10000, 700000, 500000),
          "Invalid dao and artist percentages"
        );
      });

      it('reverts', async () => {
        await assertRevert(
          factory.deploy(100, 10000, 1000, 50000),
          "Invalid dao and artist percentages"
        );
      });
    });
  });

  describe('when deploying the contract with valid paratemeters', () => {
    const maxGiftable = 100;
    const maxTokens = 10000;
    const daoPercent = 950000;
    const artistPercent = 50000;

    before('deploy contract', async () => {
      Ethernauts = await factory.deploy(maxGiftable, maxTokens, daoPercent, artistPercent);
    });

    it('should have set the owner correctly', async () => {
      assert.equal(await Ethernauts.owner(), owner.address);
    });

    it('should have set the name and symbol correctly', async () => {
      assert.equal(await Ethernauts.name(), 'Ethernauts');
      assert.equal(await Ethernauts.symbol(), 'ETHNTS');
    });

    it('shows the correct max supplies', async () => {
      assert.equal((await Ethernauts.maxGiftable()).toNumber(), maxGiftable);
      assert.equal((await Ethernauts.maxTokens()).toNumber(), maxTokens);
    });

    it('shows the correct percentages', async () => {
      assert.equal((await Ethernauts.daoPercent()).toNumber(), daoPercent);
      assert.equal((await Ethernauts.artistPercent()).toNumber(), artistPercent);
    });
  });
});