const { expect } = require("chai");
const { ethers } = require("hardhat");

// Define a test suite
describe("WavePortal", function () {
  // Define references to the contract instance and accounts
  let wavePortal;
  let owner;
  let user1;

  // Deploy the contract and get references to accounts before each test
  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();

    const WavePortal = await ethers.getContractFactory("WavePortal");
    wavePortal = await WavePortal.deploy();
    await wavePortal.deployed();
  });

  // Define a test case for the wave function
  it("should allow users to wave and record messages", async function () {
    const message = "Hello, World!";

    // User1 waves and records a message
    await wavePortal.connect(user1).wave(message);

    // Get the user's recorded messages and assert that it matches the expected message
    const messages = await wavePortal.getMessages(user1.address);
    expect(messages).to.have.lengthOf(1);
    expect(messages[0]).to.equal(message);
  });

  // Define a test case for the getTotalWaves function
  it("should return the correct total wave count", async function () {
    // User1 and User2 both wave
    await wavePortal.connect(user1).wave("Hello, User1!");
    await wavePortal.connect(owner).wave("Hello, Owner!");

    // Get the total wave count and assert that it matches the expected value
    const totalWaves = await wavePortal.getTotalWaves();
    expect(totalWaves).to.equal(2);
  });

  // Define a test case for the wave function with the same user
  it("should prevent users from waving too frequently", async function () {
    const message = "Hello, World!";

    // User1 waves with a message
    await wavePortal.connect(user1).wave(message);

    // Try to wave again within 30 seconds and assert that it fails
    await expect(wavePortal.connect(user1).wave(message)).to.be.revertedWith(
      "you sent a msg in the last 30 secs, please wait"
    );
  });
});