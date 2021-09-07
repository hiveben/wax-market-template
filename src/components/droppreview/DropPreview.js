import React, {useEffect, useState} from 'react';

import config from "../../config.json";

import moment from 'moment';
import Link from 'next/link';
import PreviewImage from "./PreviewImage";
import cn from "classnames";

function DropPreview(props) {
    const [drop, setDrop] = useState(props['drop']);
    const [assets, setAssets] = useState([]);

    const index = props['index'];

    const { collectionName, collectionImage } = drop;

    useEffect(() => {
        drop.assetsToMint.then(res => setAssets(res));
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
        </div>
    );
}

export default DropPreview;
