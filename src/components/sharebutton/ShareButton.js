import SharePopup from "../popups/SharePopup";
import React, {useState} from "react";


function ShareButton(props) {
    const link = props['link'];
    const type = props['type'];

    const [showPopup, setShowPopup] = useState(false);

    const share = async (show) => {
        setShowPopup(show);
    };

    return type === 'asset' ? (
        <div>
            <div className="MoreOptionsMenuButton" onClick={() => share(true)}>
                <div><img src="/share-outline.svg" alt="share"/></div>
                <div>Share</div>
            </div>
            {showPopup ? <SharePopup link={link} callBack={share}/> : '' }
        </div>) : (<div>
            <div className="ShareButton" onClick={() => share(true)}>
                <div><img src="/share-outline.svg" alt="share"/></div>
            </div>
            {showPopup ? <SharePopup link={link} callBack={share}/> : '' }
        </div>
    );
}

export default ShareButton;
