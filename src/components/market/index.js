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
import {getValues, getSortBy, getOrderDir} from "../helpers/Helpers";
import ScrollUpIcon from '../common/util/ScrollUpIcon';
import cn from "classnames"

const Market = (props) => {
    const [ state, dispatch ] = useContext(Context);

    const [listings, setListings] = useState([]);
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

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);

    const getResult = (result) => {
        setListings(result);
        setIsLoading(false);
    }

    const initListings = async (page, collection) => {
        setIsLoading(true);
        getListings({
            'collections': state.collections.filter(
                item => (!collection || collection === '*') ? true : item === collection
            ),
            'schema': schema,
            'page': page,
            'limit': config.limit,
            'orderDir': getOrderDir(sortBy),
            'sortBy': getSortBy(sortBy),
            'name': name,
            'rarity': rarity,
            'variant': variant
        }).then(result => getResult(result));
    };

    useEffect(() => {
        if (initialized)
            initListings(page, collection)
    }, [page, collection, initialized, schema]);

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
                title={config.market_title}
                description={config.market_description}
                image={config.market_image}
            />
            <MarketContent>
                <div 
                    className={cn(
                        'w-full md:w-1/4 md:ml-4',
                        'p-5'
                    )}    
                >
                        
                    <Filters
                        {...props}
                        searchPage={'market'}
                    />
                </div>
                <div
                    className={cn(
                        'w-full md:w-3/4',
                    )}
                >
                    <Pagination
                        items={listings && listings.data}
                        page={page}
                        setPage={setPage}
                    />
                    { isLoading ? <LoadingIndicator /> : 
                        <div className={cn(
                            "relative w-full mb-24",
                            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4"
                        )}>
                            {listings && listings['success'] ? listings['data'].map((listing, index) =>
                                <AssetPreview
                                    {...props}
                                    key={index}
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
            {showScrollUpIcon ? <ScrollUpIcon onClick={scrollUp} /> : '' }
        </Page>
    );
};

export default Market;
