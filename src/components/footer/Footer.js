import React from 'react';

import {TelegramIcon, TwitterIcon} from "react-share";

import config from '../../config.json';

function Footer(props) {
    return (
        <div className="Footer">
            {config.telegram_link ? <div className="TelegramLink"><a href={config.telegram_link}>
                <TelegramIcon
                    bgStyle={{"fill-opacity": "0.0"}}
                    iconFillColor="#1235ba"
                    size="22px"
                />
            </a></div> : ''}
            {config.discord_link ? <div className="DiscordLink"><a href={config.discord_link}>
                <img src={'/discord.svg'} alt={'Discord'} />
            </a></div> : ''}
            {config.twitter_link ? <div className="TwitterLink"><a href={config.twitter_link}>
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
