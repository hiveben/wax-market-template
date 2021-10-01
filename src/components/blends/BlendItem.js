import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";
import {Context} from "../marketwrapper";
import {getCollection} from "../api/Api";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import PreviewImage from "../assetpreview/PreviewImage";
import CollectionTitle from "../assetpreview/CollectionTitle";
import Link from "../common/util/input/Link";

function BlendItem(props) {
    const [ state, dispatch ] = useContext(Context);
    const [ isLoading, setIsLoading ] = useState(true);
    const [collection, setCollection] = useState(null);

    const blend = props['blend'];

    const {display_data, blend_id, collection_name} = blend;

    const displaydata = JSON.parse(display_data);

    const {name, image, description} = displaydata;

    const parseCollection = (res) => {
        if (res && res['success'])
            setCollection(res['data']);

        setIsLoading(false);
    };

    useEffect(() => {
        getCollection(collection_name).then(parseCollection);
    }, []);

    return (
        <div className={cn('w-full')}>
            {isLoading ? <LoadingIndicator /> : <div className={cn('')}>
                <CollectionTitle collection={collection} />
                <div className={cn('w-full')}>
                    <PreviewImage {...props} asset={{'data': {'img': image}}} />
                </div>
                <Link href={`/blend/${blend_id}`}><div>View Blend</div></Link>
            </div> }
        </div>
    );
}

export default BlendItem;