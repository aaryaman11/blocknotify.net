import React from 'react';
import { Alert } from 'react-bootstrap';
import * as PropTypes from 'prop-types';

ErrorHandler.propTypes = {
    error: PropTypes.any
};
export default function ErrorHandler({ error }) {
    return (
        <>
            <Alert variant="danger">
                <Alert.Heading>An uncaught exception occurred!</Alert.Heading>
                <pre>{error.message}</pre>
                <hr />
                <pre>{`${error.stack}`}</pre>
            </Alert>
        </>
    );
}

