const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Sovranly IP Solidity Suite", function () {
  let factory, guardian, asset;
  let admin, creator, minter, buyer;
  let GUARDIAN_ROLE, MINTER_ROLE, DEFAULT_ADMIN_ROLE;

  beforeEach(async function () {
    [admin, creator, minter, buyer] = await ethers.getSigners();

    // Deploy Factory
    const SovranlyFactory = await ethers.getContractFactory("SovranlyFactory");
    factory = await SovranlyFactory.deploy();
    await factory.waitForDeployment();

    // Deploy Asset via Factory with creator as owner
    const tx = await factory.connect(creator)["deployAsset(address)"](creator.address);
    const receipt = await tx.wait();

    // Get deployed asset address from event
    const event = receipt.logs.find(log => {
      try {
        const parsed = factory.interface.parseLog(log);
        return parsed.name === "AssetDeployed";
      } catch (e) {
        return false;
      }
    });

    const assetAddress = factory.interface.parseLog(event).args.assetAddress;
    const SovranlyIPAsset = await ethers.getContractFactory("SovranlyIPAsset");
    asset = SovranlyIPAsset.attach(assetAddress);

    GUARDIAN_ROLE = await asset.GUARDIAN_ROLE();
    MINTER_ROLE = await asset.MINTER_ROLE();
    DEFAULT_ADMIN_ROLE = await asset.DEFAULT_ADMIN_ROLE();

    // Deploy Guardian
    const SovranlyGuardian = await ethers.getContractFactory("SovranlyGuardian");
    guardian = await SovranlyGuardian.deploy(admin.address);
    await guardian.waitForDeployment();

    // Grant GUARDIAN_ROLE on asset to guardian contract
    await asset.connect(creator).grantRole(GUARDIAN_ROLE, await guardian.getAddress());
  });

  it("1. Factory configures roles properly on deployed SovranlyIPAsset", async function () {
    expect(await asset.hasRole(DEFAULT_ADMIN_ROLE, creator.address)).to.be.true;
    expect(await asset.hasRole(MINTER_ROLE, creator.address)).to.be.true;
    expect(await asset.hasRole(GUARDIAN_ROLE, creator.address)).to.be.true;
  });

  it("2. Mint asset sets proper owner royalty (mint -> owner royalty)", async function () {
    // Creator mints asset to creator address with 500 bps (5%) royalty
    await asset.connect(creator).mintAsset(creator.address, 500);

    expect(await asset.ownerOf(0)).to.equal(creator.address);

    // Verify ERC2981 royaltyInfo returns creator address as receiver
    const salePrice = ethers.parseEther("1.0");
    const [receiver, royaltyAmount] = await asset.royaltyInfo(0, salePrice);

    expect(receiver).to.equal(creator.address);
    expect(royaltyAmount).to.equal(ethers.parseEther("0.05"));
  });

  it("3. Working Guardian emergencyPause / unpause and pause hooks block minting", async function () {
    // Guardian pauses the asset contract
    await guardian.connect(admin).emergencyPauseAsset(await asset.getAddress());
    expect(await asset.paused()).to.be.true;

    // Minting while paused should fail due to whenNotPaused hook
    await expect(
      asset.connect(creator).mintAsset(creator.address, 500)
    ).to.be.revertedWithCustomError(asset, "EnforcedPause");

    // Guardian unpauses the asset contract
    await guardian.connect(admin).emergencyUnpauseAsset(await asset.getAddress());
    expect(await asset.paused()).to.be.false;

    // Minting after unpause succeeds
    await asset.connect(creator).mintAsset(creator.address, 500);
    expect(await asset.ownerOf(0)).to.equal(creator.address);
  });
});
