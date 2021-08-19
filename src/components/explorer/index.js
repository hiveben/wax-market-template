import React, {useEffect, useState} from 'react';

import {setQueryStringWithoutPageReload, getValues} from "../helpers/Helpers";

import {Tab, Tabs} from "react-bootstrap";
import TabItem from "../tabitem/TabItem";

import qs from 'qs';

import AssetList from "./AssetList";
import CollectionList from "./CollectionList";
import DefaultHeader from "../defaultheader/DefaultHeader";

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
        <div className={"Page"}>
            <DefaultHeader />
            <div className={"Tabs"}>
                <Tabs className="AssetTabs" defaultActiveKey={tabKey} id="collection-switch" onSelect={(k) => GetAssets(k)}>
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
        </div>
    );
};

export default Explorer;
