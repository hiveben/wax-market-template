import React, {useState} from 'react';


import CollectionDetails from "./CollectionDetails";

import Link from 'next/link';
import Header from "../common/util/Header"
import Page from "../common/layout/Page"

import config from '../../config.json';
import StaticAssetList from "../staticassetlist/StaticAssetList";
import ScrollUpIcon from '../common/util/ScrollUpIcon';

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

    const AssetListHeader = ({header}) => {
        return (
            <div className="flex mt-24 mb-5 ml-24 text-4xl text-left text-white">
                {header}
                <img className="h-8 mt-2 ml-2" src={"/frontpage/SVG/lupe.svg"} />
            </div>
        );
    }

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
            {showImage ? <div className="fixed h-full w-full m-auto top-0 left-0 z-100 shadow-lg backdrop-filter backdrop-blur-lg" onClick={toggleImage}>
                <img className="max-w-full max-h-full m-auto" src={image} />
            </div> : ''}
            <div className="lg:flex">
                <div className="relative flex justify-center w-full text-center mx-0.5 my-2.5 lg:my-auto lg:mx-1 lg:w-2/5">
                    <img className="w-full max-w-full max-h-img-collection m-auto" src={image} alt="none" onClick={toggleImage} />
                </div>
                <CollectionDetails collection={collection} />
            </div>
            <Link href={`/explorer?tab=assets&collection=${collection_name}&order_by=asset_id&order_dir=DESC`}>
                <AssetListHeader header="Newest Assets" />
            </Link>
            <StaticAssetList type={'assets'} collection={collection_name} />
            <Link href={`/market?tab=sales&collection=${collection_name}&order_by=date&order_dir=DESC`}>
                <AssetListHeader header="Latest Listings" />
            </Link>
            <StaticAssetList type={'listings'} collection={collection_name} />
            <Link href={`/market?tab=trades&collection=${collection_name}&order_by=offer&order_dir=DESC`}>
                <AssetListHeader header="Top Sales" />
            </Link>
            <StaticAssetList type={'sales'} collection={collection_name} />
            {showScrollUpIcon ? <ScrollUpIcon onClick={scrollUp} /> : '' }
        </Page>
    );
};

export default CollectionComponent;
