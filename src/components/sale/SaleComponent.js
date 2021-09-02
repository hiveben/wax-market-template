import React from 'react';

import AssetDetails from "../asset/AssetDetails";

import AssetImage from "../asset/AssetImage";
import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import config from "../../config.json";
import cn from 'classnames';
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
            <div className={cn('container mx-auto pt-10')}>
                {
                    sale.assets.map(asset =>
                        <div className="grid grid-cols-6 gap-10 h-auto w-full">
                            <div className="col-start-2 col-span-2">
                                <AssetImage
                                    asset={asset}
                                />
                            </div>
                            <div className="col-span-2">
                                <AssetDetails
                                    asset={asset}
                                />
                            </div>
                        </div>
                    )
                }
                <div className="relative mt-20 mb-20 text-center">
                    <div className="m-auto h-1/4 leading-10">
                        <a className="text-primary" href={`https://wax.atomichub.io/market/sale/${sale.sale_id}`}>View on Atomichub</a>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default SaleComponent;
