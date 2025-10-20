'use client'
import { useEffect, useState, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TablePagination from '@mui/material/TablePagination'
import MenuItem from '@mui/material/MenuItem'
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
import tableStyles from '@core/styles/table.module.css'
import type { MenuesType } from '@/types/apps/menuTypes'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import type { ButtonProps } from '@mui/material/Button'
import { useAuthStore } from '@/store/authStore'
import { getAllBusiness, getBusinessById } from '@/api/business'
import { createTemplate, createFlow, deleteMenu, getAllMenues, syncMenuData } from '@/api/menu'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import { BusinessType } from '@/api/interface/businessInterface'
import ConfirmationDialog from '@/components/dialogs/confirmation-dialog/DeleteConfirmationModal'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'
import Loader from '@/components/loader/Loader'
import AddProduct from '@/components/product/add/AddProduct'
import EditProduct from '@/components/dialogs/edit-product-info'
import { useSession } from 'next-auth/react'
import { getUserBusinessesById } from '@/api/user'

// Extend react-table with custom filter functions
declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type MenuesTypeWithAction = MenuesType & {
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

// Helper function for button props
const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

// Column Definitions using react-table's column helper
const columnHelper = createColumnHelper<MenuesTypeWithAction>()

const ProductsListTable = ({ tableData, businesses }: { tableData?: MenuesType[]; businesses: BusinessType[] }) => {
  const router = useRouter()
  const { lang: locale } = useParams() as { lang: Locale }
  const [rowSelection, setRowSelection] = useState({})
  const [loading, setLoading] = useState<boolean>(false)
  const { menuData, menuAction } = useAuthStore()
  const [userBuinsessData, setUserBusinessesData] = useState<BusinessType[]>([])
  const [businessByIdData, setBusinessByIdData] = useState<BusinessType | null>(null)

  // State variables for business selection and data filtering
  const [selectedBusiness, setSelectedBusiness] = useState<string | number>(businesses[0]?.id)
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | number>('')
  const [currencySymbol, setCurrencySymbol] = useState('')
  const [allData, setAllData] = useState<MenuesType[]>([])
  const [data, setData] = useState<MenuesType[]>(tableData || [])
  const [globalFilter, setGlobalFilter] = useState('')
  const [deleteMenuOpen, setDeleteMenuOpen] = useState(false)
  const [SyncMenuOpen, setSyncMenuOpen] = useState(false)
  const [editMenuFlag, setEditMenuFlag] = useState<boolean>(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [flowCreationFlag, setFlowCreationFlag] = useState(false)
  const [templateCreationFlag, setTemplateCreationFlag] = useState(false)
  const { data: session } = useSession()
  // console.log(session, 'session')

  const loggedInUserId: number = session?.user?.id ?? 0

  const fetchMenues = async () => {
    try {
      const response = await getAllMenues()
      const menus = response?.data?.results || []

      setAllData(menus)
      setData(menus)
      menuAction(menus)
    } catch (err: any) {
      console.error('Error fetching menus:', err)
      toast.error(err.message || 'Failed to fetch menus')
    }
  }

  useEffect(() => {
    fetchMenues()
  }, [deleteMenuOpen, SyncMenuOpen, editMenuFlag, flowCreationFlag, templateCreationFlag])

  const handleTypeAdded = () => {
    fetchMenues()
    setEditMenuFlag(true)
  }
  // if (businesses && businesses.length > 0) {
  //   setSelectedBusiness(businesses[0].id)
  //   setSelectedBusinessId(businesses[0].business_id)
  //   setCurrencySymbol(businesses[0].currency?.symbol) // Assuming 'id' is the unique identifier
  // }

  // Fetch Businesses and set the first business as selected by default
  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await getUserBusinessesById(loggedInUserId)
        const businesses = response?.data || []
        setUserBusinessesData(businesses)

        if (businesses && businesses.length > 0) {
          setSelectedBusiness(businesses[0].id)
          setSelectedBusinessId(businesses[0].business_id)
          setCurrencySymbol(businesses[0].currency?.symbol) // Assuming 'id' is the unique identifier
        }
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch businesses')
      }
    }

    fetchBusiness()
  }, [])

  useEffect(() => {
    const fetchBusinessByID = async () => {
      try {
        const response = await getBusinessById(Number(selectedBusiness))
        setBusinessByIdData(response?.data)
      } catch (err: any) {
        toast.error(err.message || 'Failed to fetch businesses')
      }
    }

    fetchBusinessByID()
  }, [selectedBusiness])
  // console.log(businesses, 'businesses')

  const handleBusinessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedBusinessValue = event.target.value

    const selectedBusinessDetails = businesses.find(business => Number(business.id) === Number(selectedBusinessValue))
    setSelectedBusiness(selectedBusinessValue)
    setSelectedBusinessId(selectedBusinessDetails?.business_id || '')

    // Optional: You can add router push if you want to update the URL
    // router.replace(getLocalizedUrl(`/menu?businessId=${selectedBusinessDetails?.business_id}`, locale as Locale))
  }

  // Filter data whenever selectedBusiness or allData changes
  useEffect(() => {
    if (selectedBusiness) {
      const filtered = allData.filter(menu => menu.business === selectedBusiness)
      setData(filtered)
      table.setPageIndex(0) // Reset to first page when data changes
    }
  }, [selectedBusiness, allData])

  // Handler for deleting a menu
  const handleDeleteMenu = (id: number) => {
    deleteMenu(id)
      .then(res => {
        toast.success('Product deleted successfully')
        setDeleteMenuOpen(prev => !prev)
      })
      .catch(error => {
        if (error?.data && error?.data?.detail) {
          toast.error(error?.data?.detail)
        } else {
          toast.error('Error in deleting Product')
        }
      })
  }

  const handleAddToppings = (e: React.MouseEvent<HTMLButtonElement>) => {
    router.replace(getLocalizedUrl(`/products/toppings/${selectedBusinessId}`, locale as Locale))
  }

  const handleAddSize = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log('handleAddSize', getLocalizedUrl(`/products/size/${selectedBusinessId}`, locale as Locale))

    router.replace(getLocalizedUrl(`/products/size/${selectedBusinessId}`, locale as Locale))
  }

  const handleCreateFlow = (menuItems: any) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setFlowCreationFlag(false)

    const payload = {
      name: `${menuItems.sku}_${menuItems.type.name}_flow2`,
      categories: ['OTHER'],
      flow_type: 'toppings',
      type_id: menuItems.type.id,
      menu_id: menuItems.id,
      business_id: selectedBusiness
    }
    createFlow(payload)
      .then(res => {
        console.log(res, 'Create Address Flow')
        toast.success('Flow Created Successfully')
        setFlowCreationFlag(true)
      })
      .catch(error => {
        console.log(error, 'error in creating Address Flow')
        toast.error(error?.data?.error)
      })
  }
  const handleCreateTemplate = (menuItems: any) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    setTemplateCreationFlag(false)

    const payload = {
      name: `${menuItems.sku}_template1`,
      category: 'MARKETING',
      allow_category_change: true,
      language: 'en',

      components: [
        {
          type: 'BODY',
          text: `Please choose your preferred toppings and the size for ${menuItems.type.name}`
        },

        {
          type: 'BUTTONS',
          buttons: [
            {
              type: 'FLOW',
              text: `Create your  ${menuItems.type.name}`,
              flow_id:
                menuItems.facebook_flows && menuItems.facebook_flows.length > 0
                  ? menuItems.facebook_flows[0].flow_id
                  : '89898' // Use a fallback flow_id if facebook_flows is empty
            }
          ]
        }
      ],

      business_id: selectedBusiness,
      flow_id:
        menuItems.facebook_flows && menuItems.facebook_flows.length > 0 ? menuItems.facebook_flows[0].flow_id : '89898', // Use a fallback flow_id if facebook_flows is empty
      menu_id: menuItems.id
    }
    createTemplate(payload)
      .then(res => {
        toast.success('Template Created Successfully', {
          duration: 5000
        })
        setTemplateCreationFlag(true)
      })
      .catch(error => {
        toast.error(error?.data?.detail, {
          duration: 5000
        })
      })
  }

  const handleConfirm = async () => {
    if (!selectedBusiness) {
      toast.error('Please select a business to sync.', {
        duration: 5000
      })
      return
    }

    setLoading(true)
    const payload = {
      business_id: selectedBusiness
    }

    syncMenuData(payload)
      .then(res => {
        toast.success('Menu synced successfully', {
          duration: 5000
        })
        setSyncMenuOpen(prev => !prev)
      })
      .catch(error => {
        toast.error(error?.data?.message, {
          duration: 5000
        })
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const truncateText = (text: any, maxLength: any) => {
    if (!text) return ''
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
  }

  // Define table columns
  const columns = useMemo<ColumnDef<MenuesTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor('id', {
        header: '#',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {row?.original?.id}
              </Typography>
            </div>
          </div>
        )
      }),
      columnHelper.accessor('title', {
        header: 'Title',
        cell: ({ row }) => (
          <div className='flex items-center gap-4'>
            <div className='flex flex-col'>
              <Typography color='text.primary' className='font-medium'>
                {truncateText(row?.original?.title, 15)}
              </Typography>
            </div>
          </div>
        )
      }),

      columnHelper.accessor('status', {
        header: 'Status',
        cell: ({ row }) => <Typography>{row.original.status}</Typography>
      }),
      columnHelper.accessor('sku', {
        header: 'SKU',
        cell: ({ row }) => <Typography color='text.primary'>{row.original.sku}</Typography>
      }),

      columnHelper.accessor('brand', {
        header: 'Brand',
        cell: ({ row }) => (
          <div className='flex items-center gap-2'>
            <Typography className='capitalize' color='text.primary'>
              {truncateText(row?.original?.brand, 15)}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('price', {
        header: 'Price',
        cell: ({ row }) => (
          <Typography className='capitalize' color='text.primary'>
            {/* {currencySymbol}  */}
            {row.original.price}
          </Typography>
        )
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
                  color: 'primary',
                  children: <i className='tabler-eye text-textSecondary' />
                }}
                dialog={EditProduct}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  mode: 'view',
                  data: menuData.find((item: any) => item.id === row.original.id),
                  businesses: businesses
                }}
              />
            </div>
            <div>
              <OpenDialogOnElementClick
                element={Button}
                elementProps={buttonProps('Edit', 'primary', 'contained')}
                dialog={EditProduct}
                onTypeAdded={handleTypeAdded}
                dialogProps={{
                  mode: 'edit',
                  data: menuData.find((item: any) => item.id === row.original.id),
                  businesses: businesses
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
                onConfirm={() => row.original.id && handleDeleteMenu(row.original.id)}
                dialogProps={{ type: 'delete' }}
              />
            </div>

            <div>
              <Button
                variant='contained'
                disabled={row.original.flow || row.original.template} // Disable if flow or template is already created
                onClick={handleCreateFlow(row.original)}
              >
                Flow
              </Button>
            </div>
            <div className='flex gap-4 justify-center'>
              <Button
                variant='contained'
                disabled={!row.original.flow || row.original.template} // Disable if flow is not created or template is already created
                onClick={handleCreateTemplate(row.original)}
              >
                Template
              </Button>
            </div>
          </div>
        ),
        enableSorting: false
      })
    ],
    [handleDeleteMenu, menuData]
  )

  // Initialize react-table
  const table = useReactTable({
    data: data as MenuesType[],
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
      {/* {loading && <Loader />} */}
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

          <div className='flex flex-col sm:flex-row is-full sm:is-auto items-start sm:items-center gap-4'>
            Business
            <CustomTextField
              className='is-full sm:is-auto'
              select
              fullWidth
              id='business'
              value={selectedBusiness}
              onChange={handleBusinessChange}
            >
              {businesses.length > 0 ? (
                businesses.map(user => (
                  <MenuItem key={user.business_id} value={user.id}>
                    {user.business_id}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value='' disabled>
                  No business available
                </MenuItem>
              )}
            </CustomTextField>
            <OpenDialogOnElementClick
              element={Button}
              elementProps={buttonProps('Add Product', 'primary', 'contained')}
              dialog={AddProduct}
              onTypeAdded={handleTypeAdded}
              dialogProps={{
                mode: 'add',
                businesses: businesses
              }}
            />
            <>
              {businessByIdData?.business_type === 'Fast_food' && (
                <Button
                  variant='contained'
                  startIcon={<i className='tabler-plus' />}
                  onClick={handleAddToppings}
                  className='is-full sm:is-auto'
                >
                  Toppings
                </Button>
              )}

              <Button
                variant='contained'
                startIcon={<i className='tabler-plus' />}
                onClick={handleAddSize}
                className='is-full sm:is-auto'
              >
                Size
              </Button>
            </>
            <Button
              variant='contained'
              startIcon={<i className='tabler-upload' />}
              className='is-full sm:is-auto'
              onClick={() => setOpenConfirmation(true)}
            >
              Sync Meta
            </Button>
          </div>
        </div>

        <UpdateConfirmationDialog
          openConfirmation={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onConfirm={handleConfirm}
          title='Sync Meta'
          description='Syncing your menu with meta can take upto half an hour.
          Are you sure you want to Sync Meta?'
        />

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

export default ProductsListTable
