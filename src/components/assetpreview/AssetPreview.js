import React, {useEffect, useState} from 'react';

import config from "../../config.json";

import MarketButtons from '../marketbuttons';

import {
    formatMintInfo
} from "../helpers/Helpers";
import PreviewDetailsTable from "./PreviewDetailsTable";
import Link from 'next/link';
import MoreOptions from "./MoreOptions";
import PreviewImage from "./PreviewImage";
import {getListingsById, getAsset} from "../api/Api";
import cn from "classnames";

function AssetPreview(props) {
    const [listing, setListing] = useState(props['listing']);

    const [asset, setAsset] = useState(props['asset']);

    const index = props['index'];
    const selectedAsset = props['selectedAsset'];
    const prevType = props['type'];

    const [update, setUpdate] = useState({});
    const [frontVisible, setFrontVisible] = useState(true);
    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;
    const [showMenu, setShowMenu] = useState(false);
    const [error, setError] = useState(null);
    const [bought, setBought] = useState(false);
    const [canceled, setCanceled] = useState(false);
    const [listed, setListed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [transferred, setTransferred] = useState(false);

    const {
        collection, asset_id, template_mint, name
    } = asset;
    
    const {
        collection_name
    } = collection;

    const saleId = listing ? listing['sale_id'] : (
        asset.sales && asset.sales.length > 0 ? asset.sales[0]['sale_id'] : null);

    useEffect(() => {
    }, [frontVisible, saleId]);

    const handleBought = (bought) => {
        if (bought) {
            setUpdate({
                'new_owner': userName
            });
        }

        setIsLoading(false);
        setBought(bought);
    };

    const updateListing = (res) => {
        if (res) {
            setListing(res.data[0])
        }
    };

    const handleList = async (sellInfo) => {
        if (sellInfo) {
            const wasListed = sellInfo['listed'];
            const error = sellInfo['error'];

            if (error)
                setError(error);

            if (wasListed) {
                await new Promise(r => setTimeout(r, 2000));
                getListingsById(asset.asset_id).then(res => updateListing(res))
            }

            setListed(wasListed);
        }
        setIsLoading(false);
    };

    const handleCancel = (cancel) => {
        try {
            if (cancel) {
                setCanceled(cancel);
                setListing(null);
            }

            setIsLoading(false);
        } catch (e) {
            console.log(e.message);
            setCanceled(false);
            setIsLoading(false);
            setError(e.message);
        }
    };

    const handleTransfer = async (sellInfo) => {
        if (sellInfo) {
            const wasTransferred = sellInfo['transferred'];
            const error = sellInfo['error'];

            if (error)
                setError(error);

            if (wasTransferred) {
                await new Promise(r => setTimeout(r, 2000));
                getAsset(asset.asset_id).then(res => setAsset(res))
            }

            setTransferred(wasTransferred);
        }
        setIsLoading(false);
    };

    let mintInfo = formatMintInfo(template_mint);

    const toggleShowMenu = () => {
        setShowMenu(!showMenu);
    };

    const toggleFront = () => {
        setFrontVisible(!frontVisible);
    };

    return (
        <div 
            className={cn(
                'relative w-asset h-asset p-0.5 rounded-2xl mb-8 m-auto',
                'text-center text-base break-words',
                'backdrop-filter backdrop-blur-sm',
                'shadow-md bg-gray-500',
                { 'Front': frontVisible},
                { 'Back': !frontVisible},
            )}
            id={'AssetPreview_'+index}
        >
            <MoreOptions
                setShowMenu={setShowMenu}
                ual={props['ual']}
                showMenu={showMenu}
                asset={asset}
                handleTransfer={handleTransfer}
                listed={listed}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                transferred={transferred}
            />
            <div
                onClick={toggleShowMenu}
                className={cn(
                    'absolute top-2 right-2 w-5 h-5 z-20',
                    'text-white m-auto cursor-pointer',
                    'opacity-70 hover:opacity-100',
                )}
            >
                <img
                    src="/more.svg"
                    className={cn(
                        'transition duration-250',
                        { 'transform rotate-90': showMenu},
                        { 'transform rotate-0': !showMenu},
                    )}    
                />
            </div>
            <Link href={'/collection/' + collection_name}>
                <div className={cn(
                    'relative flex w-40 h-4 leading-4 m-2',
                    'text-white text-xs',
                    'cursor-pointer'
                )}>
                    { collection['img'] ? <div className="h-4 rounded-lg overflow-hidden">
                        <img src={config.ipfs + collection['img']} className="collection-img" />
                    </div> : '' }
                    <div className="text-center mx-2">{collection_name}</div>
                </div>
            </Link>
            <PreviewDetailsTable
                visible={!frontVisible}
                asset={asset}
                update={update}
            />
            <div className={cn(
                {'h-60 cursor-pointer' : frontVisible},
                {'h-60 cursor-pointer hidden' : !frontVisible},
            )}>
                <Link href={saleId ? `/sale/${saleId}` : `/asset/${asset_id}`}>
                    <div className="flex w-48 h-48 mx-auto justify-center">
                        <PreviewImage {...props} asset={asset} />
                    </div>
                </Link>
                {mintInfo}
                <Link href={saleId ? `/sale/${saleId}` : `/asset/${asset_id}`}>
                    <div className={cn(
                        'flex justify-evenly',
                        'w-40 h-8 pt-0 mt-4 mx-auto mb-auto',
                        'text-white font-normal',
                        'overflow-visible cursor-pointer',
                        {"text-xs-asset" : name && name.length >= 20 },
                        {"text-sm-asset" : !(name && name.length >= 20)},
                    )}>
                        <div>{name ? name : asset_id}</div>
                    </div>
                </Link>
            </div>
            {!selectedAsset && selectedAsset !== 0 ?
                <MarketButtons
                    type={prevType}
                    ual={props['ual']}
                    asset={asset}
                    listing={listing}
                    update={update}
                    frontVisible={frontVisible}
                    handleList={handleList}
                    handleBought={handleBought}
                    handleCancel={handleCancel}
                    bought={bought}
                    canceled={canceled}
                    error={error}
                    setError={setError}
                    listed={listed}
                    setListed={setListed}
                    setIsLoading={setIsLoading}
                    isLoading={isLoading}
                /> : ''
            }
            <div
                className={cn(
                    'absolute w-0 h-0 ml-auto bg-transparent', 
                    'cursor-pointer outline-none opacity-50',
                    'switch-button hover:opacity-100',
                    'rounded-bl-4xl',
                    {'switch-button-front': frontVisible},
                    {'switch-button-back': !frontVisible},
                )}
                onClick={toggleFront}
            />
        </div>
    );
}

export default AssetPreview;
