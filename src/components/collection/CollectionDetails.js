import React from 'react';
import cn from "classnames";

const CollectionDetails = (props) => {
    const collection = props.collection;

    const {name, collection_name, data, market_fee, telegram} = collection;

    const {url, description} = data;

    return (
        <div className={cn(
            'relative h-28 c-w-collection -top-48 left-32',
            'my-5 mx-2 p-0.5',
            'text-xs text-center text-white',
            'lg:text-left lg:text-sm lg:w-2/5 lg:my-auto',
            'lg:text-left lg:w-2/5 lg:h-32 lg:my-auto lg:p-2.5',
        )}>
            <div className="text-3xl mb-8">{name}</div>
            <div className="text-xl">{description}</div>
            <table className="inline w-full lg:block">
                <tr>
                    <td className="text-blue-700 text-left">Collection Name:</td>
                    <td className="text-white text-right">{collection_name}</td>
                </tr>
                { url ? <tr>
                    <td className="text-blue-700 text-left">Website:</td>
                    <td className="text-white text-right">
                        <div className="CollectionURL">
                            <a className="font-bold h-16 text-blue-700 leading-10" target='_blank' href={url.includes('http') ? url : `http://${url}`}>{url}</a>
                        </div>
                    </td>
                </tr> : '' }
                <tr>
                    <td className="text-blue-700 text-left">Market Fee:</td>
                    <td className="text-white text-right">{market_fee * 100}%</td>
                </tr>
            </table>
        </div>
    );
};

export default CollectionDetails;
