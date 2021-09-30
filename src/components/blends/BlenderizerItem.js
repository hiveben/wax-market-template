import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";
import {Context} from "../marketwrapper";
import Link from "../common/util/input/Link";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import CollectionTitle from "../assetpreview/CollectionTitle";
import {getTemplate} from "../api/Api";
import PreviewImage from "../assetpreview/PreviewImage";

function BlenderizerItem(props) {
    const [ state, dispatch ] = useContext(Context);
    const [ isLoading, setIsLoading ] = useState(true);
    const [template, setTemplate] = useState(null);

    const blend = props['blend'];

    const {target, collection, blend_id} = blend;

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
            {isLoading ? <LoadingIndicator /> : <div className={cn('')}>
                <CollectionTitle collection={template['collection']} />
                <div className="flex flex-1 h-full">
                    <PreviewImage {...props} asset={template} />
                </div>
                <Link href={`/blenderizer/${target}`}><div>View Blend</div></Link>
            </div> }
        </div>
    );
}

export default BlenderizerItem;