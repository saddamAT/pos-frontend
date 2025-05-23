'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
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
import toast, { Toaster } from 'react-hot-toast'
import type { ThemeColor } from '@core/types'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import type { ButtonProps } from '@mui/material/Button'
import { useAuthStore } from '@/store/authStore'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'

import { deleteMenuSize } from '@/api/size'
import EditSizeInfo from '@/components/dialogs/edit-size-info'
import { SizeDataType } from '@/api/interface/sizeInterface'
import { getToppingSizeByBusinessId } from '@/api/toppings'
import AddtMenuSizeForm from '@/components/dialogs/add-menu-size-form'

// Extend react-table with custom filter functions
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type MenuSizeTypeWithAction = SizeDataType & {
  action?: string
}

// Custom fuzzy filter function
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)

  addMeta({
    itemRank
  })

  return itemRank.passed
}

// Debounced input component for search (optional)
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

// Helper function for button props
const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

// Column Definitions using react-table's column helper
const columnHelper = createColumnHelper<MenuSizeTypeWithAction>()
type PreviewProps = {
  isCreated: boolean
  id: string
}
const SizeListTable = ({ isCreated, id }: PreviewProps) => {
  const router = useRouter()
  const { lang: locale } = useParams()

  const [rowSelection, setRowSelection] = useState({})
  const [loading, setLoading] = useState<boolean>(false)
  const { menuSizeData, menuSizeAction } = useAuthStore()

  const [data, setData] = useState<SizeDataType[]>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const [editMenuSizeFlag, setEditMenuSizeFlag] = useState(false)
  const [deleteMenuSizeFlag, setMenuSizeFlag] = useState(false)

  const fetchMenuSizes = async () => {
    try {
      const response = await getToppingSizeByBusinessId(id)
      const menuSize: SizeDataType[] = (response?.data || []).sort((a: any, b: any) =>
        a.menu.title.localeCompare(b.menu.title)
      )
      setData(menuSize) // Initialize with all menus
      menuSizeAction(menuSize)
    } catch (err: any) {
      console.error('Error fetching sizes:', err)
      toast.error(err.message || 'Failed to fetch sizes')
    }
  }

  useEffect(() => {
    fetchMenuSizes()
  }, [deleteMenuSizeFlag, menuSizeAction, editMenuSizeFlag, isCreated, id])

  const handleTypeAdded = () => {
    fetchMenuSizes()
    setEditMenuSizeFlag(true)
  }

  // Handler for deleting a menu
  const handleDeleteMenuSize = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    deleteMenuSize(id)
      .then(res => {
        toast.success('Menu Size deleted successfully')
        setMenuSizeFlag(prev => !prev)
      })
      .catch(error => {
        if (error?.data && error?.data?.detail) {
          toast.error(error?.data?.detail)
        } else {
          toast.error('Error in deleting Menu Size')
        }
      })
  }

  const truncateText = (text: any, maxLength: any) => {
    if (!text) return ''
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  // Define table columns
  const columns = useMemo<ColumnDef<MenuSizeTypeWithAction, any>[]>(
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
        header: 'Id',
        cell: ({ row }) => (
          <Typography
            component={Link}
            href={getLocalizedUrl(`/menu/size/details/${row.original.id}`, locale as Locale)}
            color='primary'
          >
            {`${row.original.id}`}
          </Typography>
        )
      }),

      columnHelper.accessor('name', {
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row.original.name}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('description', {
        header: 'Description',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {truncateText(row?.original?.description, 15)}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('additional_price', {
        header: 'Price',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.additional_price}
          </Typography>
        )
      }),
      columnHelper.accessor('menu', {
        header: 'Menu',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {row.original.menu?.title}
          </Typography>
        )
      }),

      columnHelper.accessor('action', {
        header: 'Action',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton onClick={e => handleDeleteMenuSize(row.original.id, e)}>
              <i className='tabler-trash text-[22px] text-textSecondary' />
            </IconButton>
            <div className='flex gap-4 justify-center'>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps('Edit', 'primary', 'contained')}
                dialog={EditSizeInfo}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  id: row.original.business,
                  data: menuSizeData.find((item: any) => item.id === row.original.id)
                }}
              />
            </div>
          </div>
        ),
        enableSorting: false
      })
    ],
    [menuSizeData, data]
  )

  // Initialize react-table
  const table = useReactTable({
    data: data as SizeDataType[],
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
        <div className='flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4'>
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
            className='is-[70px]'
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </CustomTextField>
        </div>

        {/* Table */}
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
              {table.getFilteredRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
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

        {/* Table Pagination */}
        <TablePagination
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
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

export default SizeListTable
