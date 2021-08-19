import React, {useEffect, useState} from 'react';

import LazyLoad from "react-lazy-load";

import Link from 'next/link';
import {formatPercentage, formatNumber1K} from "../helpers/Helpers";

function CollectionPreview(props) {
    const collectionItem = props['collection'];

    const {name, image, collection, verified, hasCollection, usdVolume, growth} = collectionItem;

    const ual = props['ual'] ? props['ual'] : {'activeUser': ''};

    useEffect(() => {

    }, []);

    let titleClass = "CollectionPreviewTitle NextLink";

    if (verified)
        titleClass += " verified";

    if (name && name.length > 25)
        titleClass += " Small";

    return (
        <LazyLoad>
            <div className={"CollectionPreview"}>
                <div className={"CollectionVolume"}>
                    <div className="Volume">${formatNumber1K(usdVolume)}</div>
                    <Link className='NextLink' href={`/stats?collection=${collection}`}><div className="VolumeIcon"><img src={'/collection_card/Vol_Chart_Icon.svg'}/></div></Link>
                    <div className={growth > 0 ? "Change Positive" : growth < 0 ? "Change Negative" : "Change Neutral"}>
                        {growth > 0 ? '+' : ''}{formatPercentage(growth)}
                    </div>
                </div>
                <Link className='NextLink' href={'/collection/' + collection}><div className={"CollectionPreviewImage NextLink"}>
                    <span className="Center"></span>
                    <img src={image} />
                </div></Link>
                <Link className='NextLink' href={'/collection/' + collection}><div className={titleClass}>{verified ? <div className="VerifiedIcons"><img src={"/asset_card/Wabe_winzig.svg"} /><img src={"/verified.svg"} /></div> : ''}<div>{name}</div></div></Link>
                <div className={"CollectionBar"}>
                    { hasCollection ?
                    <Link className='NextLink' href={'/ranking/' + collection}>
                        <div className={"Icon"} >
                                <div className="RankingButton CollectionButton">
                                <img src="/asset_card/Wabe_winzig.svg"/>
                                <img src="/ranking.svg" alt="Ranking" title={('navigation.ranking')} />
                            </div>
                        </div>
                    </Link> : '' }
                    <Link className='NextLink' href={'/market?collection=' + collection}>
                        <div className={"Icon"} >
                            <div className="CollectionDetailsButton CollectionButton">
                                <img src="/asset_card/Wabe_winzig.svg"/>
                                <img src="/shopping-cart-outline.svg" alt="Details" title={('search.market')} />
                            </div>
                        </div>
                    </Link>
                    { hasCollection ?
                    <Link className='NextLink' href={'/sets/' + collection}>
                        <div className={"Icon"} >
                            <div className="SetsButton CollectionButton">
                                <img src="/asset_card/Wabe_winzig.svg"/>
                                <img src="/grid-outline.svg" alt="Ranking" title={'Sets'} />
                            </div>
                        </div>
                    </Link> : '' }
                </div>
            </div>
        </LazyLoad>
    );
}

export default CollectionPreview;
