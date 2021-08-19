import React, {useEffect, useState} from 'react';

import Link from 'next/link';
import {post} from "../api/Api";
import {formatNumber} from "../helpers/Helpers";

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
            <Link href={'/'}>
                <div className="Logo">
                    <div><img src="/nfthive-logo.svg" alt="Worldwide Asset Explorer"/></div>
                </div>
            </Link>
            <div className="Links">
                <div className={"NavigationItem"}>
                    <Link  href={'/explorer'} className={"NextLink"}>
                        <div className="SubNav">Explorer</div>
                    </Link>
                </div>
                <div className={"NavigationItem"}>
                    <Link href={'/market'} className={"NextLink"}>
                        <div className="SubNav">Market</div>
                    </Link>
                </div>
                {
                    userName ?
                        <div className={"NavigationItem"}>
                            <Link href={'/inventory/' + userName} className={"NextLink"}>
                                <div className="SubNav">Inventory</div>
                            </Link>
                        </div> : ''
                }
                {
                    userName ?
                    <div className={"NavigationItem" } onClick={performLogin}>
                        <div className="SubNav">
                            <div>{userName}</div>{balance ? <div>{formatNumber(balance)} WAX</div> : ''}
                        </div>
                    </div> : <div className={"NavigationItem" } onClick={performLogin}>
                        <div className="Icon" >
                            <img src="/person-outline.svg" alt="Login" title={"Login"} />
                        </div>
                        <div className="SubNav">Login</div>
                    </div>
                }
            </div>
        </div>
    );
});

export default Navigation;
