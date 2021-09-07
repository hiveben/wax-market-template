import axios from "axios";

import config from "../../config.json";

export const atomic_api = config.atomic_api;

export const api_endpoint = config.api_endpoint;

export const get = (path) =>
    fetch(`${api_endpoint}/api/${path}`).then(
        res => res.json());

export const getCollections = (collections) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/stats/collections?symbol=WAX&page=1&limit=100&collection_whitelist=${
            collections.join(',')}`
    ).then(
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
        atomic_api + `/atomicmarket/v1/sales?state=1${getFilterParams(filters)}`).then(
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

const post = (url, data) =>
    axios({
        method: 'post',
        url: url,
        data: data
    }).then(res => res);

export const loadCollections = async () => {
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

    const url = config.api_endpoint + '/v1/chain/get_table_rows';

    return post(url, body);
}

export const getDrops = async (filters) => {
    const collection = filters.collections && filters.collections.length === 1 ? filters.collections[0] : null;

    if (!collection)
        return [];

    const body = {
        'code': config.drops_contract,
        'index_position': 2,
        'json': 'true',
        'key_type': 'sha256',
        'limit': config.limit,
        'lower_bound': '0000000000000000d4d1accd4bcb958000000000000000000000000000000000',
        'upper_bound': '0000000000000000d4d1accd4bcb9580ffffffffffffffffffffffffffffffff',
        'reverse': 'true',
        'scope': config.drops_contract,
        'show_payer': 'false',
        'table': 'drops',
        'table_key': ''
    };

    const url = config.api_endpoint + '/v1/chain/get_table_rows';
    const res = await post(url, body);

    const drops = [];

    if (res && res.status === 200 && res.data && res.data.rows) {
        res.data.rows.map(drop => {
            drops.push(drop);
        });


    }
    return drops;
};

export const getRefundBalance = async (name) => {
    const body = {
        'code': 'atomicmarket',
        'index_position': 'primary',
        'json': 'true',
        'key_type': 'i64',
        'limit': 1,
        'lower_bound': name,
        'upper_bound': name,
        'reverse': 'false',
        'scope': 'atomicmarket',
        'show_payer': 'false',
        'table': 'balances',
        'table_key': ''
    };

    const url = config.api_endpoint + '/v1/chain/get_table_rows';
    return post(url, body);
};

export const getWaxBalance = async (name) => {
    const body = {
        'code': 'eosio.token',
        'index_position': 'primary',
        'json': 'true',
        'key_type': 'i64',
        'limit': 1,
        'reverse': 'false',
        'scope': name,
        'show_payer': 'false',
        'table': 'accounts',
        'table_key': ''
    };

    const url = config.api_endpoint + '/v1/chain/get_table_rows';

    return post(url, body);
};
