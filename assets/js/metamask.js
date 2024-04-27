var web3;
var walletAddress;
var form__1 = document.getElementById("form__1");
var form__2 = document.getElementById("form__2");
var form__3 = document.getElementById("form__3");
var BALANCE;
let provider;

document.addEventListener("DOMContentLoaded", function () {
  // Your function call here
});

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 6000);
}

async function Connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      provider = new ethers.providers.Web3Provider(window.ethereum);

      const network = await provider.getNetwork();
      if (network.chainId !== 97) {
        showNotification("Please switch to bnb testnet.");
        return;
      }

      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();

      await Total(walletAddress);
      await getUserTokenBalance(walletAddress);

      const smallButton = document.getElementById("smallButtonText");
      smallButton.innerText = smShortenAddress(walletAddress);

      const buttonText = document.getElementById("buttonText");
      buttonText.innerText = shortenAddress(walletAddress);

      // document.getElementById("connectButton").disabled = true;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  } else {
    alert("MetaMask is not installed.");
  }
}




// async function Connect() {
//   if (typeof window.ethereum !== "undefined") {
//     try {
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//       web3 = new Web3(window.ethereum);

//       const networkId = await web3.eth.net.getId();
//       if (networkId !== 97) {
//         showNotification("Please switch to bnb testnet.");
//         return;
//       }

//       const accounts = await web3.eth.getAccounts();
//        walletAddress = accounts[0];
//       await Total(walletAddress);
//      await getUserTokenBalance(walletAddress);

//       const smallButton = document.getElementById("smallButtonText");
//       smallButton.innerText = smShortenAddress(walletAddress);

//       const buttonText = document.getElementById("buttonText");
//       buttonText.innerText = shortenAddress(walletAddress);

//       document.getElementById("connectButton").disabled = true;
//     } catch (error) {
//       console.error("Error connecting to wallet:", error);
//     }
//   } else {
//     alert("MetaMask is not installed.");
//   }
// }


//HANDLE FORM SUBMISSION
form__1.addEventListener("submit", async function (event) {
  event.preventDefault();
  if(!walletAddress){
    showNotification("Please connect your wallet first");
    return;
  }
  const stakingId = 1;
  const amount = document.getElementById("amount__1").value;

  if(amount < 100){
    showNotification("Amount must be greater than 100");
    return;
  }
  if(amount > BALANCE){
    showNotification("Insufficient balance");
    return;
  }

  try{
    await approveSpendingCap(amount, stakingId);

  }catch(error){
    console.error("Error staking:", error);
  }

  
});

form__2.addEventListener("submit", async function (event) {
  event.preventDefault();
  if(!walletAddress){
    showNotification("Please connect your wallet first");
    return;
  }
  const stakingId = 2;
  const amount = document.getElementById("amount__2").value;

  if(amount < 10000){
    showNotification("Amount must be greater than 100");
    return;
  }
  if(amount > BALANCE){
    showNotification("Insufficient balance");
    return;
  }

  try{
    await approveSpendingCap(amount, stakingId);

  }catch(error){
    console.error("Error staking:", error);
  }

  
});

form__3.addEventListener("submit", async function (event) {
  event.preventDefault();
  if(!walletAddress){
    showNotification("Please connect your wallet first");
    return;
  }
  const stakingId = 3;
  const amount = document.getElementById("amount__3").value;

  if(amount < 100){
    showNotification("Amount must be greater than 100");
    return;
  }
  if(amount > BALANCE){
    showNotification("Insufficient balance");
    return;
  }

  try{
    await approveSpendingCap(amount, stakingId);

  }catch(error){
    console.error("Error staking:", error);
  }

  
});



async function approveSpendingCap(amount, stakingId) {
  if(walletAddress){
   try{
    const TokenContract = new web3.eth.Contract(tokenAbi, tokenContract);
    const amountInWei = web3.utils.toWei(amount);
    const approval = await TokenContract.methods
      .approve(contractAddress, amountInWei)
      .send({ from: walletAddress });
    // approval.wait();
    showNotification("Spending cap approved successfully");

    const stakingContract = new web3.eth.Contract(abi, contractAddress);
    // const stakingId = 1;
    await stakingContract.methods.stake(stakingId, amountInWei).send({ from: walletAddress });

    showNotification("Staked successfully");
   }catch(err){
      console.error("Error approving spending cap:", err);
      showNotification("Error approving spending cap");
   }


  }else{
    showNotification("Please connect your wallet first");
  
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
    // Check if provider is defined
    if (!provider) {
      console.error("Provider is not initialized.");
      return;
    }

    // Create a contract instance
    const contract = new ethers.Contract(contractAddress, abi, provider);

    // Call the totalRewards method of your contract
    const total = await contract.totalRewards();
    const userTotal = await contract.totalEarnedRewardsPerWallet(address);

    const button = document.getElementById("totalTokenStaked");
    button.innerText = total.toString();

    const user = document.getElementById("userTotal");
    user.innerText = userTotal.toString();

    

    // Log out the total rewards
    console.log("Total Rewards:", total.toString());
  } catch (error) {
    console.error(error);
    alert("Could not fetch total rewards");
    console.log("Could not fetch total rewards");
  }
}

async function getUserTokenBalance(address) {
  try {
    // Create a contract instance
    const contract = new ethers.Contract(tokenContract, tokenAbi, provider);

    // Get the balance in Ether
    const balance = await contract.balanceOf(address);

    // Update the HTML element with the formatted balance
    const buttons = document.getElementsByClassName("userBalance");
    Array.from(buttons).forEach((button) => {
      button.innerHTML = ethers.utils.formatEther(balance);
    });

    // Display the balance with 'ETH' symbol
    BALANCE = ethers.utils.formatEther(balance);
  } catch (error) {
    console.error("Error fetching user token balance:", error);
  }
}


