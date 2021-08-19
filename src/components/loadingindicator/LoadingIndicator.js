import React from 'react';


function LoadingIndicator(props) {
    const text = props['text'];
    return text ?
    (
        <div className="LoadingContainer">
            <div className="LoadingIndicator">
                <img src="/Loader.svg" className="RefreshIcon Loading    " />
            </div>
            <div className="LoadingText">{text}</div>
        </div>
    ) : (
        <div className="LoadingIndicator">
            <img src="/Loader.svg" className="RefreshIcon Loading    " />
        </div>
    );
}

export default LoadingIndicator;
