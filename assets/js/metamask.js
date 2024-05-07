var web3;
var walletAddress;
var form__1 = document.getElementById("form__1");
var form__2 = document.getElementById("form__2");
var form__3 = document.getElementById("form__3");
var BALANCE;
let provider;

const weiToEther = (value) => Number(ethers.utils.formatEther(value)).toFixed(2);
const etherToWei = (value) => ethers.utils.parseEther(value.toString());

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 10000);
}


function tnxNotification(message) {
  const notification = document.getElementById("notification");
  notification.innerText = message;
  notification.style.display = "block";

  setTimeout(() => {
    notification.style.display = "none";
  }, 100000);
}





async function Connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);

      const networkId = await web3.eth.net.getId();
      if (networkId !== 841) {
        showNotification("Please switch to Taraxa Mainnet.");
        return;
      }

      const accounts = await web3.eth.getAccounts();
      walletAddress = accounts[0];
      await Total(walletAddress);
     await getUserTokenBalance(walletAddress);
     await userData(walletAddress);

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


//HANDLE FORM SUBMISSION
form__1.addEventListener("submit", async function (event) {
  event.preventDefault();
  if(!walletAddress){
    showNotification("Please connect your wallet first");
    return;
  }
  const stakingId = 1;
  const amount = document.getElementById("amount__1").value;

  if(amount < 5000000){
    showNotification("Amount must be greater than 5000000");
    return;
  }
  if(amount > BALANCE){
    showNotification("Insufficient balance");
    return;
  }

  try{
    await approveSpendingCap(amount, stakingId);
    await Total(walletAddress);
    await getUserTokenBalance(walletAddress);
    await userData(walletAddress);

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

  if(amount < 10000000){
    showNotification("Amount must be greater than 10000000");
    return;
  }
  if(amount > BALANCE){
    showNotification("Insufficient balance");
    return;
  }

  try{
    await approveSpendingCap(amount, stakingId);
    await Total(walletAddress);
    await getUserTokenBalance(walletAddress);
    await userData(walletAddress);

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

  if(amount < 25000000){
    showNotification("Amount must be greater than 25000000");
    return;
  }
  if(amount > BALANCE){
    showNotification("Insufficient balance");
    return;
  }

  try{
    await approveSpendingCap(amount, stakingId);
    await Total(walletAddress);
    await getUserTokenBalance(walletAddress);
    await userData(walletAddress);

  }catch(error){
    console.error("Error staking:", error);
  }

  
});


async function userData(address){
  if(!address){
    showNotification("Please connect your wallet first");
    return;
  }
  try{
    const contract = new web3.eth.Contract(abi, contractAddress);
    
    // PLAN STAKED

    const stakeA = await contract.methods.canWithdrawAmount(1, address).call();
    const stakeB = await contract.methods.canWithdrawAmount(2, address).call();
    const stakeC = await contract.methods.canWithdrawAmount(3, address).call();

    const planAStake = document.getElementById("planAStake");
    planAStake.innerText = weiToEther(stakeA[0]);
    const planA1Stake = document.getElementById("planA1Stake");
    planA1Stake.innerText = weiToEther(stakeA[0]);

    
    const planBStake = document.getElementById("planBStake");
    planBStake.innerText = weiToEther(stakeB[0]);

    const planB2Stake = document.getElementById("planB2Stake");
    planB2Stake.innerText = weiToEther(stakeB[0]);

    const planCStake = document.getElementById("planCStake");
    planCStake.innerText = weiToEther(stakeC[0]);

    const planC3Stake = document.getElementById("planC3Stake");
    planC3Stake.innerText = weiToEther(stakeC[0]);

    // Plan Rewards
    


    // Call the totalRewards method of your contract
    const planA = await contract.methods.earnedToken(1, address).call();
    const planB = await contract.methods.earnedToken(2, address).call();
    const planC = await contract.methods.earnedToken(3, address).call();

    const planAButton = document.getElementById("planA");
    planAButton.innerText = weiToEther(planA);
    const planBButton = document.getElementById("planB");
    planBButton.innerText = weiToEther(planB);
    const planCButton = document.getElementById("planC");
    planCButton.innerText = weiToEther(planC);




  }catch(e){
    console.log(e);
    showNotification("Error fetching user data");

  }
}


async function unStake(stakingId) {
  if(walletAddress){
    try{
      const amount = document.getElementById("planAStake").innerText;
      const weiValue = ethers.utils.parseEther(amount);
      const contract = new web3.eth.Contract(abi, contractAddress);
      await contract.methods.unstake(stakingId, weiValue).send({ from: walletAddress });
      tnxNotification("Unstaked successfully");
      await Total(walletAddress);
      await getUserTokenBalance(walletAddress);
      await userData(walletAddress);
    }catch(err){
      console.error("Error unstaking:", err);
      tnxNotification("Error unstaking");
    }
  }else{
    showNotification("Please connect your wallet first");
  }
}


async function reStake(stakingId) {
  if(walletAddress){
    try{
      const contract = new web3.eth.Contract(abi, contractAddress);
      await contract.methods.reStake(stakingId).send({ from: walletAddress });
      showNotification("Restaked successfully");
      await Total(walletAddress);
      await getUserTokenBalance(walletAddress);
      await userData(walletAddress);
    }catch(err){
      console.error("Error restaking:", err);
      showNotification("Error restaking");
    }
  }else{
    showNotification("Please connect your wallet first");
  }
}

async function withdraw(stakingId) {
  if(walletAddress){
    try{
      showNotification("Withdrawing, please dont close the window. This may take a while.");
      const contract = new web3.eth.Contract(abi, contractAddress);
      await contract.methods.claimEarned(stakingId).send({ from: walletAddress });
      showNotification("Claimed successfully");
      await Total(walletAddress);
      await getUserTokenBalance(walletAddress);
      await userData(walletAddress);
    }catch(err){
      console.error("Error claiming:", err);
      tnxNotification("Error claiming");
    }
  }else{
    showNotification("Please connect your wallet first");
  }
}



async function approveSpendingCap(amount, stakingId) {
  if(walletAddress){
   try{
    const TokenContract = new web3.eth.Contract(tokenAbi, tokenContract);
    const amountInWei = web3.utils.toWei(amount);
    
    tnxNotification("Approving spending cap, please dont close the window. This may take a while.");
    const approval = await TokenContract.methods
      .approve(contractAddress, amountInWei)
      .send({ from: walletAddress });
    // approval.wait();

    showNotification("Transaction has been sent to your wallet. Please confirm the transaction.");
    

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
  return weiToEther(stakes);
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
    const total = await contract.methods.getBalance().call();
    const stake1 = await contract.methods.canWithdrawAmount(1, address).call();
    const stake2 = await contract.methods.canWithdrawAmount(2, address).call();
    const stake3 = await contract.methods.canWithdrawAmount(3, address).call();

    let userTotal = stake2[0] + stake3[0] + stake1[0];

    console.log(weiToEther(userTotal))

    const button = document.getElementById("totalTokenStaked");
    button.innerText = weiToEther(total);

    const user = document.getElementById("userTotal");
    user.innerText = weiToEther(userTotal);
    
  } catch (error) {
    console.error("Error fetching total rewards:", error);
  }
}

async function getUserTokenBalance(address) {
  try {
    const contract = new web3.eth.Contract(tokenAbi, tokenContract);

    const balanceWei = await contract.methods.balanceOf(address).call();


    // Convert balance from Wei to Ether
    // const balanceEther = web3.utils.fromWei(balanceWei, "ether");

    // Update the HTML element with the formatted balance
    const button = document.getElementsByClassName("userBalance");
    button.item(0).innerHTML = weiToEther(balanceWei);
    
    button.item(1).innerHTML = weiToEther(balanceWei);;
    button.item(2).innerHTML = weiToEther(balanceWei);;
 // Display the balance with 'ETH' symbol
    BALANCE = weiToEther(balanceWei);;
  } catch (error) {
    console.error("Error fetching user token balance:", error);
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

const contractAddress = "0xeFA914F8f95F51f003459aBbDad152e2aa76617D";
const abi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "addToBlacklist",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stakingId",
				"type": "uint256"
			}
		],
		"name": "claimEarned",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stakingId",
				"type": "uint256"
			}
		],
		"name": "reStake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_stakingToken",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_address",
				"type": "address"
			}
		],
		"name": "removeFromBlacklist",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stakingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_percent",
				"type": "uint256"
			}
		],
		"name": "setAPR",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stakingId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "_conclude",
				"type": "bool"
			}
		],
		"name": "setStakeConclude",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stakingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "stake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stakingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "_beneficiary",
				"type": "address"
			}
		],
		"name": "stakeFor",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stakingId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "unstake",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenContract",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawToken",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "blacklist",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stakingId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "canWithdrawAmount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stakingId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "earnedToken",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_account",
				"type": "address"
			}
		],
		"name": "getStakedPlans",
		"outputs": [
			{
				"internalType": "bool[]",
				"name": "",
				"type": "bool[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_wallet",
				"type": "address"
			}
		],
		"name": "getTotalEarnedRewardsPerWallet",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalRewards",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_stakingId",
				"type": "uint256"
			}
		],
		"name": "getTotalRewardsPerPlan",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "periodicTime",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "planLimit",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "plans",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "overallStaked",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakesCount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "apr",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakeDuration",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "initialPool",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "conclude",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "stakedBalance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "stakes",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "stakeAt",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "endstakeAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "stakingToken",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "totalEarnedRewardsPerWallet",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalRewards",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "totalRewardsPerPlan",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "totalRewardsPerWalletPerPlan",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const tokenContract = "0xf847ecc42565bfd2d6183d5429795549ee89b2ac";
const tokenAbi = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "allowance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientAllowance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "balance",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "needed",
				"type": "uint256"
			}
		],
		"name": "ERC20InsufficientBalance",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC20InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "ERC20InvalidSpender",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "spender",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "recipient",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "decimals",
		"outputs": [
			{
				"internalType": "uint8",
				"name": "",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "exclidedFromTax",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];