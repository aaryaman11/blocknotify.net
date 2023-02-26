const {ethers, network} = require('hardhat');
// const ethers = require('ethers');
// const {utils} = require('ethers');
// const {BigNumber, Wallet} = require('ethers');


async function signMessage(wallet, message) {
    const msgBytes = Buffer.from(message, 'utf-8');
    const challengeDigest = ethers.utils.hashMessage(message);
    const signature = await wallet.signMessage(msgBytes, ethers.provider);
    // now test if we can recover the correct public key...
    const rpk = ethers.utils.recoverPublicKey(challengeDigest, signature);
    if (rpk !== wallet.publicKey) {
        throw new Error(`The recovered public key, ${rpk}, doesn't match the actual user public key: ${wallet.publicKey}`);
    }
    return signature
}

async function main() {
    // Hardhat default account 0...
    // 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    const phone = "30305676789";
    const wallet = new ethers.Wallet(privateKey, ethers.provider);
    const signature = await signMessage(wallet, phone)
    console.log(`Phone:     ${phone}`);
    console.log(`Signer:    ${wallet.address}`);
    console.log(`Signature: ${signature}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
