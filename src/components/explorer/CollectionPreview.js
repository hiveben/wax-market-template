import React, {useEffect, useState} from 'react';

import LazyLoad from "react-lazy-load";

import Link from 'next/link';
import {formatPercentage, formatNumber1K} from "../helpers/Helpers";
import config from "../../config.json";
import PreviewDetailsTable from "../assetpreview/PreviewDetailsTable";
import PreviewImage from "../assetpreview/PreviewImage";

function CollectionPreview(props) {
    const collectionItem = props['collection'];

    const {name, img, collection_name} = collectionItem;

    useEffect(() => {

    }, []);

    return (
        <LazyLoad>
            <div className={"CollectionPreview"}>
                <Link href={'/collection/' + collection_name}>
                    <div className={'AssetPreviewCollection NextLink'}>
                        { img ? <div className="CollectionIcon">
                            <img src={config.ipfs + img} alt={collection_name} />
                        </div> : '' }
                        <div className="CollectionTitle">{name}</div>
                    </div>
                </Link>
                <div className={"AssetArea NextLink Show"}>
                    <Link href={`/collection/${collection_name}`}>
                        <div className={"AssetPreviewImage"}>
                            <div className="PreviewImage">
                                <img src = {`https://ipfs.hivebp.io/ipfs/${img}`} />
                            </div>
                        </div>
                    </Link>
                    <Link href={`/collection/${collection_name}`}>
                        <div className={name && name.length >= 20 ? "AssetPreviewTitle Small NextLink" : "AssetPreviewTitle NextLink"}>
                            <div>{name}</div>
                        </div>
                    </Link>
                </div>
            </div>
        </LazyLoad>
    );
}

export default CollectionPreview;
