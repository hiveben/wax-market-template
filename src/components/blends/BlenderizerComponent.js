import React from 'react';

import AssetDetails from "../asset/AssetDetails";

import AssetImage from "../asset/AssetImage";
import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import cn from 'classnames';

import config from "../../config.json";

const BlenderizerComponent = (props) => {
    const template = props.template;

    const image = template['img'] ? template['img'].includes(
        'http') ? template['img'] : config.ipfs + template['img'] : '';

    const title = `Check out ${template.name}`;

    let description = `by ${template.collection.name}`

    console.log(template);

    return (
        <Page id="AssetPage">
            <Header
                title={title}
                image={image}
                description={description}
            />
            <div className={cn('container mx-auto pt-10')}>

            </div>
        </Page>
    );
};

export default BlenderizerComponent;
