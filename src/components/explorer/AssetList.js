import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";

import {Context} from "../marketwrapper";

import config from "../../config.json";

import {getAssets} from "../api/Api";
import AssetPreview from "../assetpreview";
import LoadingIndicator from "../loadingindicator";
import Pagination from "../pagination/Pagination";
import Filters from "../filters/Filters";
import AssetListContent from "../common/layout/Content"
import {getValues, getOrderDir, getSortBy} from "../helpers/Helpers";

const AssetList = ({props, className}) => {
    const [ state, dispatch ] = useContext(Context);

    const [assets, setAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const values = getValues();

    const collection = values['collection'] ? values['collection'] : '*';
    const schema = values['schema'] ? values['schema'] : '';
    const name = values['name'] ? values['name'] : '';
    const rarity = values['rarity'] ? values['rarity'] : '';
    const variant = values['variant'] ? values['variant'] : '';
    const sortBy = values['sort'] ? values['sort'] : '';

    const initialized = state.collections !== null && state.collections !== undefined;

    const getAssetResult = (result) => {
        setAssets(result);
        setIsLoading(false);
    }

    const initAssets = async (page, collection) => {
        setIsLoading(true);

        getAssets({
            'collections': state.collections.filter(
                item => (!collection || collection === '*') ? true : item === collection
            ),
            'schema': schema,
            'page': page,
            'limit': config.limit,
            'name': name,
            'orderDir': getOrderDir(sortBy),
            'sortBy': getSortBy(sortBy),
            'rarity': rarity,
            'variant': variant
        }).then(result => getAssetResult(result));
    };

    useEffect(() => {
        if (initialized)
            initAssets(page, collection)
    }, [page, initialized]);

    return (
        <AssetListContent>
            <div
                className={cn(
                    'w-full sm:1/3 md:w-1/4 md:ml-4 mx-auto p-0 md:p-5',
                    'max-w-filter'
            )}>    
                <Filters
                    {...props}
                    searchPage={'assets'}
                />
            </div>
            <div
                className={cn(
                    'w-full sm:2/3 md:w-3/4',
                )}
            >
                <Pagination
                    items={assets && assets.data}
                    page={page}
                    setPage={setPage}
                />
                { isLoading ? <LoadingIndicator /> : 
                <div    
                    className={cn(
                        "relative w-full mb-24",
                        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
                    )}
                >
                    {
                        assets && assets['success'] ? assets['data'].map((asset, index) =>
                            <AssetPreview
                                {...props}
                                key={index}
                                index={index}
                                asset={asset}
                            />
                        ) : ''
                    }
                </div> }
                {isLoading ? '' :
                    <Pagination
                        items={assets && assets.data}
                        page={page}
                        setPage={setPage}
                    />
                }
            </div>
        </AssetListContent>
    );
};

export default AssetList;
