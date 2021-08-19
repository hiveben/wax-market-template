import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../marketwrapper";

import AssetPreview from "../assetpreview/AssetPreview";
import {getAssets, getListings, getSales} from "../api/Api";
import LoadingIndicator from "../loadingindicator";

const StaticAssetList = (props) => {
    const type = props.type;

    const collection = props.collection;

    const [ state, dispatch ] = useContext(Context);

    const [listings, setListings] = useState([]);

    const [sales, setSales] = useState([]);

    const [assets, setAssets] = useState([]);

    const [isLoading, setIsLoading] = useState(false);

    const getListingsResult = (result) => {
        setListings(result);
        setIsLoading(false);
    }

    const getAssetsResult = (result) => {
        setAssets(result);
        setIsLoading(false);
    }

    const getSalesResult = (result) => {
        setSales(result);
        setIsLoading(false);
    }

    const initListings = async (page, collection) => {
        setIsLoading(true);
        getListings(
            state.collections.filter(
                item => (!collection || collection === '*') ? true : item === collection
            ), page, 5).then(result => getListingsResult(result));
    };

    const initSales = async (page, collection) => {
        setIsLoading(true);
        getSales(
            state.collections.filter(
                item => (!collection || collection === '*') ? true : item === collection
            ), page, 5).then(result => getSalesResult(result));
    };

    const initAssets = async (page, collection) => {
        setIsLoading(true);
        getAssets(state.collections.filter(
            item => (!collection || collection === '*') ? true : item === collection
        ), page, 3).then(result => getAssetsResult(result));
    };

    useEffect(() => {
        if (type === 'listings')
            initListings(1, collection)
        if (type === 'assets')
            initAssets(1, collection)
        if (type === 'sales')
            initSales(1, collection)
    }, [type, collection]);

    return (
        <div className={"Results"}>
            { isLoading ? <LoadingIndicator /> : <div className={"AssetList"}>
            {
                listings && listings['success'] ? listings['data'].map((listing, index) =>
                    <AssetPreview
                        {...props}
                        index={index}
                        listing={listing}
                        asset={listing.assets[0]}
                    />
                ) : ''
            }
            {
                assets && assets['success'] ? assets['data'].map((asset, index) =>
                    <AssetPreview
                        {...props}
                        index={index}
                        asset={asset}
                    />
                ) : ''
            }
                {
                    sales && sales['success'] ? sales['data'].map((sale, index) =>
                        <AssetPreview
                            {...props}
                            index={index}
                            sale={sale}
                            asset={sale.assets[0]}
                        />
                    ) : ''
                }
            </div> }
        </div>
    );
};

export default StaticAssetList;
