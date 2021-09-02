import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";

import {Context} from "../marketwrapper";

import config from "../../config.json";

import {getAssets} from "../api/Api";
import AssetPreview from "../assetpreview";
import LoadingIndicator from "../loadingindicator";
import Pagination from "../pagination/Pagination";
import Filters from "../filters/Filters";
import {getValues} from "../helpers/Helpers";

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

    const initialized = state.collections !== null && state.collections !== undefined;

    const getAssetResult = (result) => {
        setAssets(result);
        setIsLoading(false);
    }

    const initAssets = async (page, collection) => {
        setIsLoading(true);

        console.log(name);
        console.log(rarity);

        getAssets({
            'collections': state.collections.filter(
                item => (!collection || collection === '*') ? true : item === collection
            ),
            'schema': schema,
            'page': page,
            'limit': config.limit,
            'name': name,
            'rarity': rarity,
            'variant': variant
        }).then(result => getAssetResult(result));
    };

    useEffect(() => {
        if (initialized)
            initAssets(page, collection)
    }, [page, initialized]);

    return (
        <div className={cn('flex')}>
            <div className={cn(
                'container mx-auto',
                'grid grid-cols-10 gap-3',
            )}>
                <div
                    className={cn(
                        'col-span-10 sm:col-span-2',
                        'border-r border-separate border-paper'
                )}>    
                    <Filters
                        {...props}
                        searchPage={'assets'}
                    />
                </div>
                <div
                    className={cn(
                        'col-span-10 sm:col-span-8',
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
                    {isLoading &&
                        <Pagination
                            items={assets && assets.data}
                            page={page}
                            setPage={setPage}
                        />
                    }
                </div>
            </div>
        </div>
    );
};

export default AssetList;
