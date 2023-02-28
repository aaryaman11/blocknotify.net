import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import * as PropTypes from 'prop-types';
import { useChain } from './ChainContext';
import { getFromId } from './Networks';
import { truncateAndPretify } from './TruncateAndPretify';

function ConnectWallet(props) {
    const setAccounts = (accounts) => accounts;
    const connect = () => {
        window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(setAccounts);
    };
    return (
        <div className="p-1">
            <OverlayTrigger
                placement="right"
                overlay={<Tooltip>Click to connect to your account.</Tooltip>}
            >
                {({ ref, ...triggerHandler }) => (
                    <Button
                        variant="primary"
                        {...triggerHandler}
                        className="d-inline-flex align-items-center"
                        onClick={connect}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-wallet"
                            viewBox="0 0 16 16"
                        >
                            <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
                        </svg>
                        <span ref={ref} className="ms-1">
                            Connect Account
                        </span>
                    </Button>
                )}
            </OverlayTrigger>
        </div>
    );
}

ConnectWallet.propTypes = { onClick: PropTypes.func };

function AccountConnected(props) {
    const { state } = useChain();
    const registeredNetwork = getFromId(state.chainId);
    const explorerUrl = registeredNetwork?.explorerUrl;
    const accountUrl = explorerUrl + '/address/' + state.accounts[0];

    return (
        <div className="p-1">
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Connected account</Tooltip>}
            >
                {({ ref, ...triggerHandler }) => (
                    <div {...triggerHandler}>
                        <a
                            target="_blank"
                            rel="noreferrer noopener"
                            href={accountUrl}
                            className=""
                        >
                            <svg
                                ref={ref}
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-wallet"
                                viewBox="0 0 16 16"
                            >
                                <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" />
                            </svg>
                            &nbsp;{state.accounts[0]}
                        </a>
                    </div>
                )}
            </OverlayTrigger>
            <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>Connected account balance</Tooltip>}
            >
                {({ ref, ...triggerHandler }) => (
                    <div {...triggerHandler} className="">
                        <span ref={ref}>Balance:</span>{' '}
                        {truncateAndPretify(state.balance, 6)} ETH
                    </div>
                )}
            </OverlayTrigger>
        </div>
    );
}

export default function Wallet(props) {
    const { state } = useChain();
    if (state.accounts && state.accounts.length) {
        return <AccountConnected />;
    } else {
        return <ConnectWallet />;
    }
}
