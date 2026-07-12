import React from 'react';

// Reusable DataTable component
export const DataTable = ({ columns, data, onRowClick, emptyMessage = 'No data available' }) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-lg py-md font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider ${col.align || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-lg py-md text-center text-on-surface-variant">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className={`px-lg py-md ${col.align || ''}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Reusable Pagination component
export const TablePagination = ({ currentPage, totalPages, onPageChange, showing, total }) => {
  const pages = [];
  const maxVisible = 5;

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="px-lg py-md flex items-center justify-between border-t border-outline-variant bg-surface-container-lowest">
      <p className="font-body-sm text-on-surface-variant">
        Showing <span className="font-semibold">{showing?.start || 1}</span> to{' '}
        <span className="font-semibold">{showing?.end || total}</span> of{' '}
        <span className="font-semibold">{total}</span> entries
      </p>
      <div className="flex gap-xs">
        <button
          className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
        {start > 1 && (
          <>
            <button
              className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              onClick={() => onPageChange(1)}
            >
              1
            </button>
            {start > 2 && <span className="px-sm py-sm text-on-surface-variant">...</span>}
          </>
        )}
        {pages.map((page) => (
          <button
            key={page}
            className={`px-md py-sm border rounded-lg transition-colors font-body-sm ${
              page === currentPage
                ? 'bg-primary text-on-primary border-primary'
                : 'border-outline-variant text-on-surface-variant hover:bg-surface-container'
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="px-sm py-sm text-on-surface-variant">...</span>}
            <button
              className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              onClick={() => onPageChange(totalPages)}
            >
              {totalPages}
            </button>
          </>
        )}
        <button
          className="px-md py-sm border border-outline-variant rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <span className="material-symbols-outlined text-[18px]">chevron_right</span>
        </button>
      </div>
    </div>
  );
};

export default DataTable;