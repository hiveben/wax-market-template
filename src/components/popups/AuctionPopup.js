import React, {useState} from 'react';

import {
    formatNumber
} from '../helpers'

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import config from "../../config.json";
import cn from "classnames";
import PopupContent from "./PopupContent";

function AuctionPopup(props) {
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
    const [days, setDays] = useState(1);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    let cut = sellPrice - (0.04 * sellPrice);
    if (collection['market_fee'])
        cut = cut - collection['market_fee'] * sellPrice;

    const auction = async () => {
        if (!sellPrice)
            return;
        const quantity = parseFloat(sellPrice);
        const { assetId } = asset;
        closeCallBack();
        setIsLoading(true);
        try {
            await activeUser.signTransaction({
                actions: [{
                    account: 'atomicmarket',
                    name: 'announceauct',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        duration: (days ? parseInt(days) * 24 * 60 * 60 : 0) + (hours ? parseInt(hours) * 60 * 60 : 0) + (minutes ? parseInt(minutes) * 60 : 0),
                        starting_bid: quantity.toFixed(8)+' WAX',
                        seller: userName,
                        maker_marketplace: 'nft.hive',
                        asset_ids: [asset_id]
                    },
                }, {
                    account: 'atomicassets',
                    name: 'transfer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        from: userName,
                        memo: 'auction',
                        asset_ids: [asset_id],
                        to: 'atomicmarket'
                    },
                }]
            }, {
                expireSeconds: 300, blocksBehind: 0,
            });
            callBack({auctioned: true});
        } catch (e) {
            callBack({auctioned: false, error: e.message});
            console.log(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack({auctioned: false});
        closeCallBack();
    };

    const changePrice = (e) => {
        const val = e.target.value;
        if (/^\d*\.?\d*$/.test(val))
            setSellPrice(val);
    };

    const changeHours = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val))
            setHours(val);
    };

    const changeMinutes = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val))
            setMinutes(val);
    };

    const changeDays = (e) => {
        const val = e.target.value;
        if (/^\d*$/.test(val))
            setDays(val);
    };

    return (
        <div className={cn(
            'fixed top-40 left-popup',
            'w-full max-w-popup lg:max-w-popup-lg h-auto',
            'p-3 lg:p-8 m-0',
            'text-sm text-neutral font-light opacity-100',
            'bg-paper rounded-xl shadow-lg z-40',
            'backdrop-filter backdrop-blur-lg',
        )}>
            <img className="absolute z-50 cursor-pointer top-4 right-4 w-4 h-4 " onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="text-3xl text-center">{name}</div>
            <PopupContent image={image} video={video} collection={collection['name']} schema={schema['schema_name']} />
            <div className="text-lg text-left my-4">
                {`Are you sure you want to auction ${name} for ${formatNumber(sellPrice)} WAX `}
            </div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="Buttons">
                <div className={cn(
                    'relative l-0 m-auto h-20 lg:h-8',
                    'flex justify-evenly flex-wrap lg:justify-end'
                )}>
                    <input className={"SellInput Memo"} type="text" placeholder="Price" onChange={changePrice} value={sellPrice ? sellPrice : ''}/>
                </div>
                <div className="LabelBox">
                    <div className="DropdownLabel">Days</div>
                    <div className={cn(
                        'relative l-0 m-auto h-20 lg:h-8',
                        'flex justify-evenly flex-wrap lg:justify-end'
                    )}>
                        <input className={"SellInput Memo"} placeholder={"Days"} type="text" onChange={changeDays} value={days ? days : ''}/>
                    </div>
                </div>
                <div className="LabelBox">
                    <div className="DropdownLabel">Hours</div>
                    <div className={cn(
                        'relative l-0 m-auto h-20 lg:h-8',
                        'flex justify-evenly flex-wrap lg:justify-end'
                    )}>
                        <input className={"SellInput Memo"} placeholder={"Hours"} type="text" onChange={changeHours} value={hours ? hours : ''}/>
                    </div>
                </div>
                <div className="LabelBox">
                    <div className="DropdownLabel">Minutes</div>
                    <div className={cn(
                        'relative l-0 m-auto h-20 lg:h-8',
                        'flex justify-evenly flex-wrap lg:justify-end'
                    )}>
                        <input className={"SellInput Memo"} placeholder={"Minutes"} type="text" onChange={changeMinutes} value={minutes ? minutes : ''}/>
                    </div>
                </div>
                <button className="PopupCancelButton Small" onClick={cancel}>Cancel</button>
                <button disabled={!sellPrice || ((!days || days === '0') && (!hours || hours === '0') && (!minutes || minutes === '0')) ? 'disabled' : ''} className="PopupSellButton Small" onClick={auction}>Auction</button>
            </div>
            {collection['market_fee'] || collection['market_fee'] === 0 ?
                <div className="SellCalc">
                    <div>Market Fee: 2%</div>
                    <div>WAX Fee: 2%</div>
                    <div>Collection Fee: {collection['market_fee'] * 100}%</div>
                    <div>Your Cut: {cut} WAX</div>
                </div> : <LoadingIndicator/>
            }

            {isLoading ? <div className="Overlay"><LoadingIndicator text={'Loading Transaction'}/></div> : '' }
        </div>
    );
}

export default AuctionPopup;
