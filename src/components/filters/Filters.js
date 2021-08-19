import CollectionDropdown from "../collectiondropdown";
import React, {useState} from "react";
import {pushQueryString} from "../helpers/Helpers";

function Filters(props) {
    const collection = props['collection'];

    const selectCollection = (collection) => {
        pushQueryString()
    }

    return (
        <div className="Filters">
            <CollectionDropdown
                selectCollection={selectCollection}
            />
        </div>
    );
}

export default Filters;