import React, { useState, useMemo } from 'react';
import './tableStyle.css';

const PaginatedTable = ({ data, columns, itemsPerPageOptions = [5, 10, 15], onEdit, onDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[0]);
    const [sortConfig, setSortConfig] = useState(null);
    const [draggedColumns, setDraggedColumns] = useState(columns);

    const sortedData = useMemo(() => {
        let sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [data, sortConfig]);

    const handleSort = (columnKey) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === columnKey && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key: columnKey, direction });
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (event) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, sortedData.length);

    // Pagination Logic
    const paginatedData = sortedData.slice(startIndex, endIndex);

    // Drag-and-Drop Handlers
    const handleDragStart = (index, event) => {
        event.dataTransfer.setData('text/plain', index);
    };

    const handleDrop = (index, event) => {
        event.preventDefault();
        const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'), 10);
        if (draggedIndex === index) return;

        const updatedColumns = [...draggedColumns];
        const [movedColumn] = updatedColumns.splice(draggedIndex, 1);
        updatedColumns.splice(index, 0, movedColumn);

        setDraggedColumns(updatedColumns);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    return (
        <div className="pagination-container">
            <table className="data-table">
                <thead>
                    <tr>
                        {draggedColumns.map((column, index) => (
                            <th
                                className='draggable'
                                key={column.key}
                                onClick={() => handleSort(column.key)}
                                draggable
                                onDragStart={(e) => handleDragStart(index, e)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(index, e)}
                            >
                                {column.label}
                                {sortConfig && sortConfig.key === column.key ? (
                                    sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'
                                ) : null}
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData.length === 0 ? (
                        <tr>
                            <td colSpan={draggedColumns.length + 1} style={{ textAlign: 'center' }}>
                                No records found
                            </td>
                        </tr>
                    ) : (
                        paginatedData.map((row) => (
                            <tr key={row.id}>
                                {draggedColumns.map((column) => (
                                    <td key={`${row.id}-${column.key}`}>{row[column.key]}</td>
                                ))}
                                {/* Edit and Delete Buttons */}
                                <td className='action-buttons'>
                                    <button className='button button-edit' onClick={() => onEdit(row)}>Edit</button>
                                    <button className='button button-delete' onClick={() => onDelete(row.id)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

            </table>
            {/* Pagination Controls */}
            <div className="pagination-controls">
                <div className="rows-per-page">
                    Rows per page:
                    <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                        {itemsPerPageOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="pagination-buttons">
                    <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>
                        {"<<"}
                    </button>
                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                        {"<"}
                    </button>
                    <span>
                        {startIndex + 1}{" – "}{endIndex} of {sortedData.length}
                    </span>
                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                        {">"}
                    </button>
                    <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>
                        {">>"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaginatedTable;
