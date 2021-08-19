import React from 'react';

import config from '../../config.json';

function Pagination(props) {
    const currentPage = props['page'];
    const setPage = props['setPage'];
    const items = props['items'];

    if (items && items.length === config.limit || currentPage > 2)
        return (
            <div className="Pagination">
                {currentPage > 1 ? <div onClick={() => setPage(1)}>&lt;&lt;</div> : '' }
                {currentPage > 2 ? <div onClick={() => setPage(currentPage - 1)}>&lt;</div> : '' }
                {currentPage > 1 ? <div onClick={() => setPage(currentPage - 1)}>{currentPage - 1}</div> : '' }
                <div key={`Pagination${currentPage}`} className={currentPage === currentPage ? 'active' : ''}
                     onClick={() => setPage(currentPage)}>{currentPage}
                </div>
                {items.length === config.limit ? <div onClick={() => setPage(currentPage + 1)}>{currentPage + 1}</div> : '' }
                {items.length === config.limit ? <div onClick={() => setPage(currentPage + 1)}>&gt;</div> : '' }
            </div>
        );
    else
        return (
            <div className="Pagination">
            </div>
        );
}

export default Pagination;