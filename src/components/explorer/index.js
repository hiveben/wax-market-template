import React, {useEffect, useState} from 'react';

import {setQueryStringWithoutPageReload, getValues} from "../helpers/Helpers";

import {Tab, Tabs} from "react-bootstrap";
import TabItem from "../tabitem/TabItem";

import qs from 'qs';
import cn from "classnames";

import AssetList from "./AssetList";
import CollectionList from "./CollectionList";
import Header from "../common/util/Header"
import Page from "../common/layout/Page"

import config from "../../config.json";

const Explorer = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const values = getValues();

    const keys = ['collections', 'assets'];

    const [tabKey, setTabKey] = useState(process.browser ? (
        values['tab'] && keys.includes(values['tab']) ? values['tab'] : 'collections'
    ) : (props.tab && keys.includes(props.tab) ? props.tab : 'collections'));

    const GetAssets = async(key, initial = false) => {
        if (key !== tabKey || initial) {
            const query = values;

            delete query['order_dir'];
            delete query['search_type'];
            delete query['order_by'];
            query['tab'] = key;
            delete query['offer_type'];

            if (!initial)
                setQueryStringWithoutPageReload(qs.stringify(query));
            setTabKey(key);
        }
    };

    useEffect(() => {
        GetAssets(tabKey, true);
    }, [tabKey]);

    return (
        <Page>
            <Header
                title={config.market_title}
                description={config.market_description}
                image={config.header_image}
            />
            <div className="relative c-h-tabs lg:c-h-tabs-lg 2xl:c-h-tabs-2xl">
                <Tabs
                    className={cn(
                        'flex justify-between h-12 m-1 lg:m-5 px-10 pt-2',
                        'text-xs lg:text-sm text-white',
                        'bg-gray-800 rounded-2xl'
                    )}
                    defaultActiveKey={tabKey}
                    id="collection-switch"
                    onSelect={(k) => GetAssets(k)}
                >
                    <Tab eventKey="collections" title={
                        <TabItem target={'collections'} tabKey={tabKey} title={'Collections'} />
                    }>
                        {tabKey === 'collections' ? <CollectionList ual={ual} /> : <div />}
                    </Tab>
                    <Tab eventKey="assets" title={
                        <TabItem target={'assets'} tabKey={tabKey} title={'Assets'} />
                    }>
                        {tabKey === 'assets' ? <AssetList ual={ual} /> : <div />}
                    </Tab>
                </Tabs>
            </div>
        </Page>
    );
};

export default Explorer;
