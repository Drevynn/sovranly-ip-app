import { ethers } from "hardhat";

async function main() {
  const SovranlyFactory = await ethers.getContractFactory("SovranlyFactory");
  const factory = await SovranlyFactory.deploy();
  await factory.waitForDeployment();
  console.log("Factory deployed to:", await factory.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
