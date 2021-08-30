import {getCollectionLink} from "../helpers/Helpers";
import React from "react";
import moment from 'moment';

const AssetDetails = (props) => {
    const asset = props.asset;

    const {name, asset_id, owner, schema, minted_at_time, template_mint} = asset;

    const utc = moment.unix(minted_at_time / 1000).utc().toDate();
    const date = minted_at_time ? moment(utc).local().format('YYYY-MM-DD HH:mm:ss') : '';

    return (
        <div className="text-sm text-white overflow-auto asset-detail">
            <div className="text-left text-white text-4xl font-light mb-8">{name}</div>
            <table className="w-full my-auto">
                <tr>
                    <td className="text-left w-1/3">ID:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">{asset_id}</td>
                </tr>
                <tr>
                    <td className="text-left w-1/3">Name:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">{name}</td>
                </tr>
                <tr>
                    <td className="text-left w-1/3">Mint:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">#{template_mint}</td>
                </tr>
                <tr>
                    <td className="text-left w-1/3">Total:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">
                        <div className="inline-flex leading-6">
                            <a className="text-white underline" data-tip={('asset.available')} target="_blank" href={`/explorer?tab=assets&template_id=${asset.template.template_id}`}>
                                {asset.template.issued_supply}
                            </a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="text-left w-1/3">Owner:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">{owner}</td>
                </tr>
                <tr>
                    <td className="text-left w-1/3">Collection:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">
                        <div className="inline-flex">{getCollectionLink(asset.collection.collection_name)}</div>
                    </td>
                </tr>
                <tr>
                    <td className="text-left w-1/3">Schema:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">{schema.schema_name}</td>
                </tr>
                <tr>
                    <td className="text-left w-1/3">Minted at:</td>
                    <td className="text-right overflow-x-auto leading-5 max-w-td">{date}</td>
                </tr>
            </table>
        </div>
    );
};

export default AssetDetails;
