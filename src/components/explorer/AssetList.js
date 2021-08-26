import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../marketwrapper";

import config from "../../config.json";

import {getAssets} from "../api/Api";
import AssetPreview from "../assetpreview";
import LoadingIndicator from "../loadingindicator";
import Pagination from "../pagination/Pagination";
import Filters from "../filters/Filters";
import {getValues} from "../helpers/Helpers";

const AssetList = (props) => {
    const [ state, dispatch ] = useContext(Context);

    const [assets, setAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const values = getValues();

    const collection = values['collection'] ? values['collection'] : '*';

    const schema = values['schema'] ? values['schema'] : '';

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
            'limit': config.limit
        }).then(result => getAssetResult(result));
    };

    useEffect(() => {
        if (initialized)
            initAssets(page)
    }, [page, initialized]);

    return (
        <div className={"MarketContent"}>
            <div className={"Results"}>
                <Filters
                    {...props}
                    collection={collection}
                />
                <Pagination
                    items={assets && assets.data}
                    page={page}
                    setPage={setPage}
                />
                { isLoading ? <LoadingIndicator /> : <div className={"AssetList"}>
                    {
                        assets && assets['success'] ? assets['data'].map((asset, index) =>
                            <AssetPreview
                                {...props}
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
        </div>
    );
};

export default AssetList;
