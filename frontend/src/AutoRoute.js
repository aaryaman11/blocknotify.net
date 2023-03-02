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
import Verify from "./Verify";
import SelectEvents from "./SelectEvents";


function MiddleRow() {
    return (<div className="row align-items-center justify-content-around">
        <div
            className="col media m-3 p-3 d-flex align-items-center rounded-3 border border-primary bg-dark bg-gradient text-light"
            style={{'--bs-bg-opacity': 0.75}}
        >
            <div className="media-body p-2">
                <div className="row">
                    <div className="col">
                        <h5 className="mt-0 mb-1 text-warning display-6">
                            <b>Welcome to BlockNotify</b>
                        </h5>
                        <h6>Get notified of on-chain events!</h6>
                    </div>
                </div>
                <Alert variant="info">
                    <Alert.Heading><u>Connect a wallet to continue</u></Alert.Heading>
                    <p>BlockNotify will use one of your wallet accounts as your identity to authenticate. All
                        actions
                        for the notifications service will require signing messages with the same wallet. The only
                        data
                        that is saved is the destination of the notification, the identity address, and what alerts
                        to
                        trigger on.</p>
                </Alert>
                <hr/>
                <p>With BlockNotify, you can rest assured that your blockchain assets are being monitored by a
                    reliable and efficient system. Our security analytics engine constantly scans the blockchain for
                    any suspicious activity, and if any are detected, we can notify you immediately or even perform
                    actions on your behalf to protect your assets.</p>
                <p>Don't wait until it's too late - sign up for BlockNotify today and take control of your
                    blockchain security.</p>
            </div>
        </div>
    </div>);
}

function noWalletConnectedView() {
    return (<div className="not-connected">
        <ErrorBoundary FallbackComponent={ErrorHandler}>
            <Header/>
            <div className="container" id="content">
                <MiddleRow/>
            </div>
            <Footer/>
            <Messages/>
        </ErrorBoundary>
    </div>);
}

export default function AutoRoute() {
    // const {addError} = useStatus();
    const {state} = useChain();
    const [status, setStatus] = React.useState("connect");
    const {addAPIError} = useStatus();


    React.useEffect(() => {
        const mainAcct = state.accounts[0]
        if (mainAcct) {
            axios
                .get(`${env.BACKEND_URL}/api/status`, {"params": {"address": mainAcct}})
                .then((res) => setStatus(res?.data?.status))
                .catch(err => addAPIError(err));
        }
    }, [state]);

    if (state.accounts.length === 0) {
        return noWalletConnectedView();
    } else if (status === "exists") {
        return (<SelectEvents/>)
    } else if (status === "pending") {
        return (<Verify onReload={setStatus}/>)
    } else if (status === "new") {
        return (<Register onReload={setStatus}/>)
    } else { // connect? + default?
        return noWalletConnectedView();
        // console.log("Not expected!?")
        // return (<Register/>)
    }
}
