import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";

import {Context} from "../marketwrapper";

import {getAssets} from "../api/Api";
import AssetPreview from "../assetpreview/AssetPreview";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import Pagination from "../pagination/Pagination";
import Filters from "../filters/Filters";
import {getValues, getFilters} from "../helpers/Helpers";

function AssetList(props) {
    const [ state, dispatch ] = useContext(Context);

    const [assets, setAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const values = getValues();

    const initialized = state.collections !== null && state.collections !== undefined;

    const getAssetResult = (result) => {
        setAssets(result);
        setIsLoading(false);
    }

    const initAssets = async (page) => {
        setIsLoading(true);

        getAssets(getFilters(values, state.collections, 'assets', page)).then(result => getAssetResult(result));
    };

    useEffect(() => {
        if (initialized)
            initAssets(page)
    }, [page, initialized]);

    return (
        <div className={cn('w-full grid grid-cols-8 gap-10')}>
            <div
                className={cn(
                    'col-span-8 sm:col-span-2',
            )}>    
                <Filters
                    {...props}
                    searchPage={'assets'}
                />
            </div>
            <div
                className={cn(
                    'col-span-8 sm:col-span-6',
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
                        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
                    )}
                >
                    {
                        assets && assets['success'] ? assets['data'].map((asset, index) =>
                            <AssetPreview
                                {...props}
                                key={index}
                                index={index}
                                assets={[asset]}
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
        </div>
    );
}

export default AssetList;
