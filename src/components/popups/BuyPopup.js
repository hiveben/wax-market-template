import React, {useState} from 'react';

import config from '../../config.json'

import {
    formatNumber
} from '../helpers/Helpers';

import ErrorMessage from './ErrorMessage';
import LoadingIndicator from "../loadingindicator/LoadingIndicator";

function BuyPopup(props) {
    const listing = props['listing'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];
    const callBack = props['callBack'];
    const closeCallBack = props['closeCallBack'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [bought, setBought] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();

    const { price, assets, sale_id, seller } = listing;

    const asset = assets[0];

    const {collection, schema, name, data, asset_id} = asset;

    const { token_symbol, median, amount, token_precision } = price;

    const quantity = amount / (Math.pow(10, token_precision));

    const image = data['img'] ? data['img'].includes('http') ? data['img'] : config.ipfs + data['img'] : '';
    const video = data['video'] ? data['video'].includes('http') ? data['video'] : config.ipfs + data['video'] : '';

    const buy = async () => {
        closeCallBack();
        setIsLoading(true);

        try {
            const result = await activeUser.signTransaction({
                actions: [{
                    account: 'eosio.token',
                    name: 'transfer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        from: userName,
                        to: 'atomicmarket',
                        quantity: `${quantity.toFixed(8)} WAX`,
                        memo: 'deposit'
                    },
                }, {
                    account: 'atomicmarket',
                    name: 'purchasesale',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        buyer: userName,
                        sale_id: sale_id,
                        taker_marketplace: config.market_name,
                        intended_delphi_median: token_symbol === 'USD' && median ? median : 0
                    }
                }]
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });

            setBought(true);
            callBack(true);
        } catch (e) {
            callBack(false, e, asset_id ? asset_id : sale_id);
            setError(e.message);
            console.log(e);
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack(false);
        closeCallBack();
    };

    return (
        <div className="Popup">
            <img className="CloseButton" onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="PopupTitle">{name}</div>
            <div className="PopupBody">
                <div className="PopupImage">
                    { video ?
                        <video width="190" height="190" loop autoPlay={true} muted={true} playsInline={true} poster={image ? image : ''}>
                            <source src={video} />
                            Your browser does not support the video tag.
                        </video> :
                        <img src = {image}/> }
                </div>
                <div className="PopupDetails">
                    <table>
                        <tbody>
                            <tr><td><b>Collection:</b></td><td>{collection['name']}</td></tr>
                            <tr><td><b>Schema:</b></td><td>{schema['schema_name']}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="Info">{`Do you want to buy this Item for ${formatNumber(quantity)} WAX`}</div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="Buttons">
                <button className="PopupCancelButton" onClick={cancel}>Cancel</button>
                { userName !== seller && !bought ? <button className="PopupBuyButton" onClick={buy}>Buy</button> : '' }
            </div>
            {isLoading ? <div className="Overlay"><LoadingIndicator text="Loading Transaction" /></div> : '' }
        </div>
    );
}

export default BuyPopup;
