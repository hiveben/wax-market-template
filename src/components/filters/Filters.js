import CollectionDropdown from "../collectiondropdown";
import DropdownItem from "../collectiondropdown/DropdownItem";
import React, {useContext, useEffect, useState} from "react";
import {getValues} from "../helpers/Helpers";
import {Context} from "../marketwrapper";
import Input from '../common/util/input/Input';
import qs from 'qs';
import {useRouter} from "next/router";
import cn from "classnames";

function Filters(props) {
    const values = getValues();

    const collection = values['collection'] ? values['collection'] : '*';
    const schema = values['schema'] ? values['schema'] : '';
    const name = values['name'] ? values['name'] : '';
    const genre = values['genre'] ? values['genre'] : '';
    const artist = values['artist'] ? values['artist'] : '';
    const rarity = values['rarity'] ? values['rarity'] : '';
    const variant = values['variant'] ? values['variant'] : '';
    const seller = values['seller'] ? values['seller'] : '';
    const searchPage = props['searchPage'];
    const winner = props['winner'];
    const bidder = props['bidder'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const getDefaultSort = (page) => {
        switch (page) {
            case 'inventory': return 'transferred_desc';
            case 'packs': return 'transferred_desc';
            case 'market': return 'date_desc';
            case 'assets': return 'created_desc';
            case 'auctions': return 'ending_asc';
        }
    };

    const sortBy = values['sort'] ? values['sort'] : getDefaultSort(searchPage);

    const [ state, dispatch ] = useContext(Context);

    const [schemaDropdownOptions, setSchemaDropdownOptions] = useState(null);
    const [nameDropdownOptions, setNameDropdownOptions] = useState(null);
    const [artistDropdownOptions, setArtistDropdownOptions] = useState(null);
    const [genreDropdownOptions, setGenreDropdownOptions] = useState(null);
    const [rarityDropdownOptions, setRarityDropdownOptions] = useState(null);
    const [variantDropdownOptions, setVariantDropdownOptions] = useState(null);

    const sortDropdownOptions = [];

    if (searchPage === 'inventory' || searchPage === 'packs') {
        sortDropdownOptions.push({
            "value": 'transferred_desc',
            "label": 'Received (Last)'
        });
        sortDropdownOptions.push({
            "value": 'transferred_asc',
            "label": 'Received (First)'
        });
    }

    if (searchPage === 'market') {
        sortDropdownOptions.push({
            "value": 'date_desc',
            "label": 'Date (Newest)'
        });
        sortDropdownOptions.push({
            "value": 'date_asc',
            "label": 'Date (Oldest)'
        });
        sortDropdownOptions.push({
            "value": 'price_asc',
            "label": 'Price (Lowest)'
        });
        sortDropdownOptions.push({
            "value": 'price_desc',
            "label": 'Price (Highest)'
        });
    }

    if (searchPage === 'auctions') {
        sortDropdownOptions.push({
            "value": 'ending_desc',
            "label": 'Ending (Latest)'
        });
        sortDropdownOptions.push({
            "value": 'ending_asc',
            "label": 'Ending (Soonest)'
        });
        sortDropdownOptions.push({
            "value": 'date_desc',
            "label": 'Date (Newest)'
        });
        sortDropdownOptions.push({
            "value": 'date_asc',
            "label": 'Date (Oldest)'
        });
        sortDropdownOptions.push({
            "value": 'price_asc',
            "label": 'Price (Lowest)'
        });
        sortDropdownOptions.push({
            "value": 'price_desc',
            "label": 'Price (Highest)'
        });
    }

    if (searchPage === 'assets') {
        sortDropdownOptions.push({
            "value": 'created_desc',
            "label": 'Created (Newest)'
        });
        sortDropdownOptions.push({
            "value": 'created_asc',
            "label": 'Created (Oldest)'
        });
    }

    sortDropdownOptions.push({
        "value": 'mint_asc',
        "label": 'Mint (Lowest)'
    });

    sortDropdownOptions.push({
        "value": 'mint_desc',
        "label": 'Mint (Highest)'
    });

    const [schemaData, setSchemaData] = useState(null);
    const [templateData, setTemplateData] = useState(null);

    const router = useRouter();

    const pushQueryString = (qsValue) => {
        const newPath =
            window.location.pathname + '?' +
            qsValue;

        router.push(newPath, undefined, { shallow: true });
    };

    const getSchemasResult = (collection) => {
        if (schemaData['success']) {
            const schemaOptions = [{'value': '', 'label': 'All Type'}]
            schemaData['data'].filter(
                item => item['collection']['collection_name'] === collection).sort((a, b) => compareValues(
                a['schema_name'], b['schema_name'])).map(
                item => schemaOptions.push({
                    "value": item['schema_name'],
                    "label": item['schema_name']
                }));

            setSchemaDropdownOptions(schemaOptions);
        }
    };

    const compareValues = (a, b) => {
        if (a.toUpperCase() > b.toUpperCase()) {
            return 1;
        } else if (a.toUpperCase() < b.toUpperCase()) {
            return -1;
        } else {
            return 0;
        }
    };

    const getTemplatesResult = (collection) => {
        const names = [];
        const artists = [];
        const genres = [];
        const rarities = [];
        const variants = [];
        if (templateData['success']) {
            templateData['data'].filter(
                item => item['collection']['collection_name'] === collection
            ).map(
                item => {
                    const data = item['immutable_data'];
                    const itemSchema = item['schema'];
                    if (data['name']
                        && !names.includes(data['name'])
                        && (!schema || (itemSchema && itemSchema['schema_name'] === schema))
                        && (!rarity || (data['rarity'] && data['rarity'] === rarity))
                        && (!variant || (data['variant'] && data['variant'] === variant))
                        && (!artist || (data['song_artist'] && data['song_artist'] === artist))
                        && (!genre || (data['genre'] && data['genre'] === genre))
                    ) {
                        names.push(data['name'])
                    }
                    if (data['song_artist']
                        && !artists.includes(data['song_artist'])
                        && (!schema || (itemSchema && itemSchema['schema_name'] === schema))
                        && (!variant || (data['variant'] && data['variant'] === variant))
                        && (!rarity || (data['rarity'] && data['rarity'] === rarity))
                        && (!name || (data['name'] && data['name'] === name))
                        && (!genre || (data['genre'] && data['genre'] === genre))
                    ) {
                        artists.push(data['song_artist'])
                    }
                    if (data['genre']
                        && !genres.includes(data['genre'])
                        && (!schema || (itemSchema && itemSchema['schema_name'] === schema))
                        && (!variant || (data['variant'] && data['variant'] === variant))
                        && (!rarity || (data['rarity'] && data['rarity'] === rarity))
                        && (!name || (data['name'] && data['name'] === name))
                        && (!artist || (data['song_artist'] && data['song_artist'] === artist))
                    ) {
                        genres.push(data['genre'])
                    }
                    if (data['rarity']
                        && !rarities.includes(data['rarity'])
                        && (!schema || (itemSchema && itemSchema['schema_name'] === schema))
                        && (!variant || (data['variant'] && data['variant'] === variant))
                        && (!name || (data['name'] && data['name'] === name))
                        && (!artist || (data['song_artist'] && data['song_artist'] === artist))
                        && (!genre || (data['genre'] && data['genre'] === genre))
                    ) {
                        rarities.push(data['rarity'])
                    }
                    if (data['variant']
                        && !variants.includes(data['variant'])
                        && (!schema || (itemSchema && itemSchema['schema_name'] === schema))
                        && (!rarity || (data['rarity'] && data['rarity'] === rarity))
                        && (!name || (data['name'] && data['name'] === name))
                        && (!artist || (data['song_artist'] && data['song_artist'] === artist))
                        && (!genre || (data['genre'] && data['genre'] === genre))
                    ) {
                        variants.push(data['variant'])
                    }
                }
            );
            if (names.length > 0) {
                const options = [{'value': '', 'label': 'All Title'}]
                names.sort((a, b) => compareValues(a, b)).map(name => {
                    options.push({
                        "value": name,
                        "label": name
                    });
                });
                setNameDropdownOptions(options);
            }
            if (genres.length > 0) {
                const options = [{'value': '', 'label': 'All Genres'}];
                genres.sort((a, b) => a.toUpperCase() - b.toUpperCase()).map(genre => options.push({
                    "value": genre,
                    "label": genre
                }));
                setGenreDropdownOptions(options);
            }
            if (artists.length > 0) {
                const options = [{'value': '', 'label': 'All Artists'}];
                artists.sort((a, b) => a.toUpperCase() - b.toUpperCase()).map(artist => options.push({
                    "value": artist,
                    "label": artist
                }));
                setArtistDropdownOptions(options);
            }
            if (rarities.length > 0) {
                const options = [{'value': '', 'label': 'All Rarities'}];
                rarities.sort((a, b) => a.toUpperCase() - b.toUpperCase()).map(rarity => options.push({
                    "value": rarity,
                    "label": rarity
                }));
                setRarityDropdownOptions(options);
            }
            if (variants.length > 0) {
                const options = [{'value': '', 'label': 'All Variants'}];
                variants.sort((a, b) => a.toUpperCase() - b.toUpperCase()).map(variant => options.push({
                    "value": variant,
                    "label": variant
                }));
                setVariantDropdownOptions(options);
            }
        }
    };

    const initialized = (
        state.collections !== null &&
        state.collections !== undefined &&
        state.templateData !== null &&
        state.templateData !== undefined &&
        state.schemaData !== null &&
        state.schemaData !== undefined
    );

    useEffect(() => {
        if (!schemaData && state.schemaData)
            state.schemaData.then(res => setSchemaData(res));
        if (!templateData && state.templateData)
            state.templateData.then(res => setTemplateData(res));
        if (process.browser && ((collection && collection !== '*') || (state.collections && state.collections.length === 1)) && initialized) {
            const filterCollection = state.collections.filter(
                item => (!collection || collection === '*') ? true : item === collection
            )[0];
            if (schemaData && searchPage !== 'packs')
                getSchemasResult(filterCollection);
            if (templateData)
                getTemplatesResult(filterCollection);
        } else {
            setSchemaDropdownOptions([]);
        }
    }, [collection, schemaData, templateData, initialized]);

    const onSelectSchema = (e) => {
        const query = values;

        const schema = e ? e.value : '';

        query['schema'] = schema;

        delete query['name'];
        delete query['rarity'];
        delete query['variant'];

        pushQueryString(qs.stringify(query));
    };

    const onSelectName = (e) => {
        const query = values;

        const name = e ? e.value : '';

        query['name'] = name;

        pushQueryString(qs.stringify(query));
    };

    const onSelectGenre = (e) => {
        const query = values;

        const genre = e ? e.value : '';

        query['genre'] = genre;

        pushQueryString(qs.stringify(query));
    };

    const onSelectArtist = (e) => {
        const query = values;

        const artist = e ? e.value : '';

        query['artist'] = artist;

        pushQueryString(qs.stringify(query));
    };

    const onSelectRarity = (e) => {
        const query = values;

        const rarity = e ? e.value : '';

        query['rarity'] = rarity;

        pushQueryString(qs.stringify(query));
    };

    const onSelectVariant = (e) => {
        const query = values;

        const variant = e ? e.value : '';

        query['variant'] = variant;

        pushQueryString(qs.stringify(query));
    };

    const onSelectSorting = (e) => {
        const query = values;

        const sort = e ? e.value : '';

        query['sort'] = sort;

        pushQueryString(qs.stringify(query));
    };

    const checkMyListings = (e) => {
        const query = values;

        if (query['seller'] === userName)
            delete query['seller'];
        else
            query['seller'] = userName;

        pushQueryString(qs.stringify(query));

    }

    return (
        <div>
            <h3 className={cn(
                    'text-neutral font-bold text-xl mb-4'
                )}
            >
                Filters
            </h3>
            <CollectionDropdown
                collection={collection}
                pushQueryString={pushQueryString}
            />
            { schemaDropdownOptions ? <DropdownItem 
                header="Schema"
                options={schemaDropdownOptions}
                onChange={onSelectSchema}
                value={schema}
            /> : '' }
            { nameDropdownOptions ? <DropdownItem 
                header="Name"
                options={nameDropdownOptions}
                onChange={onSelectName}
                value={name}
            /> : '' }
            { genreDropdownOptions ? <DropdownItem
                header="Genre"
                options={genreDropdownOptions}
                onChange={onSelectGenre}
                value={genre}
            /> : '' }
            { artistDropdownOptions ? <DropdownItem
                header="Artist"
                options={artistDropdownOptions}
                onChange={onSelectArtist}
                value={artist}
            /> : '' }
            { rarityDropdownOptions ? <DropdownItem 
                header="Rarity"
                options={rarityDropdownOptions}
                onChange={onSelectRarity}
                value={rarity}
            /> : '' }
            { variantDropdownOptions ? <DropdownItem 
                header="Variant"
                options={variantDropdownOptions}
                onChange={onSelectVariant}
                value={variant}
            /> : '' }
            { sortDropdownOptions ? <DropdownItem
                header="Sort By"
                options={sortDropdownOptions}
                onChange={onSelectSorting}
                value={sortBy}
            /> : '' }
            { searchPage === 'market' ?
                <div className="ml-1">
                    <Input
                        type="checkbox"
                        className="mr-2"
                        checked={seller === userName}
                        onChange={checkMyListings}
                    />
                        My Listings
                </div> : ''
            }
            { searchPage === 'auctions' && !winner && !bidder ?
                <div className="ml-1">
                    <Input
                        type="checkbox"
                        className="mr-2"
                        checked={seller === userName}
                        onChange={checkMyListings}
                    />
                        My Auctions
                </div> : ''
            }
        </div>
    );
}

export default Filters;