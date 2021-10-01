import React, {useContext, useEffect} from 'react';
import cn from "classnames";
import PreviewImage from "../assetpreview/PreviewImage";
import {Context} from "../marketwrapper";

function TemplateIngredient(props) {
    const template = props['template'];
    const index = props['index'];
    const [ state, dispatch ] = useContext(Context);

    const selectedTemplates = state.selectedTemplates;
    const selectedAssets = state.selectedAssets;

    const selected = selectedTemplates && selectedTemplates.map(temp => temp.index).includes(index);

    useEffect(() => {
        if (!selectedAssets) {

        }
    }, [selectedAssets && selectedAssets.length]);

    return (
        <div className={
            cn('w-full',
                {'border-primary': selected})}
        >
            <div className={cn('')}>
                <div className={cn('w-full')}>
                    <PreviewImage {...props} asset={template} />
                </div>
                <div>{template.name}</div>
                <div>{template.template_id}</div>
            </div>
        </div>
    );
}

export default TemplateIngredient;