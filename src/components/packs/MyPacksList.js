import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";
import {Context} from "../marketwrapper";
import {getFilters, getValues} from "../helpers/Helpers";
import {getAssets} from "../api/Api";
import config from "../../config.json";
import Page from "../common/layout/Page";
import Header from "../common/util/Header";
import MarketContent from "../common/layout/Content";
import Filters from "../filters/Filters";
import Pagination from "../pagination/Pagination";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import AssetPreview from "../assetpreview/AssetPreview";
import ScrollUpIcon from "../common/util/ScrollUpIcon";

export default function MyPacksList(props) {
    const [ state, dispatch ] = useContext(Context);

    const [assets, setAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const values = getValues();
    values['user'] = props['user'];

    const initialized = state.collections !== null && state.collections !== undefined;

    const getAssetsResult = (result) => {
        setAssets(result);
        setIsLoading(false);
    }

    const initInventory = async (page) => {
        setIsLoading(true);
        getAssets(getFilters(values, state.collections, 'inventory', page)).then(result => getAssetsResult(result));
    };

    useEffect(() => {
        if (initialized)
            initInventory(page)
    }, [page, initialized]);

    return (
        <MarketContent>
            <div className={cn('w-full grid grid-cols-8 gap-10')}>
                <div
                    className={cn(
                        'col-span-8 sm:col-span-2',
                    )}
                >
                    <Filters
                        {...props}
                        searchPage={'inventory'}
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
                        <div className={cn(
                            "relative w-full mb-24",
                            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        )}>
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
                        </div>
                    }
                    {isLoading ? '' :
                        <Pagination
                            items={assets && assets.data}
                            page={page}
                            setPage={setPage}
                        />
                    }
                </div>
            </div>
        </MarketContent>
    );
}