import React from "react";
import Dropdown from "react-dropdown";
import cn from "classnames";

const DropdownItem = ({header, options, onChange, value}) => {
    return (
    <div className={cn(
        "relative w-40 h-9 inline-block m-0",
        "lg:h-9 lg:mr-4 lg:ml-4 lg:mt-2 lg:mb-1",
        "bg-gray-600 rounded-3xl",
        "border-2 border-solid border-blue-600"
    )}>
        <div className="absolute text-white text-xs opacity-80 left-3 top-0">{header}</div>
        <Dropdown
            options={options}
            onChange={onChange}
            value={value}
            placeholder={header}
            id="DropdownField4"
        />
    </div>
    );
}

export default DropdownItem;