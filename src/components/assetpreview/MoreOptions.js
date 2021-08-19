import ShareButton from "../sharebutton/ShareButton";
import React, {useContext, useState} from "react";
import {Context} from "../marketwrapper";


function MoreOptions(props) {
    const showMenu = props['showMenu'];
    const setShowMenu = props['setShowMenu'];
    const asset = props['asset'];

    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};
    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const [ state, dispatch ] = useContext(Context);

    const handleTransfer = props['handleTransfer'];
    const transferred = props['transferred'];
    const listed = props['listed'];
    const setIsLoading = props['setIsLoading'];

    const {sale_id, asset_id} = asset;

    const transfer = async () => {
        setIsLoading(true);
        dispatch({ type: 'SET_ASSET', payload: asset });
        dispatch({ type: 'SET_CALLBACK', payload: (sellInfo) => handleTransfer(sellInfo) });
        dispatch({ type: 'SET_ACTION', payload: 'transfer' });
    };

    const transferrable = !listed && !transferred && asset['owner'] === userName && asset_id;

    return (
        <div className={`MoreOptions ${showMenu ? 'Show' : 'Hide'}`} onMouseLeave={() => setShowMenu(false)}>
            <ShareButton type={'asset'} link={'https://nfthive.io' + (sale_id ? `/sale/${sale_id}` : `/asset/${asset_id}`)} />
            {
                transferrable ?
                    <div className={"MoreOptionsMenuButton"} onClick={transfer}>
                        <div><img src="/diagonal-arrow-right-up-outline.svg" alt="Transfer"/></div>
                        <div>Transfer</div>
                    </div> : ''
            }
        </div>
    );
}

export default MoreOptions;
