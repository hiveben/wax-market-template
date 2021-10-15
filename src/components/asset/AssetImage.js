import React, {useEffect, useState} from 'react';
import cn from "classnames";
import config from '../../config.json';

const AssetImage = (props) => {

    const [imagePosition, setImagePosition] = useState(0);
    const [videoPlayer, setVideoPlayer] = useState(null);

    const asset = props['asset'];

    const data = 'data' in asset ? asset['data'] : asset['immutable_data'];

    const asset_id = asset['asset_id'];

    const img = data['img'] ? data['img'].includes(
        'http') ? data['img'] : config.ipfs + data['img'] : '';
    let video = data['video'] ? data['video'].includes(
        'http') ? data['video'] : config.ipfs + data['video'] : '';
    const img_back = data['img_back'] ? data['img_back'].includes(
        'http') ? data['img_back'] : config.ipfs + data['img_back'] : '';

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

    if (img_back) {
        media.push(img_back);
        mediaFormats.push('image');
    }

    useEffect(() => {
        if (imagePosition >= media.length) {
            setImagePosition(0);
        }
        if (mediaFormats[imagePosition] === 'video') {
            setVideoPlayer(
                <video width="400" height="400" controls autoPlay={true} muted={true}>
                    <source src={media[imagePosition].includes('http') ? media[imagePosition] : config.ipfs + media[imagePosition]} />
                    Your browser does not support the video tag.
                </video>
            );
        }
    }, [asset_id, imagePosition, img]);

    return (
        <div className="relative flex justify-center asset-img w-full h-auto border p-4 pb-16 border-none">
            {
                mediaFormats[imagePosition] === 'video' && videoPlayer ? videoPlayer :
                    <img className="max-w-full max-h-img-asset m-auto" src={media[imagePosition].includes('http') ? media[imagePosition] : config.ipfs + media[imagePosition]} alt="none"/>
            }
            <div className="absolute flex justify-evenly w-full bottom-5 t-img-btn">
                {
                    media.map((image, index) =>
                        media.length > 1 ? (<div className="h-6 text-base align-middle text-white cursor-pointer bg-transparent outline-none border-none" onClick={
                            () => {setImagePosition(index);}}>
                            <div
                                className={cn(
                                    'inline-block rounded-full',
                                    'h-6 w-6',
                                    {
                                        'bg-primary' : index === imagePosition,
                                        'bg-white' : index !== imagePosition,
                                    }
                                )}
                            >
                            </div>
                            <span className={cn('inline-block ml-3 text-sm text-neutral')}>
                                {mediaFormats[index] === 'image' ? 'Image' : 'Video'}
                            </span>
                        </div>) : ''
                    )
                }
            </div>
        </div>
    );
};

export default AssetImage;
