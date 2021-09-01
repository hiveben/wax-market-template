import React, {useEffect, useState} from 'react';
import cn from "classnames";

import LazyLoad from "react-lazy-load";

import Link from "../common/util/input/Link";
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
            <div className={cn(
                'relative w-64 h-96 p-1.5',
                'mt-4 mx-4 mb-12',
                'bg-no-repeat bg-collection-card',
                'text-base text-center break-words',
            )}>
                <Link href={'/collection/' + collection_name}>
                    <div
                        className={cn(
                            'relative flex w-40 h-4 m-2',
                            'text-xs text-white',
                            'cursor-pointer'
                        )}
                    >
                        { img ? <div className="h-4 rounded-lg overflow-hidden">
                            <img className="collection-img" src={config.ipfs + img} alt={collection_name} />
                        </div> : '' }
                        <div
                            className={cn(
                                "relative colletion-title-position h-5 my-0 mx-2",
                                "lg:h-8 text-center font-bold"
                                )}
                        >{name}</div>
                    </div>
                </Link>
                <div className={"h-60 cursor-pointer"}>
                    <Link href={`/collection/${collection_name}`}>
                        <div className="flex justify-center w-48 h-48 m-auto">
                            <div>
                                <img className="preview-img m-auto" src = {`https://ipfs.hivebp.io/ipfs/${img}`} />
                            </div>
                        </div>
                    </Link>
                    <Link href={`/collection/${collection_name}`}>
                        <div className={name && name.length >= 20 ? "flex justify-evenly font-normal h-8 w-40 text-xs pt-0 mt-4 mx-auto mb-auto overflow-visible text-white cursor-pointer" : "AssetPreviewTitle NextLink"}>
                            <div>{name}</div>
                        </div>
                    </Link>
                </div>
            </div>
        </LazyLoad>
    );
}

export default CollectionPreview;
