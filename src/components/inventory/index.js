import React, {useContext, useEffect, useState} from 'react';

import {Context} from "../marketwrapper";

import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import InventoryContent from "../common/layout/Content"

import config from "../../config.json";

import {getAssets} from "../api/Api";
import AssetPreview from "../assetpreview/AssetPreview";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import Pagination from "../pagination/Pagination";
import Filters from "../filters/Filters";
import ScrollUpIcon from '../common/util/ScrollUpIcon';
import {getValues, getFilters} from "../helpers/Helpers";
import cn from "classnames";

const Inventory = (props) => {
    const [ state, dispatch ] = useContext(Context);

    const [assets, setAssets] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const user = props['user'];

    const values = getValues();
    values['user'] = props['user'];

    const initialized = state.collections !== null && state.collections !== undefined;

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);

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
            <InventoryContent>
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
                                            page={'inventory'}
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
            </InventoryContent>
            {showScrollUpIcon ? <ScrollUpIcon onClick={scrollUp} /> : '' }
        </Page>
    );
};

export default Inventory;
