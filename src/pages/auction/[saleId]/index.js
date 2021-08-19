import React from 'react';

import SaleComponent from "../../../components/sale/SaleComponent";
import qs from 'qs';
import {getSale} from "../../../components/api/Api";

const Sale = (props) => {
    return (<SaleComponent {...props} />);
};

Sale.getInitialProps = async (ctx) => {
    const paths = ctx.asPath.split('/');

    const saleId = paths[paths.length - 1].indexOf('?') > 0 ? paths[paths.length - 1].substr(
        0, paths[paths.length - 1].indexOf('?')) : paths[paths.length - 1];

    const sale = await getSale(saleId);

    const values = qs.parse(paths[2].replace(`${saleId}?`, ''));

    values['sale'] = sale;

    return values;
};

export default Sale;
