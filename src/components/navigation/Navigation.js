import React, {useEffect, useState} from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router'
import {post} from "../api/Api";
import {formatNumber} from "../helpers/Helpers";
import cn from "classnames";

const Navigation = React.memo(props => {
    const router = useRouter()

    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const [balance, setBalance] = useState(null);

    const userName = ual['activeUser'] ? ual['activeUser']['accountName'] : null;

    const performLogin = async () => {
        ual.showModal();
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

    const getWaxBalance = async (name) => {
        const body = {
            'code': 'eosio.token',
            'index_position': 'primary',
            'json': 'true',
            'key_type': 'i64',
            'limit': 1,
            'reverse': 'false',
            'scope': name,
            'show_payer': 'false',
            'table': 'accounts',
            'table_key': ''
        };

        const url = 'https://api.hivebp.io/v1/chain/get_table_rows';

        post(url, body).then(res => parseWaxBalance(res));
    };

    useEffect(() => {
        getWaxBalance(userName);
    }, [userName]);

    return (
        <div className={cn(
            'Navigation w-full',
            'bg-page shadow-sm border-b border-paper',
            'z-50'
        )}>
            <div className={cn(
                'container h-20 w-full mx-auto',
                'flex flex-nowrap justify-between items-center',
            )}>
                <Link href={'/'}>
                    <div className={cn('h-12')}>
                        <img className={cn('Logo h-12')} src="/nfthive-logo.svg" alt="Worldwide Asset Explorer"/>
                    </div>
                </Link>
                <div className={cn(
                    'flex flex-nowrap items-center h-12',
                    'uppercase font-light',
                    'font-bold'
                )}>
                    <div className={cn(
                            'ml-7'
                        )}>
                        <Link href={'/explorer'}>
                            <span className={cn(
                                'cursor-pointer pb-2',
                                router.pathname.indexOf('/explorer') > -1 ? 'border-b-4 border-primary' : '',
                            )}>
                                Explorer
                            </span>
                        </Link>
                    </div>
                    <div className={cn(
                            'ml-7'
                        )}>
                        <Link href={'/market'}>
                            <span className={cn(
                                'cursor-pointer pb-2',
                                router.pathname.indexOf('/market') > -1 ? 'border-b-4 border-primary' : '',
                            )}>
                                Market
                            </span>
                        </Link>
                    </div>
                    {
                        userName ?
                            <div className={cn(
                                'ml-7'
                            )}>
                                <Link href={'/inventory/' + userName}>
                                    <span className={cn(
                                        'cursor-pointer pb-2',
                                        router.pathname.indexOf('/inventory') > -1 ? 'border-b-4 border-primary' : '',
                                    )}>
                                        Inventory
                                    </span>
                                </Link>
                            </div> : ''
                    }
                    {
                        userName ?
                        <div className={cn(
                            'ml-7'
                        )} onClick={performLogin}>
                            <div>{userName}</div>
                            { balance && 
                                <div className={cn(
                                    'font-light text-sm text-center'
                                )}>
                                    {formatNumber(balance)} WAX
                                </div>
                            }
                        </div> : <div className={cn(
                                'flex ml-7 cursor-pointer'
                            )} onClick={performLogin}>
                            <div className="Icon" >
                                <img src="/person-outline.svg" alt="Login" title={"Login"} />
                            </div>
                            <span className={cn(
                                'hover:underline cursor-pointer',
                            )}>
                                Login
                            </span>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
});

export default Navigation;
