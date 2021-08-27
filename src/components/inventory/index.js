import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../marketwrapper";

import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import MarketContent from "../common/layout/Content"

import config from "../../config.json";

import {getAssets} from "../api/Api";
import AssetPreview from "../assetpreview";
import LoadingIndicator from "../loadingindicator";
import Pagination from "../pagination/Pagination";
import Filters from "../filters/Filters";
import {getValues} from "../helpers/Helpers";

const Inventory = (props) => {
    const [ state, dispatch ] = useContext(Context);

    const [assets, setAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const user = props['user'];

    const values = getValues();

    const collection = values['collection'] ? values['collection'] : '*';
    const schema = values['schema'] ? values['schema'] : '';
    const name = values['name'] ? values['name'] : '';
    const rarity = values['rarity'] ? values['rarity'] : '';
    const variant = values['variant'] ? values['variant'] : '';

    const initialized = state.collections !== null && state.collections !== undefined;

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);

    const getAssetsResult = (result) => {
        setAssets(result);
        setIsLoading(false);
    }

    const initInventory = async (page, collection) => {
        setIsLoading(true);
        getAssets({
            'collections': state.collections.filter(
                item => (!collection || collection === '*') ? true : item === collection
            ),
            'schema': schema,
            'user': user,
            'page': page,
            'limit': config.limit,
            'name': name,
            'rarity': rarity,
            'variant': variant
        }).then(result => getAssetsResult(result));
    };

    useEffect(() => {
        if (initialized)
            initInventory(page, collection)
    }, [page, collection, initialized]);

    const handleScroll = e => {
        let element = e.target;

        if (element.id === 'MarketPage') {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight);
            if (element.scrollHeight - element.scrollTop === element.clientHeight) {
                dispatch({ type: 'SET_SCROLLED_DOWN', payload: true });
            }
        }
    };

    const scrollUp = () => {
        if (process.browser) {
            const element = document.getElementById("MarketPage");
            element.scrollTo({left: 0, top: 0, behavior: "smooth"});
        }
    };

    const title = `${user}'s Inventory`;

    const description = `Check out ${user}'s Inventory on ${config.market_title}`;

    return (
        <Page onScroll={e => handleScroll(e)} id="MarketPage">
            <Header
                title={title}
                description={description}
                image={config.market_image}
            />
            <MarketContent>
                <Filters
                    {...props}
                    searchPage={'inventory'}
                />
                <div className={"Results"}>
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
            </MarketContent>
            {showScrollUpIcon ? <div className="ScrollUpIcon" onClick={scrollUp}>
                <img src = "/up-arrow.svg" />
            </div> : '' }
        </Page>
    );
};

export default Inventory;
