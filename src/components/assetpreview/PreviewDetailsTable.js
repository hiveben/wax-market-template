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
        <div className={visible ? "relative h-80 w-full overflow-y-auto" : "hidden"}>
            <h2 className="text-blue-700 mb-0 text-base">Details</h2>
            <table className="w-48">
              <tbody>
                <tr>
                    <td className="text-white w-24 text-left text-xs"><b>ID:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{asset_id}</td>
                </tr>
                <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Collection:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{collection['name']}</td>
                </tr>
                <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Schema:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{schema_name}</td>
                </tr>
                <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Owner:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{owner}</td>
                </tr>
                <tr>
                    <td className="text-white w-24 text-left text-xs"><b>Issued Supply:</b></td>
                    <td className="text-white max-w-td text-right text-xs leading-4">{issued_supply}</td>
                </tr>
              </tbody>
            </table>
        </div>
    );
}

export default PreviewDetailsTable;
