import React from "react";

function TabItem(props) {
    const {title, tabKey, target} = props;

    return (
        <div className={`TabItem ${tabKey === target ? "Active" : "Inactive"}`}>
            <img className={"Icon"} src={tabKey === target ? "/radio-button-on.svg" : "/radio-button-off.svg"}/>
            <div>{title}</div>
        </div>
    );
}

export default TabItem;
