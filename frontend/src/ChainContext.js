import React from 'react';
import { BigNumber, ethers } from 'ethers';
import { getDefaultChain, getFromId } from './Networks';

const initialState = {
    balance: BigNumber.from(0),
    connected: false,
    chainId: null,
    name: 'unknown',
    accounts: []
};

const ChainContext = React.createContext();

export const chainActions = {
    connect: 'CONNECT',
    networkChanged: 'NETWORK_CHANGED',
    networkNameChanged: 'NETWORK_NAME_CHANGED',
    accountsChanged: 'ACCOUNTS_CHANGED',
    balanceChanged: 'BALANCE_CHANGED'
};

function useChain() {
    const context = React.useContext(ChainContext);
    if (!context) {
        throw new Error(`useCount must be used within a CountProvider`);
    }
    const [state, dispatch] = context;

    const getSelectedNetwork = React.useCallback(() => {
        return getFromId(state.chainId);
    }, [state.chainId]);

    const correctNetworkSelected = React.useCallback(() => {
        return true;
        // const intendedChainId = getDefaultChain().chainId;
        // const network = getSelectedNetwork();
        // return (
        //     network?.chainId &&
        //     BigNumber.from(intendedChainId).eq(network.chainId)
        // );
    }, [getSelectedNetwork]);

    return {
        state,
        dispatch,
        getSelectedNetwork,
        correctNetworkSelected
    };
}

function chainReducer(state, action) {
    switch (action.type) {
        case chainActions.connect: {
            return { ...state, connected: action.payload };
        }
        case chainActions.networkChanged: {
            return { ...state, chainId: action.payload };
        }
        case chainActions.networkNameChanged: {
            return { ...state, name: action.payload };
        }
        case chainActions.accountsChanged: {
            return { ...state, accounts: action.payload };
        }
        case chainActions.balanceChanged: {
            return { ...state, balance: action.payload };
        }
        default: {
            throw new Error(`Unsupported action type: ${action.type}`);
        }
    }
}

function ChainProvider(props) {
    const [state, dispatch] = React.useReducer(chainReducer, initialState);

    React.useEffect(() => {
        const provider =
            typeof window.ethereum !== 'undefined'
                ? new ethers.providers.Web3Provider(window.ethereum)
                : null;
        const payload = !!provider;
        dispatch({ type: chainActions.connect, payload });
    }, []);

    React.useEffect(() => {
        if (state.connected) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const networkListener = (networkish) => {
                const networkId = networkish?.chainId ?? networkish; // networkish can be an object or a chainId
                dispatch({
                    type: chainActions.networkChanged,
                    payload: BigNumber.from(networkId).toNumber()
                });
            };
            provider.getNetwork().then(networkListener);
            window.ethereum.on('chainChanged', networkListener);
            // NOTE: MetaMask doesn't have 'off', but this only executes 1 time...
            // return () => window.ethereum.off('chainChanged', networkListener);
        }
    }, [state.connected]);

    React.useEffect(() => {
        if (state.connected) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const nameListener = (networkish) => {
                dispatch({
                    type: chainActions.networkNameChanged,
                    payload: networkish.name
                });
            };
            provider.getNetwork().then(nameListener);
        }
    }, [state.chainId]);

    const setAccounts = React.useCallback(
        (newAccounts) => {
            if (newAccounts.length === 0) {
                dispatch({
                    type: chainActions.accountsChanged,
                    payload: newAccounts
                });
                // setNFTs([]);
            } else if (newAccounts !== state.accounts) {
                dispatch({
                    type: chainActions.accountsChanged,
                    payload: newAccounts
                });
            }
        },
        [state.accounts]
    );

    React.useEffect(() => {
        if (state.connected) {
            window.ethereum
                .request({ method: 'eth_accounts' })
                .then(setAccounts);

            window.ethereum.on('accountsChanged', setAccounts);
            // return () => window.ethereum.off('accountsChanged', setAccounts);
        }
    }, [state.chainId]);

    React.useEffect(() => {
        if (state.connected) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const blockListener = (number) => {
                if (state.accounts && state.accounts.length) {
                    provider.getBalance(state.accounts[0]).then((balance) => {
                        if (!balance.eq(state.balance)) {
                            dispatch({
                                type: chainActions.balanceChanged,
                                payload: balance
                            });
                        }
                    });
                }
            };
            provider.getBlockNumber().then(blockListener);
            provider.on('block', blockListener);
            return () => provider.off('block', blockListener);
        }
    }, [state.accounts]);

    const value = React.useMemo(() => {
        return [state, dispatch];
    }, [state]);
    return <ChainContext.Provider value={value} {...props} />;
}

export { ChainProvider, useChain };
