import React, {useEffect} from 'react';

function PreviewDetailsTable(props) {
    const asset = props['asset'];
    const update = props['update'];

    const visible = props['visible'];

    const {} = asset;
    let {
        asset_id, collection, owner, template, schema
    } = asset;
    
    const { issued_supply } = template;

    const { schema_name } = schema;

    useEffect(() => {
    }, [update['new_owner']]);

    return (
        <div className={visible ? "AssetPreviewInfo Show" : "AssetPreviewInfo Hidden"}>
            <h2>Details</h2>
            <table>
              <tbody>
                <tr>
                    <td><b>ID:</b></td>
                    <td>{asset_id}</td>
                </tr>
                <tr>
                    <td><b>Collection:</b></td>
                    <td>{collection['name']}</td>
                </tr>
                <tr>
                    <td><b>Schema:</b></td>
                    <td>{schema_name}</td>
                </tr>
                <tr>
                    <td><b>Owner:</b></td>
                    <td>{owner}</td>
                </tr>
                <tr>
                    <td><b>Issued Supply:</b></td>
                    <td>{issued_supply}</td>
                </tr>
              </tbody>
            </table>
        </div>
    );
}

export default PreviewDetailsTable;
