import axios from "axios";

import config from "../../config.json";

export const atomic_api = config.atomic_api;

export const api_endpoint = config.api_endpoint;

export const get = (path, params = {}, headers = { 'Content-Type': 'application/json' }) =>
    fetch(`${api_endpoint}/api/${path}`).then(
        res => res.json());

export const get_ext = (url) =>
    fetch(url).then(res => res.json());

const parseCollections = (res) => {
    if (res) {
        const data = res['data'];
        return data['rows'][0].collections;
    }

    return [];
};

export const initCollections = async () => {
    const body = {
        'code': 'marketmapper',
        'index_position': 'primary',
        'json': 'true',
        'key_type': 'i64',
        'limit': 1,
        'reverse': 'false',
        'scope': 'marketmapper',
        'show_payer': 'false',
        'table': 'mappings',
        'lower_bound': config.market_name,
        'upper_bound': config.market_name,
        'table_key': ''
    };

    const url = api_endpoint + '/v1/chain/get_table_rows';

    return await post(url, body).then(res => parseCollections(res));
};

export const getCollections = (collections) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/stats/collections?symbol=WAX&page=1&limit=100&collection_whitelist=${
            collections.join(',')}`).then(
        res => res.json());
};

export const GetPrices = (asset_id) => {
    return fetch(atomic_api + `/atomicmarket/v1/prices/assets?ids=${asset_id}`).then(
        res => res.json());
}

const getFilterParams = (filters) => {
    let filterStr = '';

    const {collections, page, user, schema, name, limit, orderDir, sortBy, asset_id, rarity, seller} = filters;

    if (collections)
        filterStr += `&collection_whitelist=${collections.join(',')}`;

    if (page)
        filterStr += `&page=${page}`;

    if (schema)
        filterStr += `&schema_name=${schema}`;

    if (user)
        filterStr += `&owner=${user}`;

    if (seller)
        filterStr += `&seller=${seller}`;

    if (name)
        filterStr += `&match=${escape(name)}`;

    if (rarity)
        filterStr += `&template_data.rarity=${rarity}`;

    if (limit)
        filterStr += `&limit=${limit}`;

    if (orderDir)
        filterStr += `&order=${orderDir}`;

    if (sortBy)
        filterStr += `&sort=${sortBy}`;

    if (asset_id)
        filterStr += `&asset_id=${asset_id}`;

    return filterStr;
};

export const getSchemas = (filters) => {
    return fetch(
        atomic_api + `/atomicassets/v1/schemas?${getFilterParams(filters)}`).then(
        res => res.json());
};

export const getTemplates = (filters) => {
    return fetch(
        atomic_api + `/atomicassets/v1/templates?has_assets=true${getFilterParams(filters)}`
    ).then(res => res.json());
};

export const getListings = (filters) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales?state=1&min_assets=2${getFilterParams(filters)}`).then(
        res => res.json());
};

export const getAuctions = (filters) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/auctions?state=1&${getFilterParams(filters)}`).then(
        res => res.json());
};

export const getSales = (filters) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales?state=3${getFilterParams(filters)}`).then(
        res => res.json());
};

export const getListingsById = (asset_id) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales?&limit=1&asset_id=${asset_id}`).then(
        res => res.json());
};

export const getAuctionsById = (asset_id) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/auctions?&limit=1&asset_id=${asset_id}`).then(
        res => res.json());
};

export const getAssets = (filters) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/assets?${getFilterParams(filters)}`).then(res => res.json());
};

export const getAsset = (assetId) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/assets/${assetId}`).then(res => res.json());
};

export const getCollection = (collection_name) => {
    return fetch(
        atomic_api + `/atomicassets/v1/collections/${collection_name}`).then(res => res.json());
};

export const getSale = (saleId) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales/${saleId}`).then(res => res.json());
};

export const getAuction = (auctionId) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/auctions/${auctionId}`).then(res => res.json());
};

export const post = (url, data) =>
    axios({
        method: 'post',
        url: url,
        data: data
    }).then(res => res);

export default get;
