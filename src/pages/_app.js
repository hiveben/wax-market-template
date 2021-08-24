import 'react-dropdown/style.css';
import '../styles/Footer.css';
import '../styles/Search.css';
import '../styles/Collection.css';
import '../styles/Popup.css';
import '../styles/App.css';
import '../styles/Navigation.css';
import '../styles/AssetPreview.scss';
import '../styles/Buttons.css';
import '../styles/Market.scss';
import '../styles/globals.css';

import {withUAL, UALProvider} from "ual-reactjs-renderer";
import Footer from "../components/footer";
import Navigation from "../components/navigation/Navigation";
import {Anchor} from "ual-anchor";
import {Wax} from "@eosdacio/ual-wax";
import PopupWrapper from "../components/popups/PopupWrapper";
import {QueryClient, QueryClientProvider} from 'react-query'
import React, {useContext} from 'react';
import MarketWrapper, {Context} from "../components/marketwrapper";
import cn from "classnames";

import config from '../config.json';
import {post} from "../components/api/Api";

const queryClient = new QueryClient();

const waxNet = {
  chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
  rpcEndpoints: [{
    protocol: 'https',
    host: config.api_endpoint.replace('https://', '').replace('http://', ''),
    port: 443,
  }]
};

const anchor = new Anchor([waxNet], {
    appName: config.market_name
});

const wax = new Wax([waxNet], {
    waxSigningURL: config.api_endpoint,
    appName: config.market_name,
});

const wallets = [wax, anchor];

const parseCollections = (dispatch, res) => {
    if (res) {
        const data = res['data'];
        dispatch({ type: 'SET_COLLECTIONS', payload: data['rows'][0].collections });
    } else {
        dispatch({ type: 'SET_COLLECTIONS', payload: [] });
    }
};

const loadCollections = async (dispatch) => {
    const body = {
        'code': 'marketmapper',
        'index_position': 'primary',
        'json': 'true',
        'key_type': 'i64',
        'limit': 1,
        'reverse': 'false',
        'scope': 'marketmapper',
        'show_payer': 'false',
        'table': 'mappings',
        'lower_bound': config.market_name,
        'upper_bound': config.market_name,
        'table_key': ''
    };

    const url = config.api_endpoint + '/v1/chain/get_table_rows';

    return await post(url, body).then(res => parseCollections(dispatch, res));
}

function MyApp ({ Component, pageProps }) {

    const AppContainer = (props) => {
        const [ state, dispatch ] = useContext(Context);

        loadCollections(dispatch);

        return (
          <div
            className={cn(
              'fixed top-0 left-0 h-full w-full',
              'md:left-2',
              'text-center text-blue-700 font-medium',
            )}
          >
              <Navigation {...props} />
              <PopupWrapper {...props} />
              <Component {...props} />
              <Footer {...props} />
          </div>
        );
    };

    const AppWithUAL = withUAL(AppContainer);

    return (
        <MarketWrapper>
            <UALProvider chains={[waxNet]} authenticators={wallets} appName={config.market_name}>
                <QueryClientProvider client={queryClient}>
                    <AppWithUAL {...pageProps} />
                </QueryClientProvider>
            </UALProvider>
        </MarketWrapper>
    );
}

export default MyApp
