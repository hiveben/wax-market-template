import {getCollectionLink} from "../helpers/Helpers";
import React from "react";
import moment from 'moment';

const AssetDetails = (props) => {
    const asset = props.asset;

    const {name, asset_id, owner, schema, minted_at_time, template_mint} = asset;

    const utc = moment.unix(minted_at_time / 1000).utc().toDate();
    const date = minted_at_time ? moment(utc).local().format('YYYY-MM-DD HH:mm:ss') : '';

    return (
        <div className="AssetDetails">
            <div className={"AssetName"}>{name}</div>
            <table>
                <tr>
                    <td>ID:</td>
                    <td>{asset_id}</td>
                </tr>
                <tr>
                    <td>Name:</td>
                    <td>{name}</td>
                </tr>
                <tr>
                    <td>Mint:</td>
                    <td>#{template_mint}</td>
                </tr>
                <tr>
                    <td>Total:</td>
                    <td>
                        <div className="NumberOfAssets">
                            <a data-tip={('asset.available')} target="_blank" href={`/explorer?tab=assets&template_id=${asset.template.template_id}`}>
                                {asset.template.issued_supply}
                            </a>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>Owner:</td>
                    <td>{owner}</td>
                </tr>
                <tr>
                    <td>Collection:</td>
                    <td><div className="AuthorTd">{getCollectionLink(asset.collection.collection_name)}</div></td>
                </tr>
                <tr>
                    <td>Schema:</td>
                    <td>{schema.schema_name}</td>
                </tr>
                <tr>
                    <td>Minted at:</td>
                    <td>{date}</td>
                </tr>
            </table>
        </div>
    );
};

export default AssetDetails;
