
import React from 'react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  className?: string;
  width?: string;
}

interface GridProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
}

const Grid = <T extends { id: string | number }>({ 
  data, 
  columns, 
  onRowClick, 
  isLoading,
  emptyMessage = 'Nenhum dado encontrado.'
}: GridProps<T>) => {
  return (
    <div className="w-full overflow-x-auto border border-gray-100 rounded-xl bg-white shadow-sm custom-scrollbar">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            {columns.map((col, index) => (
              <th 
                key={index}
                className={`px-4 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest ${col.className || ''}`}
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((_, j) => (
                  <td key={j} className="px-4 py-4">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map((item) => (
              <tr 
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-blue-50/30' : ''}`}
              >
                {columns.map((col, index) => (
                  <td 
                    key={index}
                    className={`px-4 py-3.5 text-sm font-medium text-gray-700 ${col.className || ''}`}
                  >
                    {typeof col.accessor === 'function' 
                      ? col.accessor(item) 
                      : (item[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-400 text-sm font-medium">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Grid;
