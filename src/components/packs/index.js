import React, {useEffect, useState} from 'react';

import {setQueryStringWithoutPageReload, getValues} from "../helpers/Helpers";

import {Tab, Tabs} from "react-bootstrap";
import TabItem from "../tabitem/TabItem";

import qs from 'qs';
import cn from "classnames";

import MyPacksList from "./MyPacksList";
import UnclaimedPacksList from "./UnclaimedPacksList";
import Page from "../common/layout/Page";
import Content from "../common/layout/Content";

const Packs = (props) => {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const values = getValues();

    const keys = ['mypacks', 'unclaimed'];

    const [tabKey, setTabKey] = useState(process.browser ? (
        values['tab'] && keys.includes(values['tab']) ? values['tab'] : 'mypacks'
    ) : (props.tab && keys.includes(props.tab) ? props.tab : 'mypacks'));

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
            <Content headline="Packs">
                <div className="container mx-auto">
                    <Tabs
                        className={cn(
                            'border-tabs',
                            'flex h-12 my-10 rounded-md',
                            'text-sm lg:text-base text-neutral',
                            'border border-paper'
                        )}
                        defaultActiveKey={tabKey}
                        id="collection-switch"
                        onSelect={(k) => GetAssets(k)}
                    >
                        <Tab
                            eventKey="mypacks"
                            title={
                                <TabItem target={'mypacks'} tabKey={tabKey} title={'My Packs'} />
                            }
                        >
                        {tabKey === 'mypacks' &&
                            <MyPacksList ual={ual} />
                        }
                        </Tab>
                        <Tab
                            eventKey="unclaimed"
                            title={
                                <TabItem target={'unclaimed'} tabKey={tabKey} title={'Unclaimed Packs'} />
                            }
                        >
                        {tabKey === 'unclaimed' &&
                            <UnclaimedPacksList ual={ual} />
                        }
                        </Tab>
                    </Tabs>
                </div>
            </Content>
        </Page>
    );
};

export default Packs;
