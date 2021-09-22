import React from 'react';
import cn from "classnames";

import Filters from "../filters/Filters";
import ResultCard from "./ResultCard";

function ResultList(props) {

    const results = props['results'];

    return (
        <div className={cn('w-full grid grid-cols-8 gap-10')}>
            <div
                className={cn(
                    'col-span-8 sm:col-span-6',
                )}
            >
                {
                    <div
                        className={cn(
                            "relative w-full mb-24",
                            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                        )}
                    >
                        {
                            results.map((template, index) =>
                                <ResultCard
                                    {...props}
                                    index={index}
                                    template={template}
                                />
                            )
                        }
                    </div> }
            </div>
        </div>
    );
}

export default ResultList;
