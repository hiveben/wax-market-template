import React, {useState} from 'react';

import Head from "next";

import CollectionDetails from "./CollectionDetails";

import Link from 'next/link';

import config from '../../config.json';
import StaticAssetList from "../staticassetlist/StaticAssetList";

const CollectionComponent = (props) => {
    const collection = props.collection;

    const [showImage, setShowImage] = useState(false);

    const {name, collection_name, img, description} = collection;

    const image = config.ipfs + img;

    const [showScrollUpIcon, setShowScrollUpIcon] = useState(false);

    const toggleImage = () => {
        setShowImage(!showImage);
    };

    const scrollUp = () => {
        if (process.browser) {
            const element = document.getElementById("CollectionPage");
            element.scrollTo({left: 0, top: 0, behavior: "smooth"});
        }
    };

    const handleScroll = e => {
        let element = e.target;

        if (element.className === 'Page') {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight);
        }
    };

    return (
        <div className={"Page"} id={"CollectionPage"} onScroll={e => handleScroll(e)}>
            <Head>
                <meta id="og-title" property="og:title" content={`Check out ${name}`} />
                <meta id="og-description" property="og:description" content={description} />
                <meta id="og-image" property="og:image" content={image} />
                <meta name="msapplication-TileColor" content="#1235ba" />
                <style type="text/css">
                    {
                        'body {' +
                            'background-color: #1A1A1A;' +
                            'color: #1235ba;' +
                        '}'
                    }
                </style>
                <meta name="theme-color" content="#1A1A1A" />
                <meta id="twitter-title" property="twitter:title" content={`Check out ${name}`} />
                <meta id="twitter-description" property="twitter:description" content={description} />
                <meta id="twitter-image" property="twitter:image" content={image} />
                {image && image.includes('.gif') ? <meta content="image/gif" property="og:image:type" /> : '' }
                <link id='page-image' rel="apple-touch-icon" href={image} />
            </Head>
            {showImage ? <div className="FullImageView" onClick={toggleImage}>
                <img src={image} />
            </div> : ''}
            <div className="CollectionTop">
                <div className="CollectionImage">
                    <img src={image} alt="none" onClick={toggleImage} />
                </div>
                <CollectionDetails collection={collection} />
            </div>
            <Link href={`/explorer?tab=assets&collection=${collection_name}&order_by=asset_id&order_dir=DESC`}><div className="AssetListHeader NextLink">Newest Assets<img src={"/frontpage/SVG/lupe.svg"} /></div></Link>
            <StaticAssetList type={'assets'} collection={collection_name} />
            <Link href={`/market?tab=sales&collection=${collection_name}&order_by=date&order_dir=DESC`}><div className="AssetListHeader">Latest Listings<img src={"/frontpage/SVG/lupe.svg"} /></div></Link>
            <StaticAssetList type={'listings'} collection={collection_name} />
            <Link href={`/market?tab=trades&collection=${collection_name}&order_by=offer&order_dir=DESC`}><div className="AssetListHeader">Top Sales<img src={"/frontpage/SVG/lupe.svg"} /></div></Link>
            <StaticAssetList type={'sales'} collection={collection_name} />
            {showScrollUpIcon ? <div className="ScrollUpIcon" onClick={scrollUp}><img src = "/up-arrow.svg" /></div> : '' }
        </div>
    );
};

export default CollectionComponent;
