'use client'
import CustomTextField from '@/@core/components/mui/TextField'
import { UserInvitation } from '@/api/interface/userInterface'
import TablePaginationComponent from '@/components/TablePaginationComponent'

// Utils
import { Grid } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Checkbox from '@mui/material/Checkbox'
import MenuItem from '@mui/material/MenuItem'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
// TanStack Utilities
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
// TanStack Table
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
// Other
import classnames from 'classnames'
import { useState, useMemo } from 'react'

type InvitationsProps = {
  invitationData: UserInvitation[]
}
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)
  // Store the itemRank info
  addMeta({
    itemRank
  })
  // Return if the item should be filtered in/out
  return itemRank.passed
}
// Column Definitions
const columnHelper = createColumnHelper<UserInvitation>()
const Invitations = ({ invitationData }: InvitationsProps) => {
  const [rowSelection, setRowSelection] = useState({})

  const [globalFilter, setGlobalFilter] = useState('')

  const columns = useMemo<ColumnDef<UserInvitation, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler()
            }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler()
            }}
          />
        )
      },
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography>{row.original.email}</Typography>
      }),
      columnHelper.accessor('company', {
        header: 'Company',
        cell: ({ row }) => (
          <div className='flex items-center gap-3'>
            <div className='flex flex-col'>
              <Typography className='font-medium' color='text.primary'>
                {row?.original?.companyDetail?.name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: ({ row }) => <Typography>{row?.original?.roleDetail?.role}</Typography>
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => <Typography>{row?.original?.status}</Typography>
      }),
      columnHelper.accessor('expiresAt', {
        header: 'expires',
        cell: ({ row }) => <Typography> {new Date(row?.original?.expiresAt).toLocaleString()}</Typography>
      }),
      columnHelper.accessor('createdAt', {
        header: 'created',
        cell: ({ row }) => <Typography>{new Date(row?.original?.createdAt).toLocaleString()}</Typography>
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [invitationData]
  )
  const table = useReactTable({
    data: invitationData as UserInvitation[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true, //enable row selection for all rows
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <Grid>
      <Grid
        sx={{
          gridColumn: {
            xs: 'span 12', // 12 columns on small screens
            sm: 'span 6', // 6 columns on medium screens
            md: 'span 3' // 3 columns on large screens
          }
        }}
      >
        <Card>
          <CardContent className='flex justify-between flex-col items-start md:items-center md:flex-row gap-4'>
            <div className='flex flex-col sm:flex-row items-center justify-between gap-4 is-full sm:is-auto'>
              <div className='flex items-center gap-2 is-full sm:is-auto'>
                <Typography className='hidden sm:block'>Show</Typography>
                <CustomTextField
                  select
                  value={table.getState().pagination.pageSize}
                  onChange={e => table.setPageSize(Number(e.target.value))}
                  className='is-[70px] max-sm:is-full'
                >
                  <MenuItem value='10'>10</MenuItem>
                  <MenuItem value='25'>25</MenuItem>
                  <MenuItem value='50'>50</MenuItem>
                </CustomTextField>
              </div>
            </div>
          </CardContent>
          <div className='overflow-x-auto'>
            <table
            // className={tableStyles.table}
            >
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <th key={header.id}>
                        {header.isPlaceholder ? null : (
                          <>
                            <div
                              className={classnames({
                                'flex items-center': header.column.getIsSorted(),
                                'cursor-pointer select-none': header.column.getCanSort()
                              })}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: <i className='tabler-chevron-up text-xl' />,
                                desc: <i className='tabler-chevron-down text-xl' />
                              }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                            </div>
                          </>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                      No data available
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {table
                    .getRowModel()
                    .rows.slice(0, table.getState().pagination.pageSize)
                    .map(row => {
                      return (
                        <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                          ))}
                        </tr>
                      )
                    })}
                </tbody>
              )}
            </table>
          </div>
          <TablePagination
            component={() => <TablePaginationComponent table={table} />}
            count={table.getFilteredRowModel().rows.length}
            rowsPerPage={table.getState().pagination.pageSize}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, page) => {
              table.setPageIndex(page)
            }}
            onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
          />
        </Card>
      </Grid>
    </Grid>
  )
}
export default Invitations
