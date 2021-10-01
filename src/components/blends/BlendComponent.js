import React, {useContext, useEffect, useState} from 'react';

import Header from "../common/util/Header"
import Page from "../common/layout/Page"
import cn from 'classnames';

import AssetImage from "../asset/AssetImage";
import {getCollection, getTemplate} from "../api/Api";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import TemplateIngredient from "./TemplateIngredient";
import MyAssetList from "./MyAssetList";
import {Context} from "../marketwrapper";

const BlendComponent = (props) => {
    const blend = props.blend;
    const [ state, dispatch ] = useContext(Context);

    const [collection, setCollection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const {ingredients, display_data, collection_name} = blend;

    const selectedAssets = state.selectedAssets;

    const templatesNeeded = [];

    ingredients.map(ingredient => {
        if (ingredient[0] === 'TEMPLATE_INGREDIENT') {
            const template = ingredient[1];
            for (let i = 0; i < template.amount; i++) {
                templatesNeeded.push({
                    template_id: template.template_id,
                    collection_name: template.collection_name
                });
            }
        }
    });

    useEffect(() => {
        if (selectedAssets) {
            for (let i = 0; i < templatesNeeded.length; i++) {

            }
        }
    }, [selectedAssets && selectedAssets.length]);

    const data = JSON.parse(display_data);

    const {image, name} = data;

    const title = `Check out ${blend.name}`;

    const parseTemplates = (res) => {
        const temps = [];

        res.map(template => {
            if (template && template.success) {
                temps.push(template.data);
            }
        });

        setTemplates(temps);
        setIsLoading(false);
    };

    useEffect(() => {
        Promise.all(templatesNeeded.map(template => {
            return getTemplate(template.template_id, template.collection_name);
        })).then(res => parseTemplates(res));

        getCollection(collection_name).then(res => res && res.success && setCollection(res.data));
    }, [collection_name]);

    return (
        <Page id="AssetPage">
            <Header
                title={title}
                image={image}
                description={data['description']}
            />
            {isLoading ? <LoadingIndicator /> : <div className={cn('container mx-auto pt-10')}>
                <div className={cn('w-full')}>
                    <div className="flex flex-col items-center md:justify-center md:flex-row h-auto px-10">
                        <div className="w-full">
                            <div>{name}</div>
                            <AssetImage
                                asset={{data: {img: image}}}
                            />
                            Ingredients
                            <div className={cn('w-full grid grid-cols-3 gap-10')}>
                                {isLoading ? <LoadingIndicator /> : templates.map((template, index) =>
                                    <TemplateIngredient template={template} index={index} />
                                )}
                            </div>
                            <MyAssetList
                                templates={templates}
                                {...props}
                            />
                        </div>
                    </div>
                </div>
            </div>}
        </Page>
    );
};

export default BlendComponent;
