import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../marketwrapper";

import config from "../../config.json";

import AssetPreview from "../assetpreview/AssetPreview";
import {getListings} from "../api/Api";
import LoadingIndicator from "../loadingindicator";
import Pagination from "../pagination/Pagination";
import Filters from "../filters/Filters";
import MarketContent from "../common/layout/Content"
import Page from "../common/layout/Page"
import Header from "../common/util/Header"
import {getValues} from "../helpers/Helpers";
import cn from "classnames"

const Market = (props) => {
    const [ state, dispatch ] = useContext(Context);

    const [listings, setListings] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const values = getValues();

    const collection = state.collection ? state.collection : values['collection'] ? values['collection'] : '*';

    const initialized = state.collections !== null;

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);

    const getResult = (result) => {
        setListings(result);
        setIsLoading(false);
    }

    const initListings = async (page, collection) => {
        setIsLoading(true);

        getListings(
            state.collections.filter(
                item => (!collection || collection === '*') ? true : item === collection
            ), page, config.limit
        ).then(result => getResult(result));
    };

    useEffect(() => {
        if (initialized)
            initListings(page, collection, config.limit)
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
                <div className="c-w-40">
                    <Pagination
                        items={listings && listings.data}
                        page={page}
                        setPage={setPage}
                    />
                    { isLoading ? <LoadingIndicator /> : 
                        <div className={cn(
                            "block w-full pl-0 pr-0",
                            "lg:flex lg:flex-wrap lg:justify-center lg:text-center"
                        )}>
                        {listings && listings['success'] ? listings['data'].map((listing, index) =>
                            <AssetPreview
                                {...props}
                                index={index}
                                listing={listing}
                                asset={listing.assets[0]}
                            />
                            ) : ''
                        }
                        </div>
                    }
                    {isLoading ? '' :
                        <Pagination
                            items={listings && listings.data}
                            page={page}
                            setPage={setPage}
                        />
                    }
                </div>
            </MarketContent>
            {showScrollUpIcon ? 
            <div 
                className={cn(
                    "absolute right-14 bottom-10",
                    "lg:right-16 lg:bottom-16"
                )}
                onClick={scrollUp}
            >
                <img src = "/up-arrow.svg" className="w-10 h-10" />
            </div> : '' }
        </Page>
    );
};

export default Market;
