import React from 'react';

import AssetDetails from "../asset/AssetDetails";

import AssetImage from "../asset/AssetImage";
import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import cn from 'classnames';

import config from "../../config.json";

const BlendComponent = (props) => {
    const blend = props.blend;

    console.log(blend);

    const {name, description} = blend;

    const image = blend['image'] ? blend['image'].includes(
        'http') ? blend['image'] : config.ipfs + blend['image'] : '';

    const title = `Check out ${blend.name}`;

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

export default BlendComponent;
