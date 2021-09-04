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

    const handleBought = (buyInfo) => {

        if (buyInfo) {
            if (buyInfo['bought'])
                setUpdate({
                    'new_owner': userName
                });

            if (buyInfo['error'])
                setError(buyInfo['error']);

            setBought(buyInfo['bought']);
        } else {
            setBought(false);
        }

        setIsLoading(false);
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
                'relative w-asset mx-auto rounded-md overflow-hidden',
                'flex flex-col',
                'text-base break-words',
                'backdrop-filter backdrop-blur-sm border border-paper',
                'shadow-md bg-paper',
                { 'rounded-br-2xl': frontVisible},
                { 'rounded-bl-2xl': !frontVisible},
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
            <PreviewDetailsTable
                visible={!frontVisible}
                asset={asset}
                update={update}
            />
            <div className={cn(
                'aspect-w-1 aspect-h-1 overflow-hidden',
                {'cursor-pointer' : frontVisible},
                {'cursor-pointer hidden' : !frontVisible},
            )}>
                <Link href={saleId ? `/sale/${saleId}` : `/asset/${asset_id}`}>
                    <div className="flex flex-1 w-full">
                        <PreviewImage {...props} asset={asset} />
                    </div>
                </Link>
            </div>
            <div className={cn(
                'px-2'
            )}>
                <div className={cn(
                    'relative my-3 mb-4',
                )}>
                    <div
                        onClick={toggleShowMenu}
                        className={cn(
                            'hidden',
                            'absolute right-0 w-5 h-5 z-20',
                            'text-white m-auto leading-snug cursor-pointer',
                            'opacity-70 hover:opacity-100',
                        )} 
                    >
                        <img src="/more.svg"
                            className={cn(
                                'transform rotate-90',
                            )}
                            alt=""
                        />
                    </div>
                    <Link href={'/collection/' + collection_name}>
                        <div className={cn(
                            'relative flex items-center w-full leading-4',
                            'text-white leading-relaxed text-sm',
                            'cursor-pointer'
                        )}>
                            { collection['img'] ? <div className="h-4 rounded-lg overflow-hidden">
                                <img src={config.ipfs + collection['img']} className="collection-img" alt=""/>
                            </div> : '' }
                            <div className="font-light ml-2 mr-auto opacity-60 truncate">{collection_name}</div>

                            {mintInfo}
                        </div>
                    </Link>
                </div>

                <Link href={saleId ? `/sale/${saleId}` : `/asset/${asset_id}`}>
                    <p className={cn(
                        'w-full pt-0 mb-5',
                        'text-center text-base font-light text-neutral',
                        'overflow-visible cursor-pointer',
                    )}>
                        {name ? name : asset_id}
                    </p>
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
                    'absolute w-8 h-8 ml-auto bg-transparent',
                    'cursor-pointer outline-none opacity-80',
                    'switch-button hover:opacity-100',
                    {'switch-button-front': frontVisible},
                    {'switch-button-back': !frontVisible},
                )}
                onClick={toggleFront}
            >
                <img src={frontVisible ? 'arrow-left-outline.svg' : 'arrow-right-outline.svg'} />
            </div>

        </div>
    );
}

export default AssetPreview;
