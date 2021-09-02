import React from "react";
import cn from "classnames";

function TabItem(props) {
    const {title, tabKey, target} = props;

    return (
        <div
            className={cn(
                'flex overflow-hidden',
                'height-tab leading-tab',
                'height-tab w-8',
                'text-white text-lg text-center no-underline opacity-85',
                'transition-opacity duration-500',
                'hover:text-white hover:opacity-100',
                'selected:text-white selected:opacity-100',
                {'opacity-100': tabKey === target},
            )}
        >
            <div>{title}</div>
        </div>
    );
}

export default TabItem;
