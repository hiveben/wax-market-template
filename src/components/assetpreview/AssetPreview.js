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
        <div className={`AssetPreview ${frontVisible ? 'Front' : 'Back'}`} id={'AssetPreview_'+index}>
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
            <div onClick={toggleShowMenu} className={`MoreButton ${showMenu ? 'Show' : 'Hide'}`}>
                <img src="/more.svg" />
            </div>
            <Link href={'/collection/' + collection_name}>
                <div className={'AssetPreviewCollection NextLink'}>
                    { collection['img'] ? <div className="CollectionIcon">
                        <img src={config.ipfs + collection['img']} />
                    </div> : '' }
                    <div className="CollectionTitle">{collection_name}</div>
                </div>
            </Link>
            <PreviewDetailsTable
                visible={!frontVisible}
                asset={asset}
                update={update}
            />
            <div className={frontVisible ? "AssetArea NextLink Show" : "AssetArea NextLink Hidden"}>
                <Link href={saleId ? `/sale/${saleId}` : `/asset/${asset_id}`}>
                    <div className={"AssetPreviewImage"}>
                        <PreviewImage {...props} asset={asset} />
                    </div>
                </Link>
                {mintInfo}
                <Link href={saleId ? `/sale/${saleId}` : `/asset/${asset_id}`}>
                    <div className={name && name.length >= 20 ? "AssetPreviewTitle Small NextLink" : "AssetPreviewTitle NextLink"}>
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
                /> : '' }
            <div className={`SwitchButton ${frontVisible ? 'Front' : 'Back'} NextLink `} onClick={toggleFront} />
        </div>
    );
}

export default AssetPreview;
