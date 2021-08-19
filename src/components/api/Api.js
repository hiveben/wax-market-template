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
}

export const getCollections = (collections) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/stats/collections?symbol=WAX&page=1&limit=100&collection_whitelist=${
            collections.join(',')}`).then(
        res => res.json());
};

export const getListings = (collections, page, limit) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales?page=${page}&limit=${
            limit}&order=desc&sort=created&collection_whitelist=${collections.join(',')}&max_assets=1`).then(
        res => res.json());
};

export const getSales = (collections, page, limit) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales?state=3&page=${page}&limit=${
            limit}&order=desc&sort=price&collection_whitelist=${collections.join(',')}&max_assets=1`).then(
        res => res.json());
};

export const getListingsById = (asset_id) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/sales?&limit=1&order=desc&sort=created&asset_id=${asset_id}`).then(
        res => res.json());
};

export const getAssets = (collections, page, limit) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/assets?limit=${
            limit}&page=${page}&order=desc&sort=transferred&collection_whitelist=${
            collections.join(',')}`).then(res => res.json());
};

export const getInventory = (collections, user, page, limit) => {
    return fetch(
        atomic_api + `/atomicmarket/v1/assets?limit=${
            limit}&page=${page}&order=desc&owner=${user}&sort=transferred&collection_whitelist=${
            collections.join(',')}`).then(res => res.json());
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

export const post = (url, data) =>
    axios({
        method: 'post',
        url: url,
        data: data
    }).then(res => res);

export default get;
