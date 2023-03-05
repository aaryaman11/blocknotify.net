import React from 'react';
// import { getDefaultChain } from './Networks';
import { useChain } from './ChainContext';
import Network from './Network';
// import { BigNumber } from 'ethers';
import Wallet from './Wallet';

function Logo() {
    return (
        <a href="/" className="d-flex justify-content-center">
            <img
                src="logo.svg"
                style={{
                    width: 48 + 'px',
                    height: 48 + 'px'
                }}
                alt="BlockNotify - A Security Analytics Platform"
            />
        </a>
    );
}

function CorrectChainContent() {
    return (
        <>
            <div className="col col-12 col-md-1">
                <Logo />
            </div>
            <div className="col col-12 col-md-11 col-xl-6">
                <Network />
            </div>
            <div className="col col-12 col-xl-5">
                <Wallet />
            </div>
        </>
    );
}

function IncorrectChainContent() {
    return (
        <>
            <div className="col col-12 col-lg-1">
                <Logo />
            </div>
            <div className="col col-12 col-lg-10">
                <Network />
            </div>
        </>
    );
}

export default function Header() {
    const { state, correctNetworkSelected } = useChain();
    const validChain =
        state.connected &&
        state.chainId &&
        correctNetworkSelected();
    const content = validChain ? (
        <CorrectChainContent />
    ) : (
        <IncorrectChainContent />
    );
    return (
        <div className="container sticky-top rounded-bottom shadow-lg mb-1 border-secondary border border-top-0">
            <div className="row site-header align-items-center">{content}</div>
        </div>
    );
}
