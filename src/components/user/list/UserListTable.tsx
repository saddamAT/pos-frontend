'use client'
import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import { styled } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import toast from 'react-hot-toast'
import type { ButtonProps } from '@mui/material/Button'
import classnames from 'classnames'

import { rankItem } from '@tanstack/match-sorter-utils'
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
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'
import type { ThemeColor } from '@core/types'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import type { UsersType } from '@/types/apps/userTypes'
import { deletUser, getAllUsers } from '@/api/user'
import Loader from '@/components/loader/Loader'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import InvitationModal from '@/components/invitations/add/InvitationModal'
import { BusinessType } from '@/api/interface/businessInterface'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog/DeleteConfirmationModal'
import AddEditUser from '@/components/user/add/AddEditUser'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type UsersTypeWithAction = UsersType & {
  action?: string
}

// Styled Components
const Icon = styled('i')({})

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
  })

  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value, debounce, onChange])

  return <CustomTextField {...props} value={value} onChange={e => setValue(e.target.value)} />
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

// Column Definitions
const columnHelper = createColumnHelper<UsersTypeWithAction>()

const UserListTable = ({
  tableData,
  userType,
  businesses
}: {
  tableData?: UsersType[]
  userType: UsersType[]
  businesses: BusinessType[]
}) => {
  const [rowSelection, setRowSelection] = useState({})

  const [data, setData] = useState<UsersType[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState('')

  const [loading, setLoading] = useState<boolean>(false)

  const fetchUsers = async () => {
    setLoading(true)

    try {
      const response = await getAllUsers()
      setData(response?.data?.results || [])
    } catch (err: any) {
      console.log(err, 'err')
    } finally {
      setLoading(false)
    }
  }

  const handleTypeAdded = () => {
    fetchUsers()
  }

  const handleDeleteUser = (id: number) => {
    deletUser(id.toString())
      .then(res => {
        toast.success('User  deleted successfully')
        fetchUsers()
      })
      .catch(error => {
        if (error?.data && error?.data?.detail) {
          toast.error(error?.data?.detail)
        } else {
          toast.error('Error in deleting User')
        }
      })
  }

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
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

      columnHelper.accessor('id', {
        header: '#',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.id}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('first_name', {
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.first_name} {row?.original?.last_name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.email}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Icon />
            <Typography className='capitalize' color='text.primary'>
              {row?.original?.status}
            </Typography>
          </div>
        )
      }),

      columnHelper.accessor('country', {
        header: 'Country',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Icon />
            <Typography className='capitalize' color='text.primary'>
              {row?.original?.country}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Icon />
            <Typography className='capitalize' color='text.primary'>
              {row?.original?.city}
            </Typography>
          </div>
        )
      }),

      columnHelper.accessor('user_type', {
        header: 'User Type',
        cell: ({ row }) => <Typography>{row?.original?.user_type}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <div>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={{
                  className: 'table-delete-icon',
                  children: <i className='tabler-eye text-textSecondary' />
                }}
                dialog={AddEditUser}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  mode: 'view',
                  data: data.find((item: any) => item.id === row?.original?.id),
                  userType: userType
                }}
              />
            </div>
            <div>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps('Edit', 'primary', 'contained')}
                dialog={AddEditUser}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  mode: 'edit',
                  data: data.find((item: any) => item.id === row?.original?.id),
                  userType: userType
                }}
              />
            </div>

            <div>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={{
                  className: 'table-delete-icon',
                  color: 'primary',
                  children: <i className='tabler-trash text-[22px]' />
                }}
                dialog={ConfirmationDialog}
                onConfirm={() => row.original.id && handleDeleteUser(row.original.id)}
                dialogProps={{ type: 'delete' }}
              />
            </div>
          </div>
        ),
        enableSorting: false
      })
    ],
    [data]
  )

  const table = useReactTable({
    data: data as UsersType[],
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
    enableRowSelection: true,
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
    <>
      <Card>
        {/* {loading && <Loader />} */}

        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value='10'>10</MenuItem>
            <MenuItem value='25'>25</MenuItem>
            <MenuItem value='50'>50</MenuItem>
          </CustomTextField>
          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
            <DebouncedInput
              value={globalFilter ?? ''}
              onChange={value => setGlobalFilter(String(value))}
              placeholder='Search User'
              className='is-full sm:is-auto'
            />

            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Add User', 'primary', 'contained')}
              dialog={AddEditUser}
              onTypeAdded={handleTypeAdded}
              dialogProps={{
                userType: userType,
                mode: 'add'
              }}
            />
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Invite User', 'primary', 'contained')}
              dialog={InvitationModal}
              onTypeAdded={handleTypeAdded}
              dialogProps={{
                mode: 'add',
                businesses: businesses,
                userType: userType
              }}
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
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
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getFilteredRowModel().rows?.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns()?.length} className='text-center'>
                    No data available
                  </td>
                </tr>
              ) : (
                table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map(row => (
                    <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                      ))}
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel()?.rows?.length ?? 0}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page)
          }}
        />
      </Card>
    </>
  )
}

export default UserListTable
