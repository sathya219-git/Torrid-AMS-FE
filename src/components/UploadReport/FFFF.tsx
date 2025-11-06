<div className="table-container-file-upload ">
                        <table>
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th onClick={() => handleSort("name")}>
                                        Name {sortBy === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                    </th>
                                    <th onClick={() => handleSort("filename")}>
                                        File Name {sortBy === "filename" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                    </th>
                                    <th onClick={() => handleSort("filesize")}>
                                        File Size {sortBy === "filesize" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                    </th>
                                    <th onClick={() => handleSort("state")}>
                                        State {sortBy === "state" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                    </th>
                                    <th onClick={() => handleSort("updatedtime")}>
                                        Updated Time & Date {sortBy === "updatedtime" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {data.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{(pagination.page - 1) * pagination.pageSize + idx + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.filename}</td>
                                        <td>{item.filesize}</td>
                                        <td>{item.state}</td>
                                        <td>{item.updatedtime}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="pagination">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => handlePageChange("prev")}
                            >
                                ◀ Prev
                            </button>

                            <span>
                                Page {pagination.page} of {pagination.totalPages} | Total Records:{" "}
                                {pagination.totalRecords}
                            </span>

                            <button
                                disabled={pagination.page === pagination.totalPages}
                                onClick={() => handlePageChange("next")}
                            >
                                Next ▶
                            </button>
                        </div>
                    </div>