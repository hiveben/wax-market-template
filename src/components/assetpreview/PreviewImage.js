import React from "react";
import config from "../../config.json";


function PreviewImage(props) {
    const index = props['index'];
    const asset = props['asset']

    const {
        data, template
    } = asset;

    const { template_id } = template;

    const image = data['img'] ? data['img'].includes(
        'http') ? data['img'] : config.ipfs + data['img'] : '';
    let video = data['video'] ? data['video'].includes(
        'http') ? data['video'] : config.ipfs + data['video'] : '';

    if (data && Object.keys(data).includes('video')) {
        video = data['video'].includes('http') ? data['video'] : config.ipfs + data['video'];
    }

    return (
        <div className="PreviewImage">
            { video ?
                <video id={'video'+index} width="190" height="190" loop autoPlay={true} muted={true} playsInline={true} poster={image ? image : ''}>
                    <source src={`https://ipfs.hivebp.io/media/${template_id}`} />
                    Your browser does not support the video tag.
                </video> :
                <img src = {`https://ipfs.hivebp.io/media/${template_id}`}/> }
        </div>
    );
}

export default PreviewImage;