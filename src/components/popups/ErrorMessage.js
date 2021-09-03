import React from 'react';
import cn from "classnames";


function ErrorMessage(props) {
    const error = props['error'];
    const layer = props['layer'];

    return (
        <div className={cn(
            'absolute t-5 l-5 error-message-size flex m-0.5 z-50',
            'text-xs text-center text-blue-700 bg-gray-800',
            'border border-solid border-red-700 rounded',
            {'z-30' : layer},
        )}>
            <div className="m-auto">
                <img className="w-5 h-5" src="/Warning_icn.svg" alt="!" />
            </div>
            <div className="m-auto">{error}</div>
        </div>
    );
}

export default ErrorMessage;
