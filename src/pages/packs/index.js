import React from 'react';

import qs from 'qs';
import Packs from "../../components/packs";

const PacksPage = (props) => {
    return (<Packs {...props} />);
};

PacksPage.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    const values = qs.parse(paths[1].replace( '?', ''));

    return values;
};

export default PacksPage;
