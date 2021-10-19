import React, {Fragment, useEffect, useState} from 'react';
import { Menu, Transition } from '@headlessui/react'

import Link from '../common/util/input/Link';
import Logo from '../common/util/Logo';
import { useRouter } from 'next/router'
import {getRefundBalance, getWaxBalance} from "../api/Api";
import {formatNumber} from "../helpers/Helpers";
import cn from "classnames";

import LoadingIndicator from "../loadingindicator/LoadingIndicator";

const Navigation = React.memo(props => {
    const router = useRouter()

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(null);
    const [balance, setBalance] = useState(null);
    const [refundBalance, setRefundBalance] = useState(null);

    const activeUser = ual['activeUser'];
    const userName = activeUser ? activeUser['accountName'] : null;

    const performLogin = async () => {
        ual.showModal();
    };

    const performLogout = () => {
        ual.logout();
    };

    const parseWaxBalance = (res) => {
        if (res && res.status === 200) {
            let wax = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    wax += parseFloat(row['balance'].replace(' WAX', ''))
                });

            setBalance(wax);
        }
    };

    const parseRefundBalance = (res) => {
        if (res && res.status === 200) {
            let atomic = 0;
            const data = res.data;

            if (data && Object.keys(data).includes('rows'))
                data['rows'].map(row => {
                    if (Object.keys(row).includes('quantities'))
                        row['quantities'].map(quantity => {
                            if (quantity.includes(' WAX')) {
                                atomic += parseFloat(quantity.replace(' WAX', ''))
                            }
                        });
                });

            setRefundBalance(atomic);
        }
    };

    const claimRefund = async (quantity) => {
        try {
            setIsLoading(true);
            await activeUser.signTransaction({
                actions: [
                    {
                        account: 'atomicmarket',
                        name: 'withdraw',
                        authorization: [{
                            actor: userName,
                            permission: activeUser['requestPermission'],
                        }],
                        data: {
                            owner: userName,
                            token_to_withdraw: `${quantity.toFixed(8)} WAX`
                        },
                    }]
            }, {

                expireSeconds: 300, blocksBehind: 0,
            });
        } catch (e) {
            console.log(e);
        } finally {
            setTimeout(function () {
                getWaxBalance(userName).then(res => parseWaxBalance(res))
                getRefundBalance(userName).then(res => parseRefundBalance(res));
                setIsLoading(false);
            }, 2000);
        }
    }

    useEffect(() => {
        getWaxBalance(userName).then(res => parseWaxBalance(res));
        getRefundBalance(userName).then(res => parseRefundBalance(res));
    }, [userName]);

    return (
        <div className={cn(
            'fixed w-full h-16',
            'bg-page shadow-sm border-b border-paper',
            'z-50'
        )}>            
            <div className={cn(
                'relative container mx-auto py-2',
                'flex flex-row justify-between itmes-center',
                'gap-y-3',
            )}>
                <div className="flex md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        type="button"
                        className={cn(
                            'bg-paper bg-opacity-20 inline-flex items-center justify-center',
                            'p-2 rounded-md text-gray-400',
                            'hover:text-white hover:bg-gray-800',
                            'focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-primary'
                        )}
                        aria-controls="mobile-menu"
                        aria-expanded="false"
                    >
                        <span className="sr-only">Open main menu</span>
                        {!isOpen ? (
                        <svg
                            className="block h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                        ) : (
                        <svg
                            className="block h-6 w-6"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            aria-hidden="true"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        )}
                    </button>
                </div>
                <div className="pt-1">
                    <Logo />
                </div>
                <div className={cn(
                    'hidden lg:flex flex-row justify-between gap-y-1 gap-x-2 items-center',
                    'uppercase font-bold text-sm',
                    'lg:text-base lg:gap-x-4',
                )}>                    
                    <Link href={'/drops'}>
                        <span className={cn(
                            'pb-px md:pb-2',
                            router.pathname.indexOf('/drops') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Drops
                        </span>
                    </Link>
                    <Link href={'/market'}>
                        <span className={cn(
                            'pb-px md:pb-2',
                            router.pathname.indexOf('/market') > -1 || router.pathname === '/' ? 'border-b-4 border-primary' : '',
                        )}>
                            Marketplace
                        </span>
                    </Link>
                    <Link href={'/auctions'}>
                        <span className={cn(
                            'pb-px md:pb-2',
                            router.pathname.indexOf('/auctions') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Auction
                        </span>
                    </Link>
                    <Link href={'/explorer'}>
                        <span className={cn(
                            'pb-px md:pb-2',
                            router.pathname.indexOf('/explorer') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Yoshi Dailies
                        </span>
                    </Link>
                    <Link href={'/blends'}>
                        <span className={cn(
                            'pb-px md:pb-2',
                            router.pathname.indexOf('/blends') > -1 ? 'border-b-4 border-primary' : '',
                        )}>
                            Download Player
                        </span>
                    </Link>
                </div>
                {isLoading ? <LoadingIndicator /> : userName ?
                    <div className="w-auto flex justify-center items-center">
                        <div className="text-primary">
                            <Menu as="div" className="relative inline-block text-left">
                                <div>
                                    <Menu.Button
                                        className={cn(
                                            'flex flex-col items-center w-full px-1 py-px text-sm font-medium text-white bg-paper rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75',
                                            'border border-primary rounded-lg',
                                            'border-opacity-0 hover:border-opacity-75',
                                        )}
                                    >
                                        <div
                                            className={cn(
                                            'flex justify-center items-center',
                                            'px-1 py-px text-base'
                                        )}>
                                            <p>{userName}</p>
                                            <img src="/arrow-drop-down.svg" className="w-5 h-5" alt="arrow-down" />
                                        </div>

                                        { balance &&
                                            <div className={cn(
                                                'font-light text-sm text-center'
                                            )}>
                                                {formatNumber(balance)} WAX
                                            </div>
                                        }
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className={cn(
                                        'z-50 absolute right-0 w-36 mt-1 origin-top-right',
                                        'text-white',
                                        'bg-paper rounded-xl shadow-lg',
                                        'ring-1 ring-black ring-opacity-5 focus:outline-none'
                                    )}>
                                        <div className="py-4 text-center">
                                            <Menu.Item className={cn('mb-3')}>
                                                <Link href={'/inventory/' + userName}>
                                                    <span className={cn(
                                                        'pb-px',
                                                        'cursor-pointer',
                                                        'hover:text-primary transition-colors',
                                                        router.pathname.indexOf('/inventory') > -1 ? 'border-b-2 border-primary' : '',
                                                    )}>
                                                        Inventory
                                                    </span>
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item className={cn('mb-3')}>
                                                <Link href={'/bids/' + userName}>
                                                    <span className={cn(
                                                        'pb-px',
                                                        'cursor-pointer',
                                                        'hover:text-primary transition-colors',
                                                        router.pathname.indexOf('/bids') > -1 ? 'border-b-2 border-primary' : '',
                                                    )}>
                                                        Bids
                                                    </span>
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item className={cn('mb-3')}>
                                                <Link href={'/won/' + userName}>
                                                    <span className={cn(
                                                        'pb-px',
                                                        'cursor-pointer',
                                                        'hover:text-primary transition-colors',
                                                        router.pathname.indexOf('/won') > -1 ? 'border-b-2 border-primary' : '',
                                                    )}>
                                                        Won Auctions
                                                    </span>
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item className={cn('mb-3')}>
                                                <Link href={'/packs?user=' + userName}>
                                                    <span className={cn(
                                                        'pb-px',
                                                        'cursor-pointer',
                                                        'hover:text-primary transition-colors',
                                                        router.pathname.indexOf('/packs') > -1 ? 'border-b-2 border-primary' : '',
                                                    )}>
                                                        Boxes
                                                    </span>
                                                </Link>
                                            </Menu.Item>
                                            <Menu.Item className={cn('mt-3')}>
                                                <div onClick={performLogout}>
                                                    <span className={cn(
                                                        'cursor-pointer',
                                                        'hover:text-primary transition-colors',
                                                    )}>
                                                        Logout
                                                    </span>
                                                </div>
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                            { refundBalance ?
                            <div className={cn(
                                'font-light text-sm text-center'
                            )}>
                                <div className={cn('cursor-pointer')} onClick={() => claimRefund(refundBalance)}>
                                    Refund: {formatNumber(refundBalance)} WAX
                                </div>
                            </div> : '' }
                        </div>
                    </div>
                    :
                    <div
                        className={cn(
                            'flex justify-center items-center',
                            'cursor-pointer',
                        )}
                        onClick={performLogin}
                    >
                        <div className="mr-1" >
                            <img src="/person-outline.svg" className="w-5 h-5" alt="Login" title={"Login"} />
                        </div>
                        <span className={cn(
                            'hover:underline cursor-pointer uppercase font-bold',
                        )}>
                            Login
                        </span>
                    </div>
                }
            </div>
            <Transition
                show={isOpen}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
            {(ref) => (
                <div className="md:hidden" id="mobile-menu">
                    <div
                        ref={ref}
                        className={cn(
                        'flex flex-col gap-y-2 gap-x-2',
                        'uppercase font-bold text-base',
                        'px-8 pt-2 pb-3 space-y-1',
                        'bg-page shadow-sm border-b border-paper',
                        'w-screen h-screen',
                    )}>
                        <Link href={'/drops'}>
                            <span className={cn(
                                'pb-px md:pb-2',
                                router.pathname.indexOf('/drops') > -1 ? 'border-b-4 border-primary' : '',
                            )}>
                                Drops
                            </span>
                        </Link>
                        <Link href={'/market'}>
                            <span className={cn(
                                'pb-px md:pb-2',
                                router.pathname.indexOf('/market') > -1 || router.pathname === '/' ? 'border-b-4 border-primary' : '',
                            )}>
                                Marketplace
                            </span>
                        </Link>
                        <Link href={'/auctions'}>
                            <span className={cn(
                                'pb-px md:pb-2',
                                router.pathname.indexOf('/auctions') > -1 ? 'border-b-4 border-primary' : '',
                            )}>
                                Auction
                            </span>
                        </Link>
                        <Link href={'/explorer'}>
                            <span className={cn(
                                'pb-px md:pb-2',
                                router.pathname.indexOf('/explorer') > -1 ? 'border-b-4 border-primary' : '',
                            )}>
                                Yoshi Dailies
                            </span>
                        </Link>
                        <Link href={'/blends'}>
                            <span className={cn(
                                'pb-px md:pb-2',
                                router.pathname.indexOf('/blends') > -1 ? 'border-b-4 border-primary' : '',
                            )}>
                                Download Player
                            </span>
                        </Link>
                    </div>
                </div>
            )}
            </Transition>
        </div>
    );
});

export default Navigation;
