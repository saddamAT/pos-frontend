'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
import { useParams } from 'next/navigation'
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
import { deleteBusiness, getAllBusiness } from '@/api/business'
import type { BusinessTypeForFile } from '@/api/interface/businessInterface'
import { useAuthStore } from '@/store/authStore'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog/DeleteConfirmationModal'
import TablePaginationComponent from '@/components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import Loader from '@/components/loader/Loader'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
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
  const { lang: locale } = useParams() as { lang: Locale }
  const { data: session, update } = useSession()
  const userSession = useSession()
  const userId = userSession?.data?.user?.id!
  // if (!userSession?.data?.user?.id) {
  //   throw new Error('User ID missing')
  // }
  //  const userId = userSession.data.user.id // Now safe

  const [data, setData] = useState<BusinessTypeForFile[]>(tableData)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [loading, setLoading] = useState(false)

  const { businessAction, businessData } = useAuthStore()

  const fetchAllBusiness = async () => {
    try {
      setLoading(true)
      const response = await getAllBusiness()
      const updatedData = response?.data?.results ?? []
      setData(updatedData)
      businessAction(updatedData)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // useEffect(() => {
  //   refreshData()
  // }, [editBusinessFlag, deleteBusinessOpen])

  const handleTypeAdded = () => {
    fetchAllBusiness()
    // setEditBusinessFlag(true)
  }

  const handleDeleteConfirmed = async (id: number) => {
    setLoading(true)
    try {
      await deleteBusiness(id.toString())
      toast.success('Business deleted successfully')
      // await refreshData()
      fetchAllBusiness()
      // const response = await getAllBusiness()
      // const updatedData = response?.data?.results ?? []
      const response = await getUserBusinessesById(userId)
      const businesses = response?.data ?? []
      await update({ userBusinesses: businesses })
      // setDeleteBusinessOpen(true)
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
          <Typography component={Link} href={getLocalizedUrl(`/business/${row.original.id}`, locale)} color='primary'>
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
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={{ children: <i className='tabler-trash text-xl' />, color: 'error' }}
              dialog={ConfirmationDialog}
              onConfirm={() => handleDeleteConfirmed(row.original.id)}
              dialogProps={{ type: 'delete' }}
            />
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
        )
      })
    ],
    [data]
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
