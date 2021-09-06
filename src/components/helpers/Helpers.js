import React from "react";

import Link from 'next/link';
import cn from "classnames";
import qs from 'qs';
import config from "../../config.json";

export const setQueryStringWithoutPageReload = qsValue => {
    const newurl = window.location.protocol + '//' +
        window.location.host +
        window.location.pathname + '?' +
        qsValue;
    const newPath =
        window.location.pathname + '?' +
        qsValue;

    const oldState = window.history.state;
    oldState.path = newPath;
    oldState.url = newurl;

    window.history.replaceState(oldState, '', newPath);
};

export const getValues = () => {
    let values = [];
    if (process.browser)
        values = qs.parse(window.location.search.substr(1, window.location.search.length - 1));

    return values;
}

export const getFilters = (values, collections, page= 1) => {
    const collection = values['collection'] ? values['collection'] : '*';
    const schema = values['schema'] ? values['schema'] : '';
    const name = values['name'] ? values['name'] : '';
    const rarity = values['rarity'] ? values['rarity'] : '';
    const variant = values['variant'] ? values['variant'] : '';
    const sortBy = values['sort'] ? values['sort'] : '';
    const seller = values['seller'] ? values['seller'] : '';

    return {
        'collections': collections.filter(
            item => (!collection || collection === '*') ? true : item === collection
        ),
        'schema': schema,
        'page': page,
        'limit': config.limit,
        'orderDir': getOrderDir(sortBy),
        'sortBy': getSortBy(sortBy),
        'seller': seller,
        'name': name,
        'rarity': rarity,
        'variant': variant
    }
}

export const createCollectionOption = (name) => {
    if (!name) return name;

    return (
        <div className={name.length > 15 ? "text-sm" : "text-sm flex justify-between font-bold w-36"}>
            {name}
        </div>
    );
};

export const createCollectionImageOption = (name, image) => {
    return (
        <div className="text-sm flex justify-between font-bold w-36">
            <div className="w-8 h-8 m-auto">
                <img src={image} className="max-w-img-small max-h-img-small" />
            </div>
            <div>{name}</div>
        </div>
    );
};

export const createAttributes = (categories, key, labelName) => {
    const categoriesOptions = [];
    const addedBorder = [];

    if (!categories || !categories.length)
        return null;

    categoriesOptions.push({ value: '', label: labelName });

    categories.forEach(
        element => {
            if (element[key] === 0 || element[key]) {
                if (!addedBorder.includes(element[key])) {
                    categoriesOptions.push(
                        {value: ''+element[key], label: ''+element[key]});
                    addedBorder.push(element[key])
                }
            }
        }
    );

    return categoriesOptions.sort((a, b) => parseInt(a.value) - parseInt(b.value));
};

export const formatMintInfo = (mint) => {
    if (!mint) {
        return false
    }

    return (
        <div className={cn(
            "bg-secondary",
            "px-2 py-0 leading-loose",
            "text-xs font-light text-neutral",
            "rounded-md z-20",
        )}>
            # {mint}
        </div>
    )
};

export const formatNumber = (value) => {
    const number = parseInt(value);
    if (Math.abs(number) >= 1000000000)
        return `${parseInt(`${Math.round(number/10000000.0)}`)/10.0}B`;
    else if (Math.abs(number) >= 1000000)
        return `${parseInt(`${Math.round(number/100000.0)}`)/10.0}M`;
    else if (Math.abs(number) >= 10000)
        return `${parseInt(`${Math.round(number/100.0)}`)/10.0}K`;
    else return Math.round(value * 100) / 100;
};

export const formatPrice = (listing) => {
    const {price, listing_symbol, auction_id} = listing;
    let {listing_price} = listing;
    if (listing_price && price)
        if (listing_symbol === 'USD')
            listing_price = listing_price * (100 / price['median']);
        else
            listing_price = listing_price / (Math.pow(10, price['token_precision']));
    else if (auction_id && price)
        listing_price = price['amount'] / (Math.pow(10, price['token_precision']));
    return `${formatNumber(listing_price)} WAX`;
}

export const getOrderDir = (sort) => {
    return sort.split('_')[1];
}

export const getSortBy = (sort) => {
    const order = sort.split('_')[0];
    return order === 'mint' ? 'template_mint' : order ;
}

export const formatNumberS = (value) => {
    return Math.round(value * 10000) / 10000.0;
};

export const formatNumber1K = (value) => {
    const number = parseInt(value);
    if (Math.abs(number) >= 1000000000)
        return `${parseInt(`${Math.round(number/10000000.0)}`)/10.0}B`;
    else if (Math.abs(number) >= 1000000)
        return `${parseInt(`${Math.round(number/100000.0)}`)/10.0}M`;
    else if (Math.abs(number) >= 1000)
        return `${parseInt(`${Math.round(number/100.0)}`)/10.0}K`;
    else return Math.round(value);
};

export const formatPercentage = (value) => {
    const number = Math.round(parseFloat(value) * 10000) / 100;
    return `${formatNumber1K(number)}%`;
};

export const getCollectionLink = (author) => {
    return (<Link href={`/collection/${author}`}>
        <div className='cursor-pointer'>{author}</div>
    </Link>);
};

export const formatGrowth = (value, usd=0, includeWAX=false) => {
    const number = parseInt(value);
    if (number > 0)
        return (
            <div className="flex justify-evenly">
                <div className="m-auto w-1/5"><svg className="fill-current text-blue-700" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 7v6H7V7H4l4-4 4 4z" fill-rule="evenodd"></path>
                </svg></div>
                <div className="m-auto w-4/5">{includeWAX ? `${formatNumber(value)} WAX` : formatNumber(value)}{usd?<span className="usd-s">/${formatNumber(usd)}</span>:''}</div>
            </div>
        );
    if (number < 1000000)
        return (
            <div className="flex justify-evenly">
                <div className="m-auto w-1/5"><svg className="fill-current text-white" width="16" height="16" viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 9h3l-4 4-4-4h3V3h2z" fill-rule="evenodd"></path>
                </svg></div>
                <div className="m-auto w-4/5">{includeWAX ? `${formatNumber(value)} WAX` : formatNumber(value)}{usd?<span className="usd-s">/${formatNumber(usd)}</span>:''}</div>
            </div>
        );
    else
        return '-';
};
