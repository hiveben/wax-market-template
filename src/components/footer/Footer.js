import React from 'react';
import cn from "classnames";

import {TelegramIcon, TwitterIcon} from "react-share";

import config from '../../config.json';

function Footer(props) {
    return (
        <div className={cn(
            'absolute w-full t-footer h-6 leading-6 my-auto',
            'flex justify-between',
            'text-xs text-blue-700 bg-gray-800',
            'border border-solid border-blue-700'
        )}>
            {config.telegram_link ? <div className="w-5 h-5 -top-px m-auto"><a href={config.telegram_link}>
                <TelegramIcon
                    bgStyle={{"fill-opacity": "0.0"}}
                    iconFillColor="#1235ba"
                    size="22px"
                />
            </a></div> : ''}
            {config.discord_link ? <div className="DiscordLink"><a className="no-underline text-blue-700 leading-6" href={config.discord_link}>
                <img className="h-5 m-auto" src={'/discord.svg'} alt={'Discord'} />
            </a></div> : ''}
            {config.twitter_link ? <div className="w-5 h-5 -top-1"><a className="no-underline text-blue-700 leading-6" href={config.twitter_link}>
                <TwitterIcon
                    bgStyle={{"fill-opacity": "0.0"}}
                    iconFillColor="#1235ba"
                    size="26px"
                />
            </a></div> : '' }
        </div>
    );
}

export default Footer;
