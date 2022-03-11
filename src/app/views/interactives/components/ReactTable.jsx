import React, {useEffect} from 'react'
import { useTable, usePagination } from 'react-table'
import { store } from "../../../config/store";

import {Link} from "react-router";

const rootPath = store.getState().state.rootPath;

function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0 },
        },
        usePagination
    )

    useEffect(() => {
        setPageSize(5)
    }, []);

    // Render the UI for your table
    return (
        <>
      {/*<pre>*/}
      {/*  <code>*/}
      {/*    {JSON.stringify(*/}
      {/*        {*/}
      {/*            pageIndex,*/}
      {/*            pageSize,*/}
      {/*            pageCount,*/}
      {/*            canNextPage,*/}
      {/*            canPreviousPage,*/}
      {/*        },*/}
      {/*        null,*/}
      {/*        2*/}
      {/*    )}*/}
      {/*  </code>*/}
      {/*</pre>*/}
            <table {...getTableProps()}>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()}>
                                    <div>
                                        <Link to={`${rootPath}/interactives/edit/${cell.value[3]}`} className={'table-link'}>
                                            {cell.value[1]}
                                        </Link>
                                    </div>
                                    <div className={"metas"}>
                                        <span>
                                            {cell.value[0]}
                                        </span>
                                        <Link>
                                            {cell.value[2]}
                                        </Link>
                                    </div>
                                </td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </table>
            {/*
                Pagination can be built however you'd like.
                This is just a very basic UI implementation:
              */}
            <span className={"pageCounter"}>
                Page{' '}
                <strong>
                    {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
            </span>
            <div className="pagination">
                {/*<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>*/}
                {/*    {'<<'}*/}
                {/*</button>{' '}*/}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'Previous'}
                </button>{' '}
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'Next'}
                </button>{' '}
                {/*<button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>*/}
                {/*    {'>>'}*/}
                {/*</button>{' '}*/}
            </div>
        </>
    )
}

export function ReactTable(props) {
    const columns = React.useMemo(
        () => [
            {
                Header: 'data',
                columns: [
                    {
                        Header: 'data',
                        accessor: 'data',
                    }
                ],
            },
        ],
        []
    )

    const data = props.data

    return (
        <Table columns={columns} data={data} />
    )
}
