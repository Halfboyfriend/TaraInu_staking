// var web3;

// async function Connect(){
// 	await window.web3.currentProvider.enable();
// 	web3=new Web3(window.web3.currentProvider);
// }

var web3;

async function Connect() {
	// Check if MetaMask is installed and enabled
	if (typeof window.ethereum !== 'undefined') {
		try {
			// Enable the provider (wallet) and get necessary data
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			web3 = new Web3(window.ethereum);

			// Get wallet address
			const accounts = await web3.eth.getAccounts();
			const walletAddress = accounts[0];
			
			const smallButton = document.getElementById('smallButtonText');
			smallButton.innerText = smShortenAddress(walletAddress);
			
			const buttonText = document.getElementById('buttonText');
			// alert(buttonText.innerText)
			buttonText.innerText = shortenAddress(walletAddress);

			// document.getElementById('connectButton').disabled = true;

		} catch (error) {
			console.error("Error connecting to wallet:", error);
		}
	} else {
		alert("MetaMask is not installed.");
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