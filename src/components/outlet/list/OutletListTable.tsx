'use client'
// React Imports
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
// Third-party Imports
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

// Type Imports
import toast from 'react-hot-toast'
import type { ThemeColor } from '@core/types'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import type { ButtonProps } from '@mui/material/Button'
import tableStyles from '@core/styles/table.module.css'
import { deleteRestaurant, getAllResturants } from '@/api/resturant'
import type { ResturantsType } from '@/types/apps/restoTypes'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import { useAuthStore } from '@/store/authStore'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

import AddEditOutlet from '@/components/outlet/add/AddEditOutlet'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog/DeleteConfirmationModal'
import Loader from '@/components/loader/Loader'
import { useSession } from 'next-auth/react'
import { getUserBusinessesById } from '@/api/user'
import { BusinessType } from '@/api/interface/businessInterface'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type RestorauntsTypeWithAction = ResturantsType & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
  })

  return itemRank.passed
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

// Column Definitions
const columnHelper = createColumnHelper<RestorauntsTypeWithAction>()

const OutletListTable = ({
  tableData,
  userBusiness
}: {
  tableData?: ResturantsType[]
  userBusiness: BusinessType[]
}) => {
  const { lang: locale } = useParams() as { lang: Locale }
  const { data: session, update } = useSession()

  const [rowSelection, setRowSelection] = useState({})
  const { resturantData, resturantAction } = useAuthStore()
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<ResturantsType[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState('')
  const userSession = useSession()
  const userId = userSession?.data?.user?.id!
  // if (!userSession?.data?.user?.id) {
  //   throw new Error('User ID missing')
  // }
  // const userId = userSession.data.user.id // Now safe

  const fetchResturants = async () => {
    try {
      setLoading(true)
      const response = await getAllResturants()
      setLoading(false)
      setData(response?.data?.results || [])
      resturantAction(response?.data?.results)
    } catch (err: any) {
      // setError(err.message || 'Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const handleTypeAdded = () => {
    fetchResturants()
  }

  const handleDeleteConfirmed = async (id: number) => {
    try {
      await deleteRestaurant(id.toString())
      const response = await getUserBusinessesById(userId)
      const businesses = response?.data ?? []
      await update({ userBusinesses: businesses })
      toast.success('Outlet deleted successfully')

      // Remove the deleted outlet from the local state without re-fetching
      setData(prev => prev.filter(outlet => outlet.id !== id))
      // fetchResturants()
    } catch (error: any) {
      console.log(error, 'error in deleting Outlet')
      if (error?.data && error?.data?.detail) {
        toast.error(error?.data?.detail)
      } else {
        toast.error('Error in deleting Outlet')
      }
    }
  }

  const columns = useMemo<ColumnDef<RestorauntsTypeWithAction, any>[]>(
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
          <Typography
            component={Link}
            href={getLocalizedUrl(`/outlets/${row.original.id}`, locale as Locale)}
            color='primary'
          >{`${row.original.id}`}</Typography>
        )
      }),

      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.name}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('city', {
        header: 'City',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.city}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('postal_code_delivery', {
        header: 'Postal Code',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row?.original?.postal_code_delivery}
          </Typography>
        )
      }),
      columnHelper.accessor('contact_number', {
        header: 'Contact Number',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row?.original?.contact_number}
          </Typography>
        )
      }),
      columnHelper.accessor('business.business_id', {
        header: 'business Id',
        cell: ({ row }) => <Typography>{row?.original?.business.business_id}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <div className='flex items-center'>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={{
                  className: 'table-delete-icon',
                  color: 'error',
                  children: <i className='tabler-trash text-[22px]' />
                }}
                dialog={ConfirmationDialog}
                onConfirm={() => row.original.id && handleDeleteConfirmed(row.original.id)}
                dialogProps={{ type: 'delete' }}
              />
            </div>

            <div className='flex gap-4 justify-center'>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps('Edit', 'primary', 'contained')}
                dialog={AddEditOutlet}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  mode: 'edit',
                  data: resturantData.find((item: any) => item.id === row?.original?.id),
                  userBusiness: userBusiness
                }}
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
    data: data as ResturantsType[],
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
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Add Outlet', 'primary', 'contained')}
              dialog={AddEditOutlet}
              onTypeAdded={handleTypeAdded}
              dialogProps={{
                mode: 'add',
                userBusiness: userBusiness
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

export default OutletListTable
