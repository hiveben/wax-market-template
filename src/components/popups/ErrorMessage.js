import React from 'react';


function ErrorMessage(props) {
    const error = props['error'];
    const layer = props['layer'];

    return (
        <div className={layer ? `ErrorMessage Layer${layer}` :"ErrorMessage"}>
            <div className="ErrorIcon"><img src="/Warning_icn.svg" alt="!" /></div>
            <div className="ErrorItem">{error}</div>
        </div>
    );
}

export default ErrorMessage;
