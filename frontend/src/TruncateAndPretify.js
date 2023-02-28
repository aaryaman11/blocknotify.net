import { BigNumber, ethers } from 'ethers';

export function truncateAndPretify(balance, decimals) {
    if (!balance || BigNumber.from(balance).eq(0)) {
        return 0;
    }
    const balanceInEther = ethers.utils.formatEther(balance);
    let balanceRounded = Number(balanceInEther);
    balanceRounded = Math.floor(balanceRounded * 10 ** decimals);
    const balanceComified = ethers.utils.commify(
        balanceRounded / 10.0 ** decimals
    );
    return balanceComified;
}
