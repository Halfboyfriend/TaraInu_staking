var web3;

async function Connect() {
  // Check if MetaMask is installed and enabled
  if (typeof window.ethereum !== "undefined") {
    try {
      // Enable the provider (wallet) and get necessary data
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);

      const accounts = await web3.eth.getAccounts();
      const walletAddress = accounts[0];
	  await Total(walletAddress);

      const smallButton = document.getElementById("smallButtonText");
      smallButton.innerText = smShortenAddress(walletAddress);

      const buttonText = document.getElementById("buttonText");
      buttonText.innerText = shortenAddress(walletAddress);

      document.getElementById("connectButton").disabled = true;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  } else {
    alert("MetaMask is not installed.");
  }
}

//GET USER STAKES

async function getUserStakes(address) {
  const contract = new web3.eth.Contract(abi, contractAddress);
  const stakes = await contract.methods.getUserStakes(address).call();
  return stakes;
}

async function Total(address) {
    try {
        // Check if web3 is defined
        if (!web3) {
            console.error("Web3 is not initialized.");
            return;
        }

        // Create a contract instance
        const contract = new web3.eth.Contract(abi, contractAddress);

        // Call the totalRewards method of your contract
        const total = await contract.methods.totalRewards().call();
		const userTotal = await contract.methods.totalEarnedRewardsPerWallet(address).call();

		const button = document.getElementById("totalTokenStaked");
		button.innerText = total;

		const user = document.getElementById("userTotal");
		user.innerText = userTotal;
        // Log out the total rewards
        console.log("Total Rewards:", total);
    } catch (error) {
        console.error("Error fetching total rewards:", error);
    }
}

function shortenAddress(address) {
  if (address.length <= 9) {
    return address; // Address is already short
  }
  const firstFour = address.slice(0, 4);
  const lastFive = address.slice(-5);
  return `${firstFour}...${lastFive}`;
}

function smShortenAddress(address) {
  if (address.length <= 9) {
    return address; // Address is already short
  }
  const firstFour = address.slice(0, 3);
  const lastFive = address.slice(-3);
  return `${firstFour}...${lastFive}`;
}

const contractAddress = "0x4344F17B3D8842EECB914E14e66e5A9B40E81Ee1";
const abi = [
  {
    inputs: [
      { internalType: "address", name: "_stakingToken", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "addToBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "blacklist",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_stakingId", type: "uint256" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "canWithdrawAmount",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_stakingId", type: "uint256" }],
    name: "claimEarned",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_stakingId", type: "uint256" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "earnedToken",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "getStakedPlans",
    outputs: [{ internalType: "bool[]", name: "", type: "bool[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_wallet", type: "address" }],
    name: "getTotalEarnedRewardsPerWallet",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_stakingId", type: "uint256" }],
    name: "getTotalRewardsPerPlan",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "periodicTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "planLimit",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "plans",
    outputs: [
      { internalType: "uint256", name: "overallStaked", type: "uint256" },
      { internalType: "uint256", name: "stakesCount", type: "uint256" },
      { internalType: "uint256", name: "apr", type: "uint256" },
      { internalType: "uint256", name: "stakeDuration", type: "uint256" },
      { internalType: "bool", name: "initialPool", type: "bool" },
      { internalType: "bool", name: "conclude", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_address", type: "address" }],
    name: "removeFromBlacklist",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_stakingId", type: "uint256" },
      { internalType: "uint256", name: "_percent", type: "uint256" },
    ],
    name: "setAPR",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_stakingId", type: "uint256" },
      { internalType: "bool", name: "_conclude", type: "bool" },
    ],
    name: "setStakeConclude",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_stakingId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "stake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_stakingId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
      { internalType: "address", name: "_beneficiary", type: "address" },
    ],
    name: "stakeFor",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "stakes",
    outputs: [
      { internalType: "uint256", name: "amount", type: "uint256" },
      { internalType: "uint256", name: "stakeAt", type: "uint256" },
      { internalType: "uint256", name: "endstakeAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "stakingToken",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "totalEarnedRewardsPerWallet",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalRewards",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "totalRewardsPerPlan",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "address", name: "", type: "address" },
    ],
    name: "totalRewardsPerWalletPerPlan",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_stakingId", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "unstake",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_tokenContract", type: "address" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "withdrawToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];
