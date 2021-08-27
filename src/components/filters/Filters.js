import CollectionDropdown from "../collectiondropdown";
import React, {useContext, useEffect, useState} from "react";
import {getValues} from "../helpers/Helpers";
import {getSchemas} from "../api/Api";
import {Context} from "../marketwrapper";
import Dropdown from "react-dropdown";
import qs from 'qs';
import {useRouter} from "next/router";
import cn from "classnames";

function Filters(props) {
    const collection = props['collection'];
    const schema = props['schema'];

    const [ state, dispatch ] = useContext(Context);

    const [schemaDropdownOptions, setSchemaDropdownOptions] = useState(null);

    const values = getValues();

    const router = useRouter();

    const pushQueryString = (qsValue) => {
        const newPath =
            window.location.pathname + '?' +
            qsValue;

        router.push(newPath, undefined, { shallow: true });
    };

    const getSchemasResult = (res) => {
        if (res['success']) {
            setSchemaDropdownOptions(res['data'].map(
                item => ({
                    "value": item['schema_name'],
                    "label": item['schema_name']
                })
            ));
        }
    };

    const initialized = state.collections !== null && state.collections !== undefined;

    useEffect(() => {
        console.log(state.collections);
        if (process.browser && ((collection && collection !== '*') || (state.collections && state.collections.length === 1)) && initialized) {
            getSchemas({
                'collections': state.collections.filter(
                    item => (!collection || collection === '*') ? true : item === collection
                )
            }).then(result => getSchemasResult(result));
        } else {
            setSchemaDropdownOptions([]);
        }
    }, [collection, schema, initialized]);

    const onSelectSchema = (e) => {
        const query = values;

        const schema = e ? e.value : '';

        query['schema'] = schema;
        dispatch({type: 'SET_SELECTED_SCHEMA', payload: schema});

        pushQueryString(qs.stringify(query));
    }

    return (
        <div className="w-40">
            <CollectionDropdown
                collection={collection}
                pushQueryString={pushQueryString}
            />
            { schemaDropdownOptions ? <div className={cn(
                "relative w-40 h-9 inline-block m-0",
                "lg:h-9 lg:mr-4 lg:ml-4 lg:mt-2 lg:mb-1",
                "bg-gray-600 rounded-3xl",
                "border-2 border-solid border-blue-600"
            )}>
                <div className="absolute text-white text-xs opacity-80 left-3 top-0">Schema</div>
                <Dropdown
                    options={schemaDropdownOptions}
                    onChange={onSelectSchema}
                    value={schema}
                    placeholder={'Schema'}
                    id="DropdownField4"
                    />
            </div> : '' }
        </div>
    );
}

export default Filters;