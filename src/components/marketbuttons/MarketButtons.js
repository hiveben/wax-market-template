import React, {useContext} from 'react';

import {Context} from "../marketwrapper";
import LoadingIndicator from "../loadingindicator";
import {formatPrice} from "../helpers/Helpers";

function MarketButtons(props) {
    const asset = props['asset'];
    const listing = props['listing'];

    const update = props['update'];
    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const frontVisible = props['frontVisible'];

    const handleList = props['handleList'];
    const handleBought = props['handleBought'];
    const handleCancel = props['handleCancel'];
    const bought = props['bought'];
    const canceled = props['canceled'];
    const listed = props['listed'];
    const setListed = props['setListed'];
    const error = props['error'];
    const setError = props['setError'];
    const isLoading = props['isLoading'];
    const setIsLoading = props['setIsLoading'];

    const [state, dispatch] = useContext(Context);

    const performLogin = async () => {
        ual.showModal();
    };

    let {
        owner, asset_id
    } = asset;

    const cancel = async () => {
        let { sale_id } = listing ? listing : asset.sales && asset.sales.length > 0 && asset.sales[0];

        setError(null);
        setIsLoading(true);

        try {
            await activeUser.signTransaction({
                actions: [{
                    account: 'atomicmarket',
                    name: 'cancelsale',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        sale_id: sale_id
                    },
                }]
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });
            handleCancel(true);
        } catch (e) {
            console.log(e);
            setListed(false);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const buy = () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSET', payload: listing});
        dispatch({ type: 'SET_CALLBACK', payload: (bought) => handleBought(bought) });
        dispatch({ type: 'SET_ACTION', payload: 'buy' });
    };

    const sell = async () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: (sellInfo) => handleList(sellInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'sell' });
    };

    const sellField = (
        <div className="SellField">
            <div className={"SellButton"} onClick={sell}>Sell</div>
        </div>
    );

    const popError = state && state.error && state.error['asset_id'] === asset_id ? state.error['error'] : null;

    const disMissError = () => {
        if (popError)
            dispatch({ type: 'SET_ERROR', payload: null});
        setError(null);
    };

    if (listing) {
        const {listing_price, seller} = listing;

        const formattedPrice = formatPrice(listing);

        const buyField = (
            <div className="BuyContainer">
                <div className="PriceTag">{formattedPrice}</div>
                <div className="BuyButton" onClick={buy}>Buy</div>
            </div>
        );

        const cancelField = (
            <div className="BuyContainer">
                <div className="PriceTag">{formattedPrice}</div>
                <div className="CancelButton" onClick={cancel}>Cancel</div>
            </div>
        );

        const infoField = (
            <div className="BuyContainer">
                <div className="PriceTag">{formattedPrice}</div>
            </div>
        );

        const loginField = (
            <div className="BuyContainer">
                <div className="PriceTag">{formattedPrice}</div>
                <div className="BuyButton" onClick={performLogin}>Buy (Login)</div>
            </div>
        );

        const buyable = listing_price && (!userName || userName !== seller) && !bought && owner;
        const sellable = userName && (userName === owner || (update['new_owner'] && update['new_owner'] === userName)) && (
            !listing_price || bought) && (!listed || bought || canceled);
        const cancelable = userName && (userName === seller);

        const disMissError = () => {
            if (popError)
                dispatch({ type: 'SET_ERROR', payload: null});
            setError(null);
        };

        return (
            <div className={(frontVisible ? "UserArea Show" : "UserArea Hidden")}>
                {isLoading ? <LoadingIndicator className="BuyButton"/> : ''}
                {!isLoading && buyable ? (userName ? buyField : loginField) : ''}
                {!isLoading && sellable ? sellField : ''}
                {!isLoading && cancelable ? cancelField : ''}
                {!isLoading && !cancelable && !sellable && !buyable && listing_price ? infoField : ''}
                {!isLoading && error || popError ? <div className="ErrorNote" onClick={disMissError}>{
                    error ? error : popError.message}</div> : ''}
            </div>
        );
    } else {
        const cancelField = (
            <div className="BuyContainer">
                <div className="CancelButton" onClick={cancel}>Cancel</div>
            </div>
        );
        const sellable = userName && (userName === owner || (
            update['new_owner'] && update['new_owner'] === userName)) && (!listed || bought || canceled);

        const cancelable = userName === owner && asset.sales && asset.sales.length > 0 && !canceled;

        return (
            <div className={(frontVisible ? "UserArea Show" : "UserArea Hidden")}>
                {isLoading ? <LoadingIndicator className="BuyButton"/> : ''}
                {!isLoading && !cancelable && sellable ? sellField : ''}
                {!isLoading && cancelable ? cancelField : ''}
                {!isLoading && error || popError ? <div className="ErrorNote" onClick={disMissError}>{
                    error ? error : popError.message}</div> : ''}
            </div>
        );
    }
}

export default MarketButtons;
