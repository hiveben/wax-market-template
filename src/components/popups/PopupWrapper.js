import React, {useContext, useEffect, useRef} from 'react';

import SellPopup from "./SellPopup";
import BuyPopup from "./BuyPopup";
import TransferPopup from "./TransferPopup";
import { Context } from "../marketwrapper";

function PopupWrapper(props) {
    const ual = props['ual'] ? props['ual'] : {'activeUser': null};

    const [ state, dispatch ] = useContext(Context);

    const asset = state.asset;
    const action = state.action;
    const callBack = state.callBack;

    function useOutsideAlerter(ref, callBack) {
      useEffect(() => {
        /**
         * Alert if clicked on outside of element
         */
        function handleClickOutside(event) {
          if (ref.current && !ref.current.contains(event.target) && event.target['className'] !== 'Dropdown-option'
              && event.target['className'] !== 'Dropdown-option is-selected' && event.target['className'] !== 'ErrorIcon'
              && event.target['className'] !== 'ErrorMessage' && event.target['className'] !== 'ErrorItem') {
              dispatch({ type: 'SET_ACTION', payload: '' });
              callBack();
              event.preventDefault();
              event.stopPropagation();
          }
        }
        // Bind the event listener
        document.addEventListener("click", handleClickOutside);
        return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("click", handleClickOutside);
        };
      }, [ref]);
    }

    function OutsideAlerter(props) {
      const wrapperRef = useRef(null);
      const callBack = props['callBack'];
      useOutsideAlerter(wrapperRef, callBack);

      return <div ref={wrapperRef}>{props.children}</div>;
    }

    const sellWindow = <OutsideAlerter
                callBack={callBack}
            >
            <div  className="PopupWrapper">
                <SellPopup

                    asset={asset}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasListed, e=null, asset_id=null) => {
                        callBack(wasListed);
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                    error: e,
                                    asset_id: asset_id
                            }});
                        }
                    }}
                />
            </div>
        </OutsideAlerter>;

    const buyWindow = <OutsideAlerter
                callBack={callBack}
            >
            <div  className="PopupWrapper">
                <BuyPopup
                    listing={asset}
                    ual={ual}
                    closeCallBack={() => {
                        dispatch({ type: 'SET_ACTION', payload: '' });
                    }}
                    callBack={(wasBought, e=null, asset_id=null) => {
                        callBack(wasBought);
                        if (e) {
                            dispatch({ type: 'SET_ERROR', payload: {
                                    error: e,
                                    asset_id: asset_id
                            }});
                        }
                    }}
                />
            </div>
        </OutsideAlerter>;

    const transferWindow = <OutsideAlerter
        callBack={callBack}
    >
        <div  className="PopupWrapper">
            <TransferPopup
                asset={asset}
                ual={ual}
                closeCallBack={() => {
                    dispatch({ type: 'SET_RECEIVER', payload: '' });
                    dispatch({ type: 'SET_ACTION', payload: '' });
                }}
                callBack={(wasTransferred, receiver, e=null, asset_id=null) => {
                    callBack(wasTransferred, receiver);
                    dispatch({ type: 'SET_RECEIVER', payload: '' });
                    if (e) {
                        dispatch({ type: 'SET_ERROR', payload: {
                                error: e,
                                asset_id: asset_id
                            }});
                    }
                }}
            />
        </div>
    </OutsideAlerter>;

    useEffect(() => {
    }, [action]);

    return (
        <div className="PopupWrapper">
            {action === 'buy' ? buyWindow : ''}
            {action === 'sell' ? sellWindow : ''}
            {action === 'transfer' ? transferWindow : ''}
        </div>
    );
}

export default PopupWrapper;
