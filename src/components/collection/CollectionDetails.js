import React from 'react';

const CollectionDetails = (props) => {
    const collection = props.collection;

    const {name, collection_name, data, market_fee, telegram} = collection;

    const {url, description} = data;

    return (
        <div className="CollectionDetails">
            <div className="CollectionName">{name}</div>
            <div className="AuthorDescription">{description}</div>
            <table>
                <tr>
                    <td>Collection Name:</td>
                    <td>{collection_name}</td>
                </tr>
                { url ? <tr>
                    <td>Website:</td>
                    <td><div className="CollectionURL"><a target='_blank' href={url.includes('http') ? url : `http://${url}`}>{url}</a></div></td>
                </tr> : '' }
                <tr>
                    <td>Market Fee:</td>
                    <td>{market_fee * 100}%</td>
                </tr>
            </table>
        </div>
    );
};

export default CollectionDetails;
