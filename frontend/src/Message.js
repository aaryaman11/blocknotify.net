import { React, useState, useEffect } from 'react';
import * as PropTypes from 'prop-types';

const Message = ({ variant, callback, timeout, children }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        const timeId = setTimeout(() => {
            // After 3 seconds set the show value to false
            setShow(false);
            callback();
        }, timeout ?? 5000);

        return () => {
            clearTimeout(timeId);
        };
    }, []);

    if (!show) {
        return null;
    }

    return (
        <div className={`p-1 alert alert-${variant} border border-${variant}`}>
            {children}
        </div>
    );
};

Message.propTypes = {
    variant: PropTypes.any,
    callback: PropTypes.any,
    timeout: PropTypes.any,
    children: PropTypes.any
};

Message.defaultPros = {
    variant: 'info'
};

export default Message;
