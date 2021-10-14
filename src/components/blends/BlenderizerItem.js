import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";
import {Context} from "../marketwrapper";
import Link from "../common/util/input/Link";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import CollectionTitle from "../assetpreview/CollectionTitle";
import {getTemplate} from "../api/Api";
import PreviewImage from "../assetpreview/PreviewImage";
import BlendPreviewImage from "./BlendPreviewImage";

function BlenderizerItem(props) {
    const [ state, dispatch ] = useContext(Context);
    const [ isLoading, setIsLoading ] = useState(true);
    const [template, setTemplate] = useState(null);

    const blend = props['blend'];

    const {target, collection} = blend;

    console.log(blend);

    const parseTemplate = (res) => {
        if (res && res['success'])
            setTemplate(res['data']);

        setIsLoading(false);
    };

    useEffect(() => {
        getTemplate(target, collection).then(parseTemplate);
    }, [target]);

    return (
        <div className={cn(
            'w-full'
        )}>
            {isLoading ? <LoadingIndicator /> :
                <div className={cn(
                    'relative w-full mx-auto rounded-md overflow-hidden',
                    'flex flex-col',
                    'text-base break-words',
                    'backdrop-filter backdrop-blur-sm border border-paper',
                    'shadow-md bg-paper'
                )}>
                    <CollectionTitle collection={collection} />
                    <Link href={`/blenderizer/${collection}/${target}`}>
                        <div className={cn('w-full')}>
                            <BlendPreviewImage {...props} asset={template} />
                        </div>
                        <div className={cn(
                            'w-full flex justify-center items-center p-2 h-16',
                            'text-center text-base font-light text-neutral',
                        )}>
                            View Blend
                        </div>
                    </Link>
                </div>
            }
        </div>
    );
}

export default BlenderizerItem;