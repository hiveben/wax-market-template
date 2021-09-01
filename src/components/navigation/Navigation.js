import React, {useEffect, useState} from 'react';

import Logo from "../common/util/Logo";
import Icon from "../common/util/input/Icon"
import NavigationItem from './NavigationItem';
import {post} from "../api/Api";
import {formatNumber} from "../helpers/Helpers";
import cn from 'classnames'

const Navigation = React.memo(props => {
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
        <div className={"Navigation"}>
            <Logo />
            <div className="Links">
                <NavigationItem href={'/explorer'} navName="Explorer" />
                <NavigationItem href={'/market'} navName="Market" />
                {userName ? <NavigationItem href={'/inventory/' + userName} navName="Inventory" /> : ''}
                {
                    userName ?
                    <div 
                        className={cn(
                        'relative flex leading-10 h-10 my-auto mx-1',
                        'cursor-pointer lg:mx-5',
                        )}
                        onClick={performLogin}
                    >
                        <div className="w-full text-blue-700 text-xxs lg:text-xs">
                            <div>{userName}</div>{balance ? <div>{formatNumber(balance)} WAX</div> : ''}
                        </div>
                    </div>
                    :
                    <div 
                        className={cn(
                        'relative flex justify-center items-center leading-10 h-10 my-auto mx-1',
                        'cursor-pointer lg:mx-5',
                        )}
                        onClick={performLogin}
                    >
                        <Icon>
                            <img className="w-5 h-5" src="/person-outline.svg" alt="Login" title={"Login"} />
                        </Icon>
                        <div className="w-full text-blue-700 text-xxs lg:text-xs">Login</div>
                    </div>
                }
            </div>
        </div>
    );
});

export default Navigation;
