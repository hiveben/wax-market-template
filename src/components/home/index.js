import React from 'react';
import Header from "../common/util/Header"
import Page from "../common/layout/Page"

import config from "../../config.json";

const Home = () => {
    return (
        <Page>
            <Header
                ogTitle={config.market_title}
                ogDescription={config.market_description}
                ogImage={config.header_image}
                pageImage={config.header_image}
                twitterTitle={config.market_title}
                twitterDescription={config.market_description}
                twitterImage={config.header_image}
            >
                <style type="text/css">
                    {
                        'body {' +
                            'background-color: #1A1A1A;' +
                            'color: #1235ba;' +
                        '}'
                    }
                </style>
            </Header>
        </Page>
    );
};

export default Home;
