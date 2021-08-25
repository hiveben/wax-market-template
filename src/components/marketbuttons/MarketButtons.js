import React, {useContext} from 'react';

import {Context} from "../marketwrapper";
import LoadingIndicator from "../loadingindicator";
import {formatPrice} from "../helpers/Helpers";
import cn from "classnames";

export default function MarketButtons(props) {
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

    const Container = ({ children, className}) => {
        return (
            <div
                className={cn(
                    'relative h-auto w-full',
                    'text-center font-bold text-white',
                    className
                )}
            >
                {children}
            </div>
        )
    }

    const BuySellButton = ({onClick, className, children}) => {
        return (
            <div
                className={cn(
                    'w-24 h-6 bg-transparent mt-4 mx-auto mb-0',
                    'text-blue-700 cursor-pointer text-xs font-bold leading-6',
                    'border border-solid border-blue-700 rounded outline-none',
                    className
                )}
                onClick={onClick}
            >
                {children}
            </div>
        )
    }

    const sellField = (
        <Container>
            <BuySellButton onClick={sell}>
                Sell
            </BuySellButton>
        </Container>
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
            <Container>
                <div className="relative py-0 px-1 text-xs w-full inline">{formattedPrice}</div>
                <BuySellButton
                    className="relative text-center mx-auto top-0 left-0"
                    onClick={buy}
                >
                    Buy
                </BuySellButton>
            </Container>
        );

        const cancelField = (
            <Container>
                <div className="relative py-0 px-1 text-xs w-full inline">{formattedPrice}</div>
                <BuySellButton
                    className="relative text-center mx-auto top-0 left-0"
                    onClick={cancel}
                >
                    Cancel
                </BuySellButton>
            </Container>
        );

        const infoField = (
            <Container>
                <div className="relative py-0 px-1 text-xs w-full inline">{formattedPrice}</div>
            </Container>
        );

        const loginField = (
            <Container>
                <div className="relative py-0 px-1 text-xs w-full inline">{formattedPrice}</div>
                <BuySellButton
                    className="relative text-center mx-auto top-0 left-0"
                    onClick={performLogin}
                >
                    Buy (Login)
                </BuySellButton>
            </Container>
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
            <div
                className={cn(
                    'relative w-full h-20 mb-auto flex flex-wrap justify-between',
                    {'block': frontVisible},
                    {'hidden': !frontVisible},
                )}
            >
                {isLoading ? <LoadingIndicator className="m-auto"/> : ''}
                {!isLoading && buyable ? (userName ? buyField : loginField) : ''}
                {!isLoading && sellable ? sellField : ''}
                {!isLoading && cancelable ? cancelField : ''}
                {!isLoading && !cancelable && !sellable && !buyable && listing_price ? infoField : ''}
                {!isLoading && error || popError ? <div className={cn(
                    'absolute bg-gray-800 rounded p-2 mx-auto leading-5 flex justify-center',
                    'text-center text-blue-700 text-xs z-30',
                    'border border-solid border-red-800 rounded outline-none',
                    'error-note-size',
                )} onClick={disMissError}>{
                    error ? error : popError.message}
                </div> : ''}
            </div>
        );
    } else {
        const cancelField = (
            <Container>
                <div className="relative text-center ml-auto mr-auto top-0 left-0" onClick={cancel}>Cancel</div>
            </Container>
        );
        const sellable = userName && (userName === owner || (
            update['new_owner'] && update['new_owner'] === userName)) && (!listed || bought || canceled);

        const cancelable = userName === owner && asset.sales && asset.sales.length > 0 && !canceled;

        return (
            <div
                className={cn(
                    'relative w-full h-20 mb-auto flex flex-wrap justify-between',
                    {'block': frontVisible},
                    {'hidden': !frontVisible},
                )}
            >
                {isLoading ? <LoadingIndicator className="m-auto"/> : ''}
                {!isLoading && !cancelable && sellable ? sellField : ''}
                {!isLoading && cancelable ? cancelField : ''}
                {!isLoading && error || popError ? <div className={cn(
                    'absolute bg-gray-800 rounded p-2 mx-auto leading-5 flex justify-center',
                    'text-center text-blue-700 text-xs z-30',
                    'border border-solid border-red-800 rounded outline-none',
                    'error-note-size',
                )} onClick={disMissError}>{
                    error ? error : popError.message}
                </div> : ''}
            </div>
        );
    }
}
