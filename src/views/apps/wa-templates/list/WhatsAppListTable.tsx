'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Checkbox from '@mui/material/Checkbox'
import TablePagination from '@mui/material/TablePagination'
import type { TextFieldProps } from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import { toast } from 'react-hot-toast'
import type { ButtonProps } from '@mui/material/Button'

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
import type { ThemeColor } from '@core/types'
import TablePaginationComponent from '@components/TablePaginationComponent'
import CustomTextField from '@core/components/mui/TextField'
import tableStyles from '@core/styles/table.module.css'
import Loader from '@/components/loader/Loader'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import { WhatsAppDataType } from '@/api/interface/whatsappInterface'
import { deleteWhatsApp, GetWhatsApp } from '@/api/whatsapp'
import EditWhatsAppInfo from '@/components/dialogs/edit-whatsApp-info'
import { useAuthStore } from '@/store/authStore'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog/DeleteConfirmationModal'
import AddWhatsAppDrawer from '../add/AddWhatsAppDrawer'
import { BusinessType } from '@/api/interface/businessInterface'
import { FeedToChatGptFileType } from '@/api/interface/interfaceFeedToGPT'
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type WhatsAppTypeWithAction = WhatsAppDataType & {
  action?: string
}

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
const columnHelper = createColumnHelper<WhatsAppTypeWithAction>()

const WhatsppAppListTable = ({
  tableData,
  businesses,
  feedToChatGpt
}: {
  tableData?: WhatsAppDataType[]
  businesses: BusinessType[]
  feedToChatGpt: FeedToChatGptFileType[]
}) => {
  const { lang: locale } = useParams() as { lang: Locale }
  const { whatsAppAction, whatsAppData } = useAuthStore()
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [deleteWhatssAppOpen, setDeleteWhatsAppOpen] = useState(false)
  const [editWhatsAppFlag, setEditWhatsAppFlag] = useState(false)

  const [rowSelection, setRowSelection] = useState({})

  const [data, setData] = useState<WhatsAppDataType[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState('')

  const [loading, setLoading] = useState<boolean>(false)

  const fetchWhatsAppFeed = async () => {
    try {
      setLoading(true)
      const response = await GetWhatsApp()
      setLoading(false)
      setData(response?.data?.results)

      whatsAppAction(response.data.results)
    } catch (error: any) {
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWhatsAppFeed()
  }, [addUserOpen, deleteWhatssAppOpen, editWhatsAppFlag])

  const handleTypeAdded = () => {
    fetchWhatsAppFeed()
    setEditWhatsAppFlag(true)
  }

  const handleDeleteWhatsApp = (id: number) => {
    deleteWhatsApp(id.toString())
      .then(res => {
        toast.success('WhatsApp deleted successfully')
        setDeleteWhatsAppOpen(true)
      })
      .catch(error => {
        console.log(error, 'error in deleting WhatsApp')

        // if (error?.data && error?.data?.detail) {
        //   toast.error(error?.data?.detail)
        // } else {
        //   toast.error('Error in deleting WhatsApp')
        // }
      })
  }

  const truncateText = (text: any, maxLength: any) => {
    if (!text) return ''
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  const columns = useMemo<ColumnDef<WhatsAppDataType, any>[]>(
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
            href={getLocalizedUrl(`/whatsApp/${row.original.id}`, locale as Locale)}
            color='primary'
          >{`${row.original.id}`}</Typography>
        )
      }),
      columnHelper.accessor('business', {
        header: ' Business',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.business}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('phone_id', {
        header: 'Phone Id',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {truncateText(row?.original?.phone_id, 15)}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('access_token', {
        header: 'Access Token',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {truncateText(row?.original?.access_token, 15)}
          </Typography>
        )
      }),
      columnHelper.accessor('webhook_token', {
        header: 'Webhook Token',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {truncateText(row?.original?.webhook_token, 15)}
          </Typography>
        )
      }),
      columnHelper.accessor('whatsapp_account_id', {
        header: ' Whatsapp Account Id',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {truncateText(row?.original?.whatsapp_account_id, 15)}
          </Typography>
        )
      }),
      columnHelper.accessor('catalog_id', {
        header: 'catalog_id:',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {truncateText(row?.original?.catalog_id, 15)}
          </Typography>
        )
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
                onConfirm={() => row.original.id && handleDeleteWhatsApp(row.original.id)}
                dialogProps={{ type: 'delete' }}
              />
            </div>

            <div className='flex gap-4 justify-center'>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps('Edit', 'primary', 'contained')}
                dialog={EditWhatsAppInfo}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  mode: 'edit',
                  data: whatsAppData.find((item: any) => item.id === row?.original?.id)
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
    data: data as WhatsAppDataType[],
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

  // if (loading) {
  //   return (
  //     <div className='flex justify-center items-center h-64'>
  //       <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
  //     </div>
  //   )
  // }

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
              placeholder='Search WhatsApp'
              className='is-full sm:is-auto'
            />

            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddUserOpen(!addUserOpen)}
              className='is-full sm:is-auto'
            >
              Add WhatsApp
            </Button>
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

      <AddWhatsAppDrawer
        open={addUserOpen}
        handleClose={() => setAddUserOpen(!addUserOpen)}
        businesses={businesses}
        feedToChatGpt={feedToChatGpt}
      />
    </>
  )
}

export default WhatsppAppListTable
