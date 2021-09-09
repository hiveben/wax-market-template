import React, {useEffect, useState} from 'react';

import config from "../../config.json";

import moment from 'moment';
import Link from 'next/link';
import PreviewImage from "./PreviewImage";
import cn from "classnames";

import {parseAssetsToMint} from "../helpers/Helpers";
import DropButtons from "../dropbuttons/DropButtons";

function DropPreview(props) {
    const drop = props['drop'];
    const [assets, setAssets] = useState([]);

    const index = props['index'];
    const templateData = props['templateData'];

    const { collectionName, collectionImage } = drop;

    useEffect(() => {
        parseAssetsToMint(drop.assetsToMint, templateData).then(res => setAssets(res));
    }, [drop]);

    return (
        <div 
            className={cn(
                'relative w-asset mx-auto rounded-md overflow-hidden',
                'flex flex-col',
                'text-base break-words',
                'backdrop-filter backdrop-blur-sm border border-paper',
                'shadow-md bg-paper rounded-br-2xl'
            )}
            id={'AssetPreview_'+index}
        >
            <div className={cn(
                'flex justify-between my-2 px-2',
            )}>                
                <Link href={'/collection/' + collectionName}>
                    <div className={cn(
                        'relative flex items-center leading-4',
                        'text-white leading-relaxed text-sm',
                        'cursor-pointer'
                    )}>
                        { collectionImage ? <div className="h-4 rounded-lg overflow-hidden">
                            <img src={config.ipfs + collectionImage} className="collection-img" alt="none"/>
                        </div> : '' }
                        <div className="font-light ml-2 mr-auto opacity-60 truncate">{collectionName}</div>
                    </div>
                </Link>
                {assets && assets.map(asset =>
                    <div className="flex flex-1 h-full">
                        <PreviewImage {...props} asset={asset} />
                    </div>
                )}
            </div>

            <Link href={`/drop/${drop.dropId}`}>
                <div className="relative">
                    <p className={cn(
                        'w-full pt-4 px-2 mb-5',
                        'text-center text-base font-light text-neutral',
                        'overflow-visible',
                    )}>
                        {drop.name ? drop.name : drop.dropId}
                    </p>
                </div>
            </Link>
            <DropButtons
                drop={drop}
                preview={true}
            />
        </div>
    );
}

export default DropPreview;
