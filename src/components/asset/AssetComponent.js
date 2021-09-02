import React from 'react';

import AssetDetails from "../asset/AssetDetails";

import AssetImage from "../asset/AssetImage";
import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import cn from 'classnames';

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
                image={image}
                description={description}
            />
            <div className={cn('container mx-auto pt-10')}>
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
                <div className="mt-20 mb-20 leading-10 text-center">
                    <div className="relative h-1/2 t-0 m-auto">
                        <a className="text-primary" href={`https://wax.atomichub.io/explorer/asset/${asset.asset_id}`}>View on Atomichub</a>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default AssetComponent;
