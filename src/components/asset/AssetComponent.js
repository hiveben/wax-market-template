import React from 'react';

import Head from "next";
import AssetDetails from "../asset/AssetDetails";

import AssetImage from "../asset/AssetImage";

import config from "../../config.json";

const AssetComponent = (props) => {
    const asset = props.asset;

    const data = asset.data;

    const image = data.img ? config.ipfs + data.img : '';

    const title = `Check out ${asset.name}`;

    let description = `by ${asset.collection.name}${asset.template_mint ? ' - Mint #' + asset.template_mint : ''}`

    return (
        <div className={"Page"} id="AssetPage">
            <Head>
                <meta id="og-title" property="og:title" content={title} />
                <meta id="og-description" property="og:description" content={description} />
                <meta id="og-image" property="og:image" content={image} />
                <style type="text/css">
                    {
                        'body {' +
                        'background-color: #1A1A1A;' +
                        'color: #1235ba;' +
                        '}'
                    }
                </style>
                <meta name="msapplication-TileColor" content="#1235ba" />
                <meta name="theme-color" content="#1A1A1A"  />
                <meta id="twitter-title" property="twitter:title" content={title} />
                <meta id="twitter-description" property="twitter:description" content={description} />
                <meta id="twitter-image" property="twitter:image" content={image} />
                {image && image.includes('.gif') ? <meta content="image/gif" property="og:image:type" /> : '' }
                <link id='page-image' rel="apple-touch-icon" href={image} />
                <title>{title}</title>
            </Head>
            <div className="SaleAssets">
                <div className="AssetInfo">
                    <AssetImage
                        asset={asset}
                    />
                    <AssetDetails
                        asset={asset}
                    />
                </div>
            </div>
            <div className="AssetLinks">
                <div className="ViewLink">
                    <a href={`https://wax.atomichub.io/explorer/asset/${asset.asset_id}`}>View on Atomichub</a>
                </div>
            </div>
        </div>
    );
};

export default AssetComponent;
