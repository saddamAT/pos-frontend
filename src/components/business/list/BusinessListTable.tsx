'use client'

import { useState, useMemo, useEffect } from 'react'

import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'

import {
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  createColumnHelper,
  flexRender,
  type ColumnDef,
  type FilterFn
} from '@tanstack/react-table'

import { rankItem, type RankingInfo } from '@tanstack/match-sorter-utils'
import { deleteBusiness } from '@/api/business'
import type { BusinessTypeForFile } from '@/api/interface/businessInterface'
import { useAuthStore } from '@/store/authStore'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog/DeleteConfirmationModal'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import Loader from '@/components/loader/Loader'
import { getUserBusinessesById } from '@/api/user'
import AddEditBusiness from '@/components/business/add/AddEditBusiness'
import { CurrencyDataType } from '@/api/interface/currencyInterface'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type BusinessTypeWithAction = BusinessTypeForFile & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper<BusinessTypeWithAction>()

const BusinessListTable = ({
  tableData = [],
  currencies
}: {
  tableData?: BusinessTypeForFile[]
  currencies: CurrencyDataType[]
}) => {
  const { data: session, update } = useSession()

  const selectedOutletId = session?.user?.selectedOutlet?.business

  const userSession = useSession()
  // const userId = userSession?.data?.user?.id!
  const userId = userSession?.data?.user?.id ?? 0
  // if (!userSession?.data?.user?.id) {
  //   throw new Error('User ID missing')
  // }
  //  const userId = userSession.data.user.id // Now safe

  const [data, setData] = useState<BusinessTypeForFile[]>(tableData)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const { businessData, businessAction } = useAuthStore()

  useEffect(() => {
    if (userId) {
      fetchAllBusiness()
    }
  }, [userId]) // Watch userId for changes

  // Set the data when the businessData or tableData changes
  useEffect(() => {
    if (businessData && businessData.length > 0) {
      setData(businessData)
    } else if (tableData && tableData.length > 0) {
      setData(tableData)
      businessAction(tableData) // Update store with prop data
    }
  }, [tableData, businessData, businessAction])

  const fetchAllBusiness = async () => {
    try {
      setLoading(true)
      const response = await getUserBusinessesById(userId)
      const updatedData = response?.data ?? []
      setData(updatedData)
      businessAction(updatedData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleTypeAdded = async () => {
    await fetchAllBusiness()
  }

  const handleDeleteConfirmed = async (id: number) => {
    setLoading(true)

    try {
      await deleteBusiness(id.toString())
      toast.success('Business deleted successfully')

      const updatedData = data.filter(business => business.id !== id)
      setData(updatedData)

      businessAction(updatedData)

      const response = await getUserBusinessesById(userId)
      const businesses = response?.data ?? []

      await update({ userBusinesses: businesses })
    } catch (error: any) {
      toast.error(error?.data?.detail || 'Error in deleting business')
    } finally {
      setLoading(false)
    }
  }

  const truncateText = (text: any, maxLength: number) =>
    text?.length > maxLength ? `${text.substring(0, maxLength)}...` : text

  const columns = useMemo<ColumnDef<BusinessTypeWithAction, any>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            indeterminate={row.getIsSomeSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        )
      },
      columnHelper.accessor('id', {
        header: 'ID',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.id}
          </Typography>
        )
      }),

      columnHelper.accessor('name', {
        header: 'Business Name',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('business_type', {
        header: 'Business Type',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('business_initial', {
        header: 'Initials',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('currency', {
        header: 'Currency',
        cell: info => <Typography>{info.row.original.currency?.symbol}</Typography>
      }),
      columnHelper.accessor('business_address', {
        header: 'Address',
        cell: info => <Typography>{truncateText(info.getValue(), 20)}</Typography>
      }),
      columnHelper.accessor('contact_number', {
        header: 'Contact',
        cell: info => <Typography>{info.getValue()}</Typography>
      }),
      columnHelper.accessor('action', {
        header: 'Action',
        enableSorting: false,
        cell: ({ row }) => {
          const rowId = row.original.id as number
          const rowIsActive = String(selectedOutletId ?? '') === String(rowId ?? '')
          return (
            <div className='flex gap-2'>
              <div>
                <OpenDialogOnElementClick
                  element={Button}
                  elementProps={{
                    className: 'table-delete-icon',
                    children: <i className='tabler-eye text-textSecondary' />
                  }}
                  dialog={AddEditBusiness}
                  onTypeAdded={handleTypeAdded}
                  dialogProps={{
                    mode: 'view',
                    data: businessData.find((item: any) => item.id === row?.original?.id)
                  }}
                />
              </div>
              <div>
                <OpenDialogOnElementClick
                  element={Button}
                  elementProps={{ children: 'Edit', color: 'primary', variant: 'contained' }}
                  dialog={AddEditBusiness}
                  onTypeAdded={handleTypeAdded}
                  dialogProps={{
                    mode: 'edit',
                    data: businessData.find((item: any) => item.id === row?.original?.id)
                  }}
                />
              </div>
              <div>
                {/* <Tooltip
                  title={
                    rowIsActive
                      ? 'You cant delete the business currently in use. Please switch to another branch first'
                      : ''
                  }
                > */}
                <OpenDialogOnElementClick
                  element={Button}
                  elementProps={{
                    children: <i className='tabler-trash text-xl' />,
                    color: rowIsActive ? 'primary' : 'error',
                    disabled: rowIsActive,
                    title: rowIsActive
                      ? "You can't delete the business currently in use. Please switch to another branch first."
                      : 'Delete Business',
                    sx: { opacity: rowIsActive ? 0.5 : 1 }
                  }}
                  dialog={ConfirmationDialog}
                  onConfirm={() => handleDeleteConfirmed(row.original.id)}
                  dialogProps={{ type: 'delete' }}
                />
                {/* </Tooltip> */}
              </div>
            </div>
          )
        }
      })
    ],
    [data, selectedOutletId]
  )

  const table = useReactTable({
    data,
    columns,
    state: { rowSelection, globalFilter },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    filterFns: { fuzzy: fuzzyFilter },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel()
  })

  return (
    <>
      <Card>
        <div className='flex justify-between items-center p-6'>
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
          <OpenDialogOnElementClick
            element={Button}
            elementProps={{ children: 'Add Business', variant: 'contained' }}
            dialog={AddEditBusiness}
            onTypeAdded={handleTypeAdded}
            dialogProps={{ mode: 'add', currencies: currencies }}
          />
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
        />
      </Card>
      {/* {loading && <Loader />} */}
    </>
  )
}

export default BusinessListTable
