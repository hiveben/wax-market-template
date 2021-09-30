import React, {useEffect, useState} from 'react';

import {setQueryStringWithoutPageReload, getValues} from "../helpers/Helpers";

import qs from 'qs';

import NeftyBlendsList from "./NeftyBlendsList";
import Page from "../common/layout/Page";
import Content from "../common/layout/Content";
import cn from "classnames";
import {Tab, Tabs} from "react-bootstrap";
import TabItem from "../tabitem/TabItem";
import BlenderizerList from "./BlenderizerList";

const Blends = (props) => {
    const values = getValues();

    const keys = ['blenderizer', 'nefty.blends'];
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const activeUser = ual['activeUser'] && ual['activeUser']['accountName'];
    const loggedOut = activeUser === null;

    const [tabKey, setTabKey] = useState(process.browser ? (
        values['tab'] && keys.includes(values['tab']) ? values['tab'] : 'nefty.blends'
    ) : (props.tab && keys.includes(props.tab) ? props.tab : 'nefty.blends'));

    const initTabs = async(key, user, loggedOut, initial = false) => {
        if (key !== tabKey || initial) {
            const query = values;

            query['tab'] = key;
            if (user)
                query['user'] = user;
            else
                delete query['user'];

            if (!initial)
                setQueryStringWithoutPageReload(qs.stringify(query));
            setTabKey(key);
        }
    };

    useEffect(() => {
        initTabs(tabKey, activeUser, loggedOut, true);
    }, [tabKey, activeUser, loggedOut]);

    const login = () => {
        ual.showModal();
    };

    return (
        <Page>
            <Content headline="Blends">
                <div className="container mx-auto">
                    {loggedOut ? <div onClick={login}>
                        Login
                    </div> : <Tabs
                        className={cn(
                            'border-tabs',
                            'flex h-12 my-10 rounded-md',
                            'text-sm lg:text-base text-neutral',
                            'border border-paper'
                        )}
                        defaultActiveKey={tabKey}
                        id="collection-switch"
                        onSelect={(k) => initTabs(k)}
                    >
                        <Tab
                            eventKey="nefty.blends"
                            title={
                                <TabItem user={activeUser} target={'nefty.blends'} tabKey={tabKey} title={'Nefty Blends'} />
                            }
                        >
                            {tabKey === 'nefty.blends' &&
                                <NeftyBlendsList user={activeUser} {...props} />
                            }
                        </Tab>
                        <Tab
                            eventKey="blenderizer"
                            title={
                                <TabItem target={'blenderizer'} tabKey={tabKey} title={'Blenderizer'} />
                            }
                        >
                            {tabKey === 'blenderizer' &&
                            <BlenderizerList user={activeUser} {...props} />
                            }
                        </Tab>
                    </Tabs>}
                </div>
            </Content>
        </Page>
    );
};

export default Blends;
