import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../marketwrapper";

import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import MarketContent from "../common/layout/Content"

import config from "../../config.json";

import {getInventory} from "../api/Api";
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

    const collection = state.collection ? state.collection : values['collection'] ? values['collection'] : '*';

    const initialized = state.collections !== null;

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);

    const getAssets = (result) => {
        setAssets(result);
        setIsLoading(false);
    }

    const initInventory = async (page, collection) => {
        setIsLoading(true);
        getInventory(state.collections.filter(
            item => (!collection || collection === '*') ? true : item === collection
        ), user, page, config.limit).then(result => getAssets(result));
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
                ogTitle={config.market_title}
                ogDescription={config.market_description}
                ogImage={config.market_image}
                pageImage={config.market_image}
                twitterTitle={config.market_title}
                twitterDescription={config.market_description}
                twitterImage={config.market_image}
            />
            <MarketContent>
                <Filters />
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
