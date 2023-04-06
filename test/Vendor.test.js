const { deployContract } = require("./helpers.js");
const { expect } = require("chai");
const { constants } = require("@openzeppelin/test-helpers");
const { ZERO_ADDRESS } = constants;
const { ethers } = require("hardhat");

const createTestSuite = ({ contract, constructorArgs }) =>
  function () {
    context(`${contract}`, function () {
      beforeEach(async function () {
        this.vendor = await deployContract(contract, constructorArgs);
        this.coin = await deployContract("Coin", []);
        this.token = await deployContract("NFT", []);
        this.coin_decimal = await this.coin.decimals();
      });

      context("prepare coin & token", async function () {
        it("mint coin", async function () {
          const [owner] = await ethers.getSigners();
          await this.coin.mint(
            owner.address,
            ethers.utils.parseUnits("1000", this.coin_decimal),
            {
              value: ethers.utils.parseEther("1"),
            }
          );
          const balance = await this.coin.balanceOf(owner.address);
          expect(balance).to.equal(
            ethers.utils.parseUnits("1000", this.coin_decimal)
          );
        });

        it("mint coin to other wallet", async function () {
          const [owner, owner1] = await ethers.getSigners();
          await this.coin.mint(
            owner1.address,
            ethers.utils.parseUnits("1000", this.coin_decimal),
            {
              value: ethers.utils.parseEther("1"),
            }
          );
          const balance = await this.coin.balanceOf(owner1.address);
          expect(balance).to.equal(
            ethers.utils.parseUnits("1000", this.coin_decimal)
          );
        });

        it("transfer coin to vendor", async function () {
          await this.coin.transfer(
            this.vendor.address,
            ethers.utils.parseUnits("1000", this.coin_decimal)
          );
          const balance = await this.coin.balanceOf(this.vendor.address);
          expect(balance).to.equal(
            ethers.utils.parseUnits("1000", this.coin_decimal)
          );
        });

        it("mint token", async function () {
          const [owner] = await ethers.getSigners();
          await this.coin.mint(owner.address, {
            value: ethers.utils.parseEther("0.001"),
          });
          const balance = await this.coin.balanceOf(owner.address);
          expect(balance).to.equal(1);
        });
      });

      context("interact with vendor", async function () {
        beforeEach(async function () {
          it("set token info", async function () {
            await this.vendor.setTokenInfo(
              this.coin.address,
              this.token.address
            );
          });
        });

        it("buy coin", async function () {
          await this.vendor.buyCoin({
            value: ethers.utils.parseEther("1"),
          });
          const balance = await this.coin.balanceOf(owner.address);
          expect(balance).to.equal(ethers.utils.parseUnits("1000", 6));
        });

        it("sell token", async function () {
          await this.vendor.sellToken(1, ethers.utils.parseUnits("5", 6));
          const newOwner = await this.token.ownerOf(1);
          expect(newOwner).to.equal(this.vendor.address);
        });

        it("buy token", async function () {
          const [owner, owner1, addr2, addr3] = await ethers.getSigners();
          const vendor1 = new ethers.Contract(
            this.vendor.address,
            this.vendor.interface,
            owner1
          );
          await this.coin.approve(
            this.vendor1.address,
            ethers.utils.parseUnits("5", 6)
          );
          await vendor1.buyToken(1);
          const newOwner = await this.token.ownerOf(1);
          expect(newOwner).to.equal(owner1.address);
        });

        it("airdropTest", async function () {
          const [owner1, owner2, ...owners] = await ethers.getSigners();
          if (owners.length > 10) owners.slice(0, 10);
          var addrs = owners.map((one) => one.address);
          await this.vendor.airdropTest(addrs);
          var len = addrs.length;
          var receiveCnt = 0;
          for (let i = 0; i < len; i++) {
            const balance = await this.coin.balanceOf(addrs[i]);
            if (ethers.utils.formatUnits(balance, this.coin_decimal) == 5)
              receiveCnt++;
          }
          expect(receiveCnt).to.equal(len);
        });
      });
    });
  };

describe(
  "Vendor",
  createTestSuite({ contract: "Vendor", constructorArgs: [] })
);
