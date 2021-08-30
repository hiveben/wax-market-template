import React from 'react';

import AssetDetails from "../asset/AssetDetails";

import AssetImage from "../asset/AssetImage";
import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import config from "../../config.json";
import {formatPrice} from "../helpers/Helpers";

const SaleComponent = (props) => {
    const sale = props.sale;

    const frontAsset = sale.assets[0];

    let description = `by ${frontAsset.collection.name}${
        frontAsset.template_mint ? ' - Mint #' + frontAsset.template_mint : ''} - Buy for ${formatPrice(sale)}`;

    const data = frontAsset.data;

    const image = data.img ? config.ipfs + data.img : '';

    const title = `Check out ${frontAsset.name}`;

    return (
        <Page id="AssetPage">
            <Header
                title={title} 
                ogTitle={title}
                ogDescription={description}
                ogImage={image}
                twitterImage={image}
                pageImage={image}
                twitterTitle={title}
                TwitterDescription={description}
            />
            {
                sale.assets.map(asset =>
                    <div className="SaleAssets w-full h-auto lg:flex">
                        <AssetImage
                            asset={asset}
                        />
                        <AssetDetails
                            asset={asset}
                        />
                    </div>
                )
            }
            <div className="relative t-4 h-40 text-center">
                <div className="m-auto h-1/4 leading-10">
                    <a className="text-blue-700" href={`https://wax.atomichub.io/market/sale/${sale.sale_id}`}>View on Atomichub</a>
                </div>
            </div>
        </Page>
    );
};

export default SaleComponent;
