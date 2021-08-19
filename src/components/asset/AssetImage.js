import React, {useEffect, useState} from 'react';
import config from '../../config.json';

const AssetImage = (props) => {

    const [imagePosition, setImagePosition] = useState(0);
    const [videoPlayer, setVideoPlayer] = useState(null);

    const asset = props['asset'];

    console.log(asset);

    const {data, asset_id} = asset;

    const {img, backimg, video} = data;

    const media = [];
    const mediaFormats = [];

    if (video) {
        media.push(video);
        mediaFormats.push('video');
    }

    if (img) {
        media.push(img);
        mediaFormats.push('image');
    }

    if (backimg) {
        media.push(backimg);
        mediaFormats.push('image');
    }

    useEffect(() => {
        if (imagePosition >= media.length) {
            setImagePosition(0);
        }
        if (mediaFormats[imagePosition] === 'video') {
            setVideoPlayer(
                <video width="400" height="400" controls autoPlay={true} muted={false}>
                    <source src={config.ipfs + media[imagePosition]} />
                    Your browser does not support the video tag.
                </video>
            );
        }
    }, [asset_id, imagePosition, img]);

    console.log(config.ipfs + media[imagePosition]);

    return (
        <div className="AssetImage">
            {
                mediaFormats[imagePosition] === 'video' && videoPlayer ? videoPlayer :
                    <img src={config.ipfs + media[imagePosition]} alt="none"/>
            }
            <div className="ImageButtons">
                {
                    media.map((image, index) =>
                        media.length > 1 ? (<div className="AssetNextButtons" onClick={
                            () => {setImagePosition(index);}}>
                            <img className={"Icon"} src={
                                index === imagePosition ? "/radio-button-on.svg" : "/radio-button-off.svg"}/>
                        </div>) : ''
                    )
                }
            </div>
        </div>
    );
};

export default AssetImage;
