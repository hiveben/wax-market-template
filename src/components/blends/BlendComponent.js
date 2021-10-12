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
import Button from "../common/util/input/Button";

const BlendComponent = (props) => {
    const blend = props.blend;
    const [ state, dispatch ] = useContext(Context);

    const [collection, setCollection] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const {ingredients, display_data, collection_name} = blend;

    const selectedAssets = state.selectedAssets;

    const templatesNeeded = [];
    const searchTemplates = [];
    const assignedAssetIds = [];

    ingredients.map(ingredient => {
        if (ingredient[0] === 'TEMPLATE_INGREDIENT') {
            for (let i = 0; i < ingredient[1].amount; i++) {
                let assignedAsset = null;
                selectedAssets && selectedAssets.map(asset => {
                    if (!assignedAssetIds.includes(
                        asset.asset_id) && asset.template.template_id.toString() === ingredient[1].template_id.toString()) {
                        assignedAsset = asset;
                        assignedAssetIds.push(asset.asset_Id);
                    }
                });

                if (!Object.keys(searchTemplates).includes(ingredient[1].template_id)) {
                    searchTemplates[ingredient[1].template_id] = {
                        collection_name: ingredient[1].collection_name
                    };
                }

                templates.map(template => {
                    if (template.template_id.toString() === ingredient[1].template_id.toString()) {
                        templatesNeeded.push({
                            template: template,
                            assignedAsset: assignedAsset
                        });
                    }
                });
            }
        }
    });

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
        Promise.all(Object.keys(searchTemplates).map(template_id => {
            return getTemplate(template_id, searchTemplates[template_id]);
        })).then(res => parseTemplates(res));

        getCollection(collection_name).then(res => res && res.success && setCollection(res.data));
    }, [collection_name]);

    const blendAction = () => {
        console.log('argh');
    };

    const ready = templatesNeeded.map(template => template.assignedAsset && template.assignedAsset !== undefined).reduce((a, b) => a && b);

    console.log(ready);

    return (
        <Page id="BlendPage">
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
                            <Button className={cn(
                                'py-1 px-8 text-secondary mt-3 mb-3 mx-auto',
                                'cursor-pointer text-sm font-bold leading-relaxed uppercase',
                                'rounded-3xl outline-none',
                                {'bg-primary': ready},
                                {'bg-paper' : !ready}
                            )}
                               onClick={blendAction}>
                                Blend
                            </Button>
                            Ingredients
                            <div className={cn('w-full grid grid-cols-3 gap-10')}>
                                {isLoading ? <LoadingIndicator /> : templatesNeeded.map((template, index) =>
                                    <TemplateIngredient
                                        template={template}
                                        index={index}
                                    />
                                )}
                            </div>
                            My Assets
                            <MyAssetList
                                templates={templates}
                                {...props}
                                templatesNeeded={templatesNeeded.filter(template => template.assignedAsset === null)}
                            />
                        </div>
                    </div>
                </div>
            </div>}
        </Page>
    );
};

export default BlendComponent;
