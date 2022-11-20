// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

require('dotenv').config()

async function main() {

  [owner] = await ethers.getSigners();
  Token = await ethers.getContractFactory("RZXToken");
  hardhatToken = await Token.deploy(1000);

  console.log(
    `hardhat token deployed to ${hardhatToken.address}`
  );

  console.log(network.config.chainId)
  console.log(process.env.ETHERSCAN_API_KEY)

  // verify the contract after deploying
  if (network.config.chainId == 5 && process.env.ETHERSCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    // NomicLabsHardhatPluginError: Failed to send contract verification request.
    // Endpoint URL: https://api-goerli.etherscan.io/api
    // Reason: The Etherscan API responded that the address 0x1E4264Db97D8690bB7376aAC98AA851F3C0e2c07 does not have bytecode.
    // 延长等待时间，避免上述异常
    await hardhatToken.deployTransaction.wait(10);
    await verify(hardhatToken.address, [1000]);
  }
}

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e);
    }
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
