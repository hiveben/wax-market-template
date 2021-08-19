import React, {useState} from 'react';

import ErrorMessage from "./ErrorMessage";
import LoadingIndicator from "../loadingindicator/LoadingIndicator";
import config from "../../config.json";

function TransferPopup(props) {
    const asset = props['asset'];

    const {collection, schema, name, data, asset_id} = asset;

    const image = data['img'] ? data['img'].includes(
        'http') ? data['img'] : config.ipfs + data['img'] : '';

    const video = data['video'] ? data['video'].includes(
        'http') ? data['video'] : config.ipfs + data['video'] : '';

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};
    const activeUser = ual['activeUser'];

    const callBack = props['callBack'];
    const [receiver, setReceiver] = useState('');
    const [memo, setMemo] = useState('');

    const userName = activeUser ? activeUser['accountName'] : null;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const closeCallBack = props['closeCallBack'];

    const transfer = async () => {
        if (!receiver)
            return;
        closeCallBack();
        setIsLoading(true);

        try {
            await activeUser.signTransaction({
                actions: [{
                    account: 'atomicassets',
                    name: 'transfer',
                    authorization: [{
                        actor: userName,
                        permission: activeUser['requestPermission'],
                    }],
                    data: {
                        from: userName,
                        memo: memo,
                        asset_ids: [asset.asset_id],
                        to: receiver
                    },
                }]
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });
            callBack({transferred: true, receiver: receiver});
        } catch (e) {
            callBack({transferred: false, error: e.message});
            console.log(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const cancel = () => {
        callBack({transferred: false, receiver: null, offer: 0});
        closeCallBack();
    };

    const changeReceiver = (e) => {
        const val = e.target.value;
        setReceiver(val.trim().toLowerCase());
    };

    const changeMemo = (e) => {
        const val = e.target.value;
        setMemo(val);
    };

    return (
        <div className="Popup">
            <img className="CloseButton" onClick={cancel} src="/close_btn.svg" alt="X" />
            <div className="PopupTitle">{name}</div>
            <div className="PopupBody">
                <div className="PopupImage">
                    { video ?
                        <video width="190" height="190" loop autoPlay={true} muted={true} playsInline={true} poster={
                            image ? image : ''}>
                            <source src={video} />
                            Your browser does not support the video tag.
                        </video> :
                        <img src = {image} alt="None"/> }
                </div>
                <div className="PopupDetails">
                    <table>
                        <tbody>
                        <tr><td><b>Collection:</b></td><td>{collection['name']}</td></tr>
                        <tr><td><b>Schema:</b></td><td>{schema['schema_name']}</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="Info">{`Are you sure you want to transfer ${name} to ${receiver}?`}</div>
            {
                error ? <ErrorMessage error={error} /> : ''
            }
            <div className="Buttons">
                <div className="EditContainer">
                    <input className={"SellInput Memo"} type="text" onChange={changeReceiver} value={receiver ? receiver : ''} placeholder={'Receiver'}/>
                </div>
                <div className="EditContainer">
                    <input className={"SellInput Memo"} type="text" onChange={changeMemo} value={memo ? memo : ''} placeholder={'Memo'}/>
                </div>
                <div className="Buttons">
                    <button className="PopupCancelButton" onClick={cancel}>Cancel</button>
                    <button className="PopupSellButton" disabled={!receiver} onClick={transfer}>Transfer</button>
                </div>
            </div>

            {isLoading ? <div className="Overlay"><LoadingIndicator text="Loading Transaction"/></div> : '' }
        </div>
    );
}

export default TransferPopup;
