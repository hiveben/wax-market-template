import React, {useContext, useEffect, useState} from "react";

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import qs from 'qs';
import {Context} from "../marketwrapper";
import {
    createCollectionImageOption,
    createCollectionOption,
    pushQueryString,
    getValues,
} from "../helpers/Helpers";
import LoadingIndicator from "../loadingindicator";
import config from "../../config.json";
import {getCollections} from "../api/Api";


const CollectionDropdown = React.memo(props => {
    const values = getValues();

    const [collections, setCollections] = useState(null);
    const [state, dispatch] = useContext(Context);
    const [isLoading, setIsLoading] = useState(false);

    const collection = props['collection'];

    const getDefaultOption = () => (
        { value: '', label: '-', title: '-'}
    );

    const initialized = state.collections !== null;

    const createCollections = (data, search = '') => {
        const collections = [];

        data.map(
            element => {
                if (!collections.find(a => a.value === element))
                    if (!search || element['name'].toLowerCase().includes(search.toLowerCase()) || element['collection_name'].toLowerCase().includes(
                        search.toLowerCase()))
                        collections.push({
                            value: element['collection_name'],
                            title: element['name'],
                            label: element['name'],
                            image: config.ipfs + element['data']['img']
                        })
            }
        );

        return collections;
    };

    const [collectionDropDownOptions, setCollectionDropDownOptions] = useState(
        collections ? createCollections(collections, false, ('navigation.all_collections'),
        true) : [getDefaultOption()]);

    const onSearchCollection = (e, collections) => {
        setCollectionDropDownOptions(createCollections(collections, e.target.value))
    };

    const onSelectCollection = (e) => {
        const query = values;

        query['collection'] = e ? e.value : '*';
        dispatch({type: 'SET_COLLECTION', payload: collection});

        pushQueryString(qs.stringify(query));
    };

    const createCollectionDropDownOptions = (collections) => {
        if (collections && collections['data']) {
            setCollectionDropDownOptions(createCollections(collections['data']['results'], false,
                ('navigation.all_collections'), true));
            setCollections(collections['data']['results']);
        }
    };

    const initCollections = async () => {
        setIsLoading(true);
        getCollections(state.collections).then(result => createCollectionDropDownOptions(result));
    };

    useEffect(() => {
        if (process.browser && !collections && initialized) {
            initCollections();
        }
    }, [collection, state, initialized]);

    const getCollectionOption = (options, collection) => {
        return options.map(item => item.value).indexOf(collection);
    };

    const defaultOptions = [];

    let collectionLocation = collection && collection !== '*' ? getCollectionOption(
        collectionDropDownOptions, collection) : 0;

    if (collectionLocation > collectionDropDownOptions.length - 101) {
        collectionLocation = Math.max(0, collectionDropDownOptions.length - 101);
    }

    const length = collectionDropDownOptions ? collectionDropDownOptions.filter(
        option => !option || option === -1 || option === null || !defaultOptions.map(
            option => option && option.value).includes(option.value)).length : 0;

    const dropDownOptions = collectionDropDownOptions ? collectionDropDownOptions.filter(
        option => !option || option === -1 || option === null || !defaultOptions.map(
            option => option && option.value).includes(option.value)).slice(collectionLocation, Math.min(length - collectionLocation, collectionLocation + 100)) : null;

    const option = collection && collection !== '*' ? getCollectionOption(dropDownOptions, collection) : -1;

    return (
        <div className="CollectionContainer">
            {collections ? <div
                className="CollectionElement"
            >
                <Autocomplete
                    multiple={false}
                    options={dropDownOptions}
                    getOptionLabel={(option) => option ? option.title : null}
                    renderOption={(option) => (
                        <React.Fragment>
                            { option.image ? createCollectionImageOption(option.title, option.image) : createCollectionOption(option.title) }
                        </React.Fragment>
                    )}
                    defaultValue={defaultOptions ? defaultOptions[0] : null}
                    id="collection-box"
                    style={{ width: '100%' }}
                    popupIcon={null}
                    deactivated={isLoading}
                    onChange={(event, newValue) => {
                        onSelectCollection(newValue);
                    }}
                    onInput={(e) => onSearchCollection(e, collections)}
                    renderInput={(params) =>
                        <div className={option && option > 0 ? "CollectionDropdown" : "CollectionDropdown ChooseCollection"}>
                            <TextField
                                {...params}
                                variant="standard"
                                placeholder={'Collection'}
                            />
                        </div>
                    }
                />
            </div> : <LoadingIndicator/> }
        </div>
    );
});

export default CollectionDropdown;
