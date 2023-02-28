import React from 'react';
import ErrorHandler from './ErrorHandler';
import {ErrorBoundary} from 'react-error-boundary';
import Footer from './Footer';
import Header from './Header';
import {useChain} from './ChainContext';
import {ethers} from 'ethers';
import {Messages, useStatus} from './StatusContext';
import {Buffer} from "buffer";
import Register from "./Register";
import {Alert} from "react-bootstrap";
import axios from "axios";

function noWalletConnectedView() {
    return (<div className="not-connected">
        <ErrorBoundary FallbackComponent={ErrorHandler}>
            <Header/>
            <div className="container" id="content">
                <Alert variant="info">
                    <Alert.Heading>Connect a wallet to continue!</Alert.Heading>
                    <p>BlockNotify will use one of your wallet accounts as your identity to authenticate. All actions
                        for the notifications service will require signing messages with the same wallet. The only data
                        that is saved is the destination of the notification, the identity address, and what alerts to
                        trigger on.</p>
                </Alert>
                <div>
                    <h1>Welcome to BlockNotify!</h1>
                    <p>BlockNotify is a security analytics engine that monitors blockchain events and can send
                        notifications or perform actions on user behalfs. Our team started on a mission at ETH Denver
                        2023 to create a notification system for a wallet that needs to notify users for DAO and
                        MultiSig events. However, after integrating the block parse, we discovered that we had many more
                        possibilities than what we originally set out to build.</p>
                    <p>With BlockNotify, you can rest assured that your blockchain assets are being monitored by a
                        reliable and efficient system. Our security analytics engine constantly scans the blockchain for
                        any suspicious activity, and if any are detected, we can notify you immediately or even perform
                        actions on your behalf to protect your assets.</p>
                    <p>Don't wait until it's too late - sign up for BlockNotify today and take control of your
                        blockchain security.</p>
                </div>
            </div>
            <Footer/>
            <Messages/>
        </ErrorBoundary>
    </div>);
}

export default function AutoRoute() {
    // const {addError} = useStatus();
    const {state} = useChain();
    if (state.accounts.length === 0) {
        return noWalletConnectedView();
    } else {
        // const mainAcct = state.accounts[0]
        // axios
        //     .get("http://localhost:8000/api/pending", mainAcct)
        //     .then((res) => this.pending(res))
        //     .catch((err) => addError(err));
        return (<Register/>)
    }
}
