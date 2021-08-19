import React, {useEffect, useState} from 'react';

import {
    formatNumber
} from '../helpers/Helpers';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import config from "../../config.json";

function SellPopup(props) {
    const asset = props['asset'];

    const {collection, schema, name, data, asset_id} = asset;

    const image = data['img'] ? data['img'].includes(
        'http') ? data['img'] : config.ipfs + data['img'] : '';

    const video = data['video'] ? data['video'].includes(
        'http') ? data['video'] : config.ipfs + data['video'] : '';

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const closeCallBack = props['closeCallBack'];
    const [sellPrice, setSellPrice] = useState(0);

    useEffect(() => {
    }, []);

    const sell = async () => {
        if (!sellPrice)
            return;
        const quantity = parseFloat(sellPrice);
        const { assetId } = asset;
        closeCallBack();
        setIsLoading(true);
        try {
            const result = await activeUser.signTransaction({
                actions: [{
                    account: 'atomicmarket',
                    name: 'announcesale',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        seller: userName,
                        maker_marketplace: config.market_name,
                        settlement_symbol: '8,WAX',
                        asset_ids: [asset_id],
                        listing_price: quantity.toFixed(8)+' WAX'
                    },
                }, {
                    account: 'atomicassets',
                    name: 'createoffer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        sender: userName,
                        recipient: 'atomicmarket',
                        sender_asset_ids: [asset_id],
                        recipient_asset_ids: [],
                        memo: 'sale'
                    },
                }]
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });
            callBack({listed: true, price: quantity});
        } catch (e) {
            callBack({listed: false, error: e});
            console.log(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack({listed: false, market: null, offer: 0});
        closeCallBack();
    };

    const changePrice = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val))
            setSellPrice(val);
    };

    let cut = sellPrice - (0.04 * sellPrice);
    if (collection['market_fee'])
        cut = cut - collection['market_fee'] * sellPrice;

    return (
        <div className="Popup">
            <img className="CloseButton" onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="PopupTitle">{name}</div>
            <div className="PopupBody">
                <div className="PopupImage">
                    { video ?
                        <video width="190" height="190" loop autoPlay={true} muted={true} playsInline={true} poster={
                            image ? image : ''}>
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
            <div className="Info">{`Are you sure you want to sell ${name} for ${formatNumber(sellPrice)} WAX `}</div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="Buttons">
                <input className={"SellInput Memo"} type="text" placeholder="Price" onChange={changePrice} value={sellPrice ? sellPrice : ''}/>
                <button className="PopupCancelButton" onClick={cancel}>Cancel</button>
                <button className="PopupSellButton" onClick={sell}>Sell</button>
            </div>
            {collection['market_fee'] || collection['market_fee'] === 0 ?
                <div className="SellCalc">
                    <div>Market Fee: 2%</div>
                    <div>WAX Fee: 2%</div>
                    <div>Collection Fee: {collection['market_fee'] * 100}%</div>
                    <div>Your Cut: {cut} WAX</div>
                </div> : <LoadingIndicator/>
            }

            {isLoading ? <div className="Overlay"><LoadingIndicator text="Loading Transaction"/></div> : '' }
        </div>
    );
}

export default SellPopup;
