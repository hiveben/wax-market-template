import React from 'react';

import qs from 'qs';
import Market from "../components/market";

const HomePage = (props) => {
    return <Market {...props} />;
};


HomePage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    return qs.parse(paths[1].replace('?', ''));
};

export default HomePage;
