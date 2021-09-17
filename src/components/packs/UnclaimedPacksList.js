import React from 'react';
import cn from "classnames";

export default function UnclaimedPacksList() {

    return (
        <div className={cn('min-h-screen grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8')}>
            <div>
                Unclaimed Packs here!
            </div>
        </div>
    );
}