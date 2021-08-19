import React, {useEffect, useState} from 'react';

import CollectionPreview from "./CollectionPreview";

import {getValues} from "../helpers/Helpers";

function CollectionList(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const [collections, setCollections] = useState([]);

    const values = getValues();

    const [searchAuthor, setSearchAuthor] = useState(process.browser && values['collection'] ? values['collection'] : '*');

    const [searchVerified, setSearchVerified] = useState(process.browser && values['verified'] ? values['verified'] : true);

    useEffect(() => {
    }, [searchVerified, searchAuthor]);

    return (
        <div className="CollectionList">
            {
                collections.map((collection, index) => <CollectionPreview key={collection.collection+'_'+index} collection={collection} ual={ual} />)
            }
        </div>
    );
}

export default CollectionList;
