import React from 'react';

import AssetDetails from "../asset/AssetDetails";

import AssetImage from "../asset/AssetImage";
import Header from "../common/util/Header"
import Page from "../common/layout/Page"

import config from "../../config.json";

const AssetComponent = (props) => {
    const asset = props.asset;

    const data = asset.data;

    const image = data.img ? config.ipfs + data.img : '';

    const title = `Check out ${asset.name}`;

    let description = `by ${asset.collection.name}${asset.template_mint ? ' - Mint #' + asset.template_mint : ''}`

    return (
        <Page id="AssetPage">
            <Header
                title={title}
                description={description}
                image={image}
            />
            <div className="SaleAssets h-auto w-full lg:flex">
                <AssetImage
                    asset={asset}
                />
                <AssetDetails
                    asset={asset}
                />
            </div>
            <div className="h-1/4 m-auto leading-10 text-center">
                <div className="relative h-1/2 t-0 m-auto">
                    <a className="text-blue-700" href={`https://wax.atomichub.io/explorer/asset/${asset.asset_id}`}>View on Atomichub</a>
                </div>
            </div>
        </Page>
    );
};

export default AssetComponent;
