import React, {useState} from 'react';


import CollectionDetails from "./CollectionDetails";

import Link from 'next/link';
import Header from "../common/util/Header"
import Page from "../common/layout/Page"

import config from '../../config.json';
import StaticAssetList from "../staticassetlist/StaticAssetList";

const CollectionComponent = (props) => {
    const collection = props.collection;

    const [showImage, setShowImage] = useState(false);

    const {name, collection_name, img, description} = collection;

    const image = config.ipfs + img;

    const title = `Check out ${name}`;

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

        if (element.id === 'CollectionPage') {
            setShowScrollUpIcon(element.scrollTop > element.clientHeight);
        }
    };

    return (
        <Page onScroll={e => handleScroll(e)} id="CollectionPage">
            <Header
                ogTitle={title}
                ogDescription={description}
                ogImage={image}
                pageImage={image}
                twitterTitle={title}
                twitterDescription={description}
                twitterImage={image}
            />
            {showImage ? <div className="FullImageView" onClick={toggleImage}>
                <img src={image} />
            </div> : ''}
            <div className="CollectionTop">
                <div className="CollectionImage">
                    <img src={image} alt="none" onClick={toggleImage} />
                </div>
                <CollectionDetails collection={collection} />
            </div>
            <Link href={`/explorer?tab=assets&collection=${collection_name}&order_by=asset_id&order_dir=DESC`}>
                <div className="AssetListHeader NextLink">Newest Assets<img src={"/frontpage/SVG/lupe.svg"} /></div>
            </Link>
            <StaticAssetList type={'assets'} collection={collection_name} />
            <Link href={`/market?tab=sales&collection=${collection_name}&order_by=date&order_dir=DESC`}>
                <div className="AssetListHeader">Latest Listings<img src={"/frontpage/SVG/lupe.svg"} /></div>
            </Link>
            <StaticAssetList type={'listings'} collection={collection_name} />
            <Link href={`/market?tab=trades&collection=${collection_name}&order_by=offer&order_dir=DESC`}>
                <div className="AssetListHeader">Top Sales<img src={"/frontpage/SVG/lupe.svg"} /></div>
            </Link>
            <StaticAssetList type={'sales'} collection={collection_name} />
            {showScrollUpIcon ? <div className="ScrollUpIcon" onClick={scrollUp}><img src = "/up-arrow.svg" /></div> : '' }
        </Page>
    );
};

export default CollectionComponent;
