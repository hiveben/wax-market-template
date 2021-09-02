import React from 'react';

import config from '../../config.json';
import cn from "classnames";

function Pagination(props) {
    const currentPage = props['page'];
    const setPage = props['setPage'];
    const items = props['items'];

    if (items && items.length === config.limit || currentPage > 2)
        return (
            <div className="cursor-pointer justify-between flex h-4 mr-4 mb-3 pb-16 ml-auto text-neutral font-light text-sm">
                <div>
                    <h3 className={cn(
                            'text-neutral font-light text-xl mb-4'
                        )}
                    >
                        {items.length.toLocaleString()} Results
                    </h3>
                </div>
                <div className={cn(
                        'flex'
                    )}
                >
                    {currentPage > 1 ? <div className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" onClick={() => setPage(1)}>&lt;&lt;</div> : '' }
                    {currentPage > 2 ? <div className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" onClick={() => setPage(currentPage - 1)}>&lt;</div> : '' }
                    {currentPage > 1 ? <div className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium" onClick={() => setPage(currentPage - 1)}>{currentPage - 1}</div> : '' }
                    <div key={`Pagination${currentPage}`} className={currentPage === currentPage ? 'active' : ''}
                        onClick={() => setPage(currentPage)}>{currentPage}
                    </div>
                    {items.length === config.limit ? <div onClick={() => setPage(currentPage + 1)}>{currentPage + 1}</div> : '' }
                    {items.length === config.limit ? <div onClick={() => setPage(currentPage + 1)}>&gt;</div> : '' }
                </div>
            </div>
        );
    else
        return (
            <div className="flex text-right justify-evenly w-1/2 h-4 mr-4 mb-4 ml-auto text-blue-700">
            </div>
        );
}

export default Pagination;