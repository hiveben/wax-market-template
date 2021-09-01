import React from 'react';
import Header from "../common/util/Header"
import Page from "../common/layout/Page"

import config from "../../config.json";

const Home = () => {
    return (
        <Page>
            <Header
                title={config.market_title}
                description={config.market_description}
                image={config.header_image}
            />
        </Page>
    );
};

export default Home;
