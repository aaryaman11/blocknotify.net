import React from 'react';
import { BigNumber } from 'ethers';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import * as PropTypes from 'prop-types';
import { useChain } from './ChainContext';
import { getDefaultChain, getNameFromId, getFromId } from './Networks';
import { useStatus } from './StatusContext';

function InstallMetaMask(props) {
    return (
        <div className="text-center p-1">
            <h2>
                Make sure{' '}
                <a href="https://metamask.io" target="_blank" rel="noreferrer">
                    MetaMask
                </a>{' '}
                is installed and{' '}
                <strong>
                    <u>unlocked</u>
                </strong>{' '}
                and then{' '}
                <a href="#!" onClick={props.onClick}>
                    reload
                </a>
                .
            </h2>
        </div>
    );
}

InstallMetaMask.propTypes = { onClick: PropTypes.func };

function CorrectNetworkBadContract(props) {
    return (
        <div className="p-1">
            <h2>Network: {props.name} (unable to load contract)</h2>
        </div>
    );
}

CorrectNetworkBadContract.propTypes = { name: PropTypes.any };

function SelectedNetwork(props) {
    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip>
                    Currently selected network (ID: {props.overlay})
                </Tooltip>
            }
        >
            {({ ref, ...triggerHandler }) => (
                <span {...triggerHandler}>
                    <svg
                        ref={ref}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-layers"
                        viewBox="0 0 16 16"
                    >
                        <path d="M8.235 1.559a.5.5 0 0 0-.47 0l-7.5 4a.5.5 0 0 0 0 .882L3.188 8 .264 9.559a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882L12.813 8l2.922-1.559a.5.5 0 0 0 0-.882l-7.5-4zm3.515 7.008L14.438 10 8 13.433 1.562 10 4.25 8.567l3.515 1.874a.5.5 0 0 0 .47 0l3.515-1.874zM8 9.433 1.562 6 8 2.567 14.438 6 8 9.433z" />
                    </svg>
                    &nbsp;
                    {props.name ?? 'undefined'}
                    {props.correct ? '' : ' (unsupported)'}
                    &nbsp;
                </span>
            )}
        </OverlayTrigger>
    );
}

SelectedNetwork.propTypes = {
    correct: PropTypes.any,
    overlay: PropTypes.any,
    name: PropTypes.any
};

function SwitchNetwork(props) {
    const { addError } = useStatus();
    const switchNetwork = () => {
        window.ethereum
            .request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: props.id }]
            })
            .catch((e) => {
                addError(e);
                // dispatch({ type: statusActions.addMessage, message });
                console.log('ERROR: %o, %o', e.message, 'danger');
            });
    };

    return (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip>
                    Current network is not supported, please change the network
                    to: {getNameFromId(props.id)}
                </Tooltip>
            }
        >
            {({ ref, ...triggerHandler }) => (
                <Button
                    variant="primary"
                    {...triggerHandler}
                    className="d-inline-flex align-items-center"
                    onClick={switchNetwork}
                >
                    <svg
                        ref={ref}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-arrow-left-right"
                        viewBox="0 0 16 16"
                    >
                        <path
                            fillRule="evenodd"
                            d="M1 11.5a.5.5 0 0 0 .5.5h11.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 11H1.5a.5.5 0 0 0-.5.5zm14-7a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 4H14.5a.5.5 0 0 1 .5.5z"
                        ></path>
                    </svg>
                    &nbsp; Click to switch network to:&nbsp;
                    <u>{getNameFromId(props.id)}</u>
                </Button>
            )}
        </OverlayTrigger>
    );
}

SwitchNetwork.propTypes = { id: PropTypes.any };

function NetworkContract() {
    const { state } = useChain();
    const registeredNetwork = getFromId(state.chainId);
    const address = registeredNetwork?.address;
    const explorerUrl = registeredNetwork?.explorerUrl;
    const contractUrl = explorerUrl + '/address/' + registeredNetwork?.address;
    return (
        <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>Contract address</Tooltip>}
        >
            {({ ref, ...triggerHandler }) => (
                <div {...triggerHandler}>
                    <a
                        target="_blank"
                        rel="noreferrer noopener"
                        href={contractUrl}
                    >
                        <svg
                            ref={ref}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-boxes"
                            viewBox="0 0 16 16"
                        >
                            <path d="M7.752.066a.5.5 0 0 1 .496 0l3.75 2.143a.5.5 0 0 1 .252.434v3.995l3.498 2A.5.5 0 0 1 16 9.07v4.286a.5.5 0 0 1-.252.434l-3.75 2.143a.5.5 0 0 1-.496 0l-3.502-2-3.502 2.001a.5.5 0 0 1-.496 0l-3.75-2.143A.5.5 0 0 1 0 13.357V9.071a.5.5 0 0 1 .252-.434L3.75 6.638V2.643a.5.5 0 0 1 .252-.434L7.752.066ZM4.25 7.504 1.508 9.071l2.742 1.567 2.742-1.567L4.25 7.504ZM7.5 9.933l-2.75 1.571v3.134l2.75-1.571V9.933Zm1 3.134 2.75 1.571v-3.134L8.5 9.933v3.134Zm.508-3.996 2.742 1.567 2.742-1.567-2.742-1.567-2.742 1.567Zm2.242-2.433V3.504L8.5 5.076V8.21l2.75-1.572ZM7.5 8.21V5.076L4.75 3.504v3.134L7.5 8.21ZM5.258 2.643 8 4.21l2.742-1.567L8 1.076 5.258 2.643ZM15 9.933l-2.75 1.571v3.134L15 13.067V9.933ZM3.75 14.638v-3.134L1 9.933v3.134l2.75 1.571Z" />
                        </svg>
                        &nbsp;
                        {address}
                    </a>
                </div>
            )}
        </OverlayTrigger>
    );
}

NetworkContract.propTypes = {
    href: PropTypes.string,
    address: PropTypes.any
};

function correctChainSelected(network, intendedChainId) {
    let name =
        network?.names && network.names.length > 0 ? network.names[0] : null;
    name = name === 'homestead' ? 'mainnet' : name;
    const correctChain =
        network?.chainId && BigNumber.from(intendedChainId).eq(network.chainId);
    return { name, correctChain };
}

export default function Network() {
    const { state, getSelectedNetwork, correctNetworkSelected } = useChain();
    const networkIfKnown = getSelectedNetwork();

    const reloadPage = () => {
        window.location.reload(true);
    };

    const intendedChainId = getDefaultChain().chainId;

    if (state.connected) {
        let { name } = correctChainSelected(
            networkIfKnown,
            intendedChainId
        );
        let correctChain = correctNetworkSelected()
        if (correctChain) {
            return (
                <div className="p-1">
                    <SelectedNetwork
                        overlay={state?.chainId}
                        name={name}
                        correct={true}
                    />
                </div>
            );
        } else {
            return (
                <div className="text-center p-1">
                    <SelectedNetwork
                        overlay={state?.chainId}
                        name={name ?? state?.name}
                    />
                    &nbsp;
                    <SwitchNetwork id={intendedChainId} />
                </div>
            );
        }
    } else {
        return <InstallMetaMask onClick={reloadPage} />;
    }
}
