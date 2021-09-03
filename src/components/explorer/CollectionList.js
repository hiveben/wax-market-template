import React, {useContext, useEffect, useState} from 'react';
import cn from "classnames";

import CollectionPreview from "./CollectionPreview";

import {getValues} from "../helpers/Helpers";
import {getCollections} from "../api/Api";
import {Context} from "../marketwrapper";
import LoadingIndicator from "../loadingindicator";

function CollectionList(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const [ state, dispatch ] = useContext(Context);

    const [collections, setCollections] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    const values = getValues();

    const [searchAuthor, setSearchAuthor] = useState(process.browser && values['collection'] ? values['collection'] : '*');

    const [searchVerified, setSearchVerified] = useState(process.browser && values['verified'] ? values['verified'] : true);

    const initialized = state.collections !== null && state.collections !== undefined;

    const receiveCollections = (res) => {
        setIsLoading(false);
        if (res && res.data && res.data.results)
            setCollections(res.data.results);
    }

    useEffect(() => {
        if (initialized) {
            getCollections(state.collections).then(res => receiveCollections(res));
        }
    }, [searchVerified, searchAuthor, initialized]);

    return (
        <div className={cn(
            'lg:justify-evenly',
            'min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8',
        )}>
            {
                isLoading ? <LoadingIndicator/> : collections.map((collection, index) => <CollectionPreview key={collection.collection+'_'+index} collection={collection} ual={ual} />)
            }
        </div>
    );
}

export default CollectionList;