// async function Total(address) {
//   try {
//     // Check if web3 is defined
//     if (!web3) {
//       console.error("Web3 is not initialized.");
//       return;
//     }

//     // Create a contract instance
//     const contract = new web3.eth.Contract(abi, contractAddress);

//     // Call the totalRewards method of your contract
//     const total = await contract.methods.totalRewards().call();
//     const userTotal = await contract.methods
//       .totalEarnedRewardsPerWallet(address)
//       .call();

//     const button = document.getElementById("totalTokenStaked");
//     button.innerText = total;

//     const user = document.getElementById("userTotal");
//     user.innerText = userTotal;
//     // Log out the total rewards
//     console.log("Total Rewards:", total);
//   } catch (error) {
//     console.error("Error fetching total rewards:", error);
//   }
// }

// async function getUserTokenBalance(address) {
//   try {
//     // Create a contract instance
//     const contract = new web3.eth.Contract(tokenAbi, tokenContract);

//     // Get the balance in Wei
//     const balanceWei = await contract.methods.balanceOf(address).call();

//     // Convert balance from Wei to Ether
//     const balanceEther = web3.utils.fromWei(balanceWei, "ether");

//     // Update the HTML element with the formatted balance
//     const button = document.getElementsByClassName("userBalance");
//     button.item(0).innerHTML = balanceEther;
//     button.item(1).innerHTML = balanceEther;
//     button.item(2).innerHTML = balanceEther;
//  // Display the balance with 'ETH' symbol
//     BALANCE = balanceEther;
//   } catch (error) {
//     console.error("Error fetching user token balance:", error);
//   }
// }

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

const tokenContract = "0xcDE0B6FA0f803554182B2D041F896CD5006B98bD";
const tokenAbi = [
  { inputs: [], stateMutability: "nonpayable", type: "constructor" },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
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
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokensSwapped",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ethReceived",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokensIntoLiqudity",
        type: "uint256",
      },
    ],
    name: "SwapAndLiquify",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "bool", name: "enabled", type: "bool" },
    ],
    name: "SwapAndLiquifyEnabledUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
    ],
    name: "SwapETHForTokens",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "path",
        type: "address[]",
      },
    ],
    name: "SwapTokensForETH",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "_maxTxAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_totalTaxIfBuying",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_totalTaxIfSelling",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "_walletMax",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "addressDev",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newRouterAddress", type: "address" },
    ],
    name: "changeRouterVersion",
    outputs: [
      { internalType: "address", name: "newPairAddress", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "checkWalletLimit",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "deadAddress",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "subtractedValue", type: "uint256" },
    ],
    name: "decreaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "newValue", type: "bool" }],
    name: "enableDisableWalletLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getBlock",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCirculatingSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getSaleAt",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTime",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "addedValue", type: "uint256" },
    ],
    name: "increaseAllowance",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isBot",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isExcludedFromFee",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isMarketPair",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isWalletLimitExempt",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketingWalletAddress",
    outputs: [{ internalType: "address payable", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minimumTokensBeforeSwapAmount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
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
    name: "presaleContract",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
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
    inputs: [],
    name: "sale",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newLiquidityTax", type: "uint256" },
      { internalType: "uint256", name: "newMarketingTax", type: "uint256" },
    ],
    name: "setBuyTaxes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newLiquidityShare", type: "uint256" },
      { internalType: "uint256", name: "newMarketingShare", type: "uint256" },
      { internalType: "uint256", name: "newLotteryShare", type: "uint256" },
    ],
    name: "setDistributionSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "bool", name: "exempt", type: "bool" },
    ],
    name: "setIsBot",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "bool", name: "newValue", type: "bool" },
    ],
    name: "setIsExcludedFromFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "bool", name: "exempt", type: "bool" },
    ],
    name: "setIsTxLimitExempt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "holder", type: "address" },
      { internalType: "bool", name: "exempt", type: "bool" },
    ],
    name: "setIsWalletLimitExempt",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "account", type: "address" },
      { internalType: "bool", name: "newValue", type: "bool" },
    ],
    name: "setMarketPairStatus",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newAddress", type: "address" }],
    name: "setMarketingWalletAddress",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "maxTxPercentage", type: "uint256" },
    ],
    name: "setMaxTxAmount",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newLimit", type: "uint256" }],
    name: "setNumTokensBeforeSwap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_presaleContract", type: "address" },
    ],
    name: "setPresaleContract",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newLiquidityTax", type: "uint256" },
      { internalType: "uint256", name: "newMarketingTax", type: "uint256" },
    ],
    name: "setSellTaxes",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "newValue", type: "bool" }],
    name: "setSwapAndLiquifyByLimitOnly",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "_enabled", type: "bool" }],
    name: "setSwapAndLiquifyEnabled",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "newLimitPercentage", type: "uint256" },
    ],
    name: "setWalletLimit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_addressDev", type: "address" }],
    name: "setaddressDev",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_blockBan", type: "uint256" }],
    name: "setblockBan",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "swapAndLiquifyByLimitOnly",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "swapAndLiquifyEnabled",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "toggleTrading",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "tradingOpen",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
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
    inputs: [],
    name: "uniswapPair",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "uniswapV2Router",
    outputs: [
      {
        internalType: "contract IUniswapV2Router02",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];
