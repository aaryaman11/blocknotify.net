import { BigNumber } from 'ethers';

export const Networks = [
    // NOTE: the first element in `names` is used for display
    {
        names: ['localhost'],
        // address: '0x178E28a64550ED5F761146f552190C8312809ad3',
        chainId: '0x10E1', // this is: 4321
        explorerUrl: 'https://rinkeby.etherscan.io',
        openSeaUrl: 'https://testnets.opensea.io/assets/rinkeby'
    },
    {
        names: ['hardhat'],
        // address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        chainId: '0x539', // this is: 1337
        explorerUrl: 'https://rinkeby.etherscan.io',
        openSeaUrl: 'https://testnets.opensea.io/assets/rinkeby'
    },
    {
        names: ['goerli'],
        // address: '0x3cCAa9Ad38DdA32788962C289F8C66a4D30CbEd8',
        chainId: '0x5', // NOTE: Metamask expects 0x5, not 0x05 which BigNumber.toHexString produces
        explorerUrl: 'https://goerli.etherscan.io',
        openSeaUrl: 'https://testnets.opensea.io/assets/goerli'
    },
    {
        names: ['rinkeby'],
        // address: '0x3cCAa9Ad38DdA32788962C289F8C66a4D30CbEd8',
        chainId: '0x4', // NOTE: Metamask expects 0x4, not 0x04 which BigNumber.toHexString produces
        explorerUrl: 'https://rinkeby.etherscan.io',
        openSeaUrl: 'https://testnets.opensea.io/assets/rinkeby'
    },
    {
        names: ['mainnet', 'homestead'],
        // address: '0x07221DE6714a6599Bc43331972390781D39C1063',
        chainId: '0x1', // NOTE: Metamask expects 0x1, not 0x01 which BigNumber.toHexString produces
        explorerUrl: 'https://etherscan.io',
        openSeaUrl: 'https://opensea.io/assets/ethereum'
    }
];

export function getDefaultChain() {
    return (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? getFromName('goerli')
        : getFromName('mainnet');
}

export function getNameFromId(id) {
    const match = id
        ? Networks.find((network) => BigNumber.from(network.chainId).eq(id))
        : null;
    return match && match.names.length ? match.names[0] : 'unknown';
}

export function getFromId(id) {
    if (!id) {
        return null;
    }
    const match = Networks.find((network) =>
        BigNumber.from(network.chainId).eq(id)
    );
    return match;
}

export function getFromName(name) {
    if (!name) {
        return null;
    }
    const match = Networks.find((network) =>
        network.names.some((n) => n === name)
    );
    return match;
}

