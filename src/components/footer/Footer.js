import React from 'react';
import Link from 'next/link';
import {TelegramIcon, TwitterIcon} from "react-share";
import cn from "classnames";

import config from '../../config.json';
import link from 'next/link';

const links = [{
    label: 'Explorer',
    href: '/explorer',
}, {
    label: 'Market',
    href: '/market',
}, {
    label: 'Collections',
     href: '/explorer?tab=collections',
}, {
    label: 'Assets',
    href: '/explorer?tab=assets',
}]

const companyLinks = [{
    label: 'FAQ',
    href: '/',
}, {
    label: 'Support',
    href: '/',
}, {
    label: 'LTMs',
    href: '/',
}, {
    label: 'Terms of Use',
    href: '/',
}, {
    label: 'Privacy',
    href: '/',
}]

function Footer(props) {

    const LinksList = () => {
        return links.map((link, idx) => <li className={cn(
            'mb-3',
        )} key={idx}>
            <Link href={link.href}>
                <a>{link.label}</a>
            </Link>
        </li>)
    }

    const CompanyList = () => {
        return companyLinks.map((link, idx) => <li className={cn(
            'mb-3',
        )} key={idx}>
            <Link href={link.href}>
                <a>{link.label}</a>
            </Link>
        </li>)
    }

    return (
        <div className={cn(
            'w-full bg-paper py-10 mt-16'
        )}>
            <div className={cn(
                'container mx-auto',
                'text-neutral font-bold text-base mb-4',
                'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12'
            )}>
                <div>
                    <h3 className={cn(
                        'text-primary text-2xl',
                    )}>{config.market_name}</h3>
                </div>

                <div>
                    <h4 className={cn(
                        'text-primary font-bold text-xl mt-2',
                    )}>Market Links</h4>
                    <ul className={cn(
                        'text-base font-normal',
                        'mt-4 mb-4'
                    )}>
                        <LinksList />
                    </ul>
                </div>

                <div>
                    <h4 className={cn(
                        'text-primary font-bold text-xl mt-2',
                    )}>Company Links</h4>
                    <ul className={cn(
                        'text-base font-normal',
                        'mt-4 mb-4'
                    )}>
                        <CompanyList />
                    </ul>
                </div>
                
                <div>
                    <h4 className={cn(
                        'text-primary text-xl mt-2',
                    )}>Connect with Us</h4>
                    <div className={cn(
                        'flex flex-row mt-5',
                        'text-neutral',
                    )}>
                        {config.telegram_link && 
                            <div className={cn('')}>
                                <a href={config.telegram_link} className={cn('text-neutral hover:text-primary transition-colors')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-telegram" viewBox="0 0 16 16">
                                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.287 5.906c-.778.324-2.334.994-4.666 2.01-.378.15-.577.298-.595.442-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294.26.006.549-.1.868-.32 2.179-1.471 3.304-2.214 3.374-2.23.05-.012.12-.026.166.016.047.041.042.12.037.141-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8.154 8.154 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629.093.06.183.125.27.187.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.426 1.426 0 0 0-.013-.315.337.337 0 0 0-.114-.217.526.526 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09z"/>
                                    </svg>
                                </a>
                            </div>
                        }
                        {config.discord_link &&
                            <div className={cn('ml-4')}>
                                <a href={config.discord_link} className={cn('text-neutral hover:text-primary transition-colors')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">
                                        <path d="M6.552 6.712c-.456 0-.816.4-.816.888s.368.888.816.888c.456 0 .816-.4.816-.888.008-.488-.36-.888-.816-.888zm2.92 0c-.456 0-.816.4-.816.888s.368.888.816.888c.456 0 .816-.4.816-.888s-.36-.888-.816-.888z"/>
                                        <path d="M13.36 0H2.64C1.736 0 1 .736 1 1.648v10.816c0 .912.736 1.648 1.64 1.648h9.072l-.424-1.48 1.024.952.968.896L15 16V1.648C15 .736 14.264 0 13.36 0zm-3.088 10.448s-.288-.344-.528-.648c1.048-.296 1.448-.952 1.448-.952-.328.216-.64.368-.92.472-.4.168-.784.28-1.16.344a5.604 5.604 0 0 1-2.072-.008 6.716 6.716 0 0 1-1.176-.344 4.688 4.688 0 0 1-.584-.272c-.024-.016-.048-.024-.072-.04-.016-.008-.024-.016-.032-.024-.144-.08-.224-.136-.224-.136s.384.64 1.4.944c-.24.304-.536.664-.536.664-1.768-.056-2.44-1.216-2.44-1.216 0-2.576 1.152-4.664 1.152-4.664 1.152-.864 2.248-.84 2.248-.84l.08.096c-1.44.416-2.104 1.048-2.104 1.048s.176-.096.472-.232c.856-.376 1.536-.48 1.816-.504.048-.008.088-.016.136-.016a6.521 6.521 0 0 1 4.024.752s-.632-.6-1.992-1.016l.112-.128s1.096-.024 2.248.84c0 0 1.152 2.088 1.152 4.664 0 0-.68 1.16-2.448 1.216z"/>
                                    </svg>
                                </a>
                            </div>
                        }
                        {config.twitter_link &&
                            <div className={cn('ml-4')}>
                                <a href={config.twitter_link} className={cn('text-neutral hover:text-primary transition-colors')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16">
                                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                                    </svg>
                                </a>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
