'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { Tabs, Tab, Box, Typography, Button, Card, IconButton, MenuItem, Divider } from '@mui/material'
import { ToppingDataType } from '@/api/interface/toppingInterface'
import { getAllFoodTypes } from '@/api/foodTypes'
import { getAllMenues } from '@/api/menu'
import { MenuDataType } from '@/api/interface/menuIterface'
import MenuCard from './MenuCard'
import CustomTextField from '@/@core/components/mui/TextField'

import { CreateOrder, CreateOrderItem } from '@/api/interface/orderInterface'
import { useForm } from 'react-hook-form'
import { getAllResturants } from '@/api/resturant'
import toast, { Toaster } from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'
import { getLocalizedUrl } from '@/utils/i18n'
import { Locale } from '@/configs/i18n'
import Loader from '@/components/loader/Loader'
import { createOrder } from '@/api/order'
import { RestaurantType } from '@/types/apps/restoTypes'

const OrderMenuBar = () => {
  const router = useRouter()
  const { lang: locale } = useParams()
  const defaultAddress = 'Sharjah Shoes Sadar Bazar Haveli Lakha'
  const defaultSpecialInstructions = 'Check products carefully before order'

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue: setFormValue,
    watch
  } = useForm<CreateOrder>({
    defaultValues: {
      address: defaultAddress,
      delivery_type: 'pickup' // Set default delivery type to pickup
    }
  })

  const deliveryType = watch('delivery_type')

  const [restoData, setRestoData] = useState<RestaurantType[]>([])
  const [selectedBusiness, setSelectedBusiness] = useState<string | number>('')
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | number>('')
  const [selectedRestoData, setSelectedRestoData] = useState<RestaurantType>()
  const [selectedRestoId, setSelectedRestoId] = useState<number>(0)
  const [selectedRestoUserId, setSelectedRestoUserId] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [value, setValue] = useState(0)
  const [foodTypeData, setFoodTypeData] = useState<ToppingDataType[]>([])
  const [id, setId] = useState<number | null>(null)
  const [allMenus, setAllMenus] = useState<MenuDataType[]>([])
  const [filteredMenus, setFilteredMenus] = useState<MenuDataType[]>([])
  const [orderSuccessData, setOrderSuccessData] = useState<CreateOrderItem>()
  const [orderSuccessFlag, setOrderSuccessFlag] = useState<boolean>(false)
  const [orderId, setOrderId] = useState<number>(99)
  const [total, setTotal] = useState(0)
  const [profit, setProfit] = useState(0)
  const [subtotal, setSubtotal] = useState<number>(0)
  const [currencySymbol, setCurrencySymbol] = useState('')
  // console.log(currencySymbol, 'currencySymbol')

  const [order, setOrder] = useState<
    {
      id: number
      sku: string
      size: string
      description: string
      name: string
      price: number
      purchase_price: number
      profit: number
      quantity: number
    }[]
  >([])
  console.log(order, 'order item--------->')

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    const selectedFood = foodTypeData[newValue]
    if (selectedFood) {
      setId(selectedFood.id)
    }
  }

  // Reset the order and form
  const resetOrderAndForm = () => {
    setOrder([])

    reset({
      special_instruction: '',
      delivery_type: 'pickup', // Reset to pickup
      address: defaultAddress
    })
  }

  useEffect(() => {
    const fetchResturants = async () => {
      try {
        const response = await getAllResturants()
        const restos = response?.data?.results || []
        setRestoData(restos)

        // Select first outlet by default
        if (restos.length > 0) {
          const firstResto = restos[0]
          setSelectedRestoId(firstResto.id)
          setSelectedBusinessId(firstResto?.business?.business_id)
          setSelectedBusiness(firstResto?.business?.id)
          setSelectedRestoUserId(firstResto?.business?.user?.id)
          setSelectedRestoData(firstResto)
          setCurrencySymbol(firstResto?.business?.currency?.symbol)
        }
      } catch (err: any) {
        console.error('Error fetching businesses:', err)
        toast.error(err.message || 'Failed to fetch businesses')
      }
    }

    fetchResturants()
  }, [])

  const handleRestoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const restoId = Number(event.target.value)

    setSelectedRestoId(restoId)
    const restoObj = restoData.find(b => b.id === restoId)
    if (restoObj) {
      setSelectedBusinessId(restoObj?.business?.business_id)
      setSelectedBusiness(restoObj?.business?.id)
      setSelectedRestoUserId(restoObj?.business?.user?.id)
      setSelectedRestoData(restoObj)
    } else {
      setSelectedRestoUserId(0)
      setSelectedBusiness(0)
    }
  }

  // Set default address when delivery type changes to pickup
  useEffect(() => {
    if (deliveryType === 'pickup') {
      setFormValue('address', defaultAddress)
    }
  }, [deliveryType, setFormValue])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllFoodTypes()
        const results = response?.data?.results
        setFoodTypeData(results)

        const menuData = await getAllMenues()
        const menuResults: MenuDataType[] = menuData?.data?.results
        setAllMenus(menuResults)

        if (results?.length > 0) {
          const firstId = results[0].id
          setId(firstId)
          setFilteredMenus(menuResults.filter(menu => menu.type === firstId))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (id) {
      setFilteredMenus(allMenus.filter(menu => menu?.type?.id === id))
    }
  }, [id, allMenus])

  // Calculate totals whenever order changes
  useEffect(() => {
    const calculateTotals = () => {
      const subTotalCalc = order.reduce((acc, item) => acc + Number(item.price || 0) * item.quantity, 0)
      setSubtotal(subTotalCalc)
      setTotal(subTotalCalc) // Since tax is 0
    }

    calculateTotals()
  }, [order])

  useEffect(() => {
    const calculateTotals = () => {
      const subTotalCalc = order.reduce((acc, item) => acc + Number(item.price || 0) * item.quantity, 0)
      const totalProfit = order.reduce(
        (acc, item) => acc + (Number(item.price || 0) - Number(item.purchase_price || 0)) * item.quantity,
        0
      )
      setSubtotal(subTotalCalc)
      setTotal(subTotalCalc)
      setProfit(totalProfit)
    }
    calculateTotals()
  }, [order])

  const addToOrder = (item: MenuDataType) => {
    setOrder(prev => {
      const existingItem = prev.find(orderItem => orderItem.id === item.id)
      if (existingItem) {
        return prev.map(orderItem =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem
        )
      }
      return [
        ...prev,
        {
          id: item.id,
          sku: item.sku,
          size: item.size || 'Default Size', // Ensure size exists
          description: item.description,
          name: item.title || 'Unknown', // Ensure name exists
          price: item.price,
          purchase_price: item.purchase_price,
          profit: item.price - item.purchase_price,
          quantity: 1
        }
      ]
    })
  }

  const incrementQuantity = (id: number) => {
    setOrder(prev => prev.map(item => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)))
  }

  const decrementQuantity = (id: number) => {
    setOrder(prev =>
      prev
        .map(item => (item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item))
        .filter(item => item.quantity > 0)
    )
  }

  const deleteItem = (id: number) => {
    setOrder(prev => prev.filter(item => item.id !== id))
  }

  const onSubmit = (data: any, e: any) => {
    e.preventDefault()

    if (!order || order.length === 0) {
      toast.error('Please add some menu items to proceed.')
      return
    }

    if (!data.delivery_type) {
      toast.error('Please select any delivery method to proceed.')
      return
    }

    setLoading(true)
    setOrderSuccessFlag(false)

    const orderItems = order.map(item => ({
      name: item.name,
      product_sku: item.sku,
      quantity: item.quantity,
      description: item.description,
      size: item.size || 'Default Size',
      spice_level: 'Medium',
      extra_toppings: 'Cheese',
      instruction: 'Extra crispy',
      tax_price: '0.00',
      net_price: item.price,
      total_price: (Number(item.price || 0) * item.quantity).toFixed(2),
      profit: ((Number(item.price) - Number(item.purchase_price)) * item.quantity).toFixed(2)
    }))

    // If delivery type is pickup, ensure address is set to default
    const finalAddress = data.delivery_type === 'pickup' ? defaultAddress : data.address

    const submissionData = {
      ...data,
      address: finalAddress, // Ensure pickup uses default address
      restaurant: selectedRestoId,
      user: selectedRestoUserId,
      business: selectedBusiness,
      tax_price: 0.0,
      net_price: subtotal,
      total_price: total,
      // profit: profit.toFixed(2), // Include overall profit
      total_profit: profit.toFixed(2),
      order_items: orderItems,
      is_pos: true
    }

    console.log(submissionData, 'submissionData')

    createOrder(submissionData)
      .then(res => {
        // console.log(res?.data, 'Order Success Response')
        setOrderSuccessData(res?.data)
        setOrderId(res?.data?.id)
        setOrderSuccessFlag(true)
        setLoading(false)
        toast.success('Order created successfully')

        // Reset the order items and form after successful order
        // resetOrderAndForm()
      })
      .catch(error => {
        console.error('Error creating order:', error)
        toast.error(error?.data?.delivery_type[0])
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handlePrintOrder = (id: number, e: any) => {
    e.preventDefault()
    resetOrderAndForm()
    router.push(getLocalizedUrl(`/orders/${id}`, locale as Locale))
  }

  return (
    <div>
      <Box sx={{ bgcolor: 'background.paper' }} className='mb-5'>
        <div className='p-6 rounded'>
          <div className='flex justify-between gap-4 flex-col sm:flex-row'>
            <div className='flex flex-col gap-6'>
              <div className='flex items-center gap-2.5'>
                <Typography variant='h5' className='min-is-[95px]'>
                  Select Outlet:
                </Typography>
                <CustomTextField
                  className='w-full sm:w-auto'
                  select
                  fullWidth
                  value={selectedRestoId}
                  onChange={handleRestoChange}
                  variant='outlined'
                >
                  {restoData.length > 0 ? (
                    restoData.map(resto => (
                      <MenuItem key={resto.id} value={resto.id}>
                        {resto.name}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value='' disabled>
                      No outlet available
                    </MenuItem>
                  )}
                </CustomTextField>
              </div>

              <div>
                <Typography color='text.primary'>{selectedRestoData?.city}</Typography>
                <Typography color='text.primary'>{selectedRestoData?.contact_number}</Typography>
              </div>
              <div className='flex items-center'>
                <CustomTextField
                  label='Enter Special Instruction *'
                  fullWidth
                  multiline
                  rows={3}
                  placeholder='Enter Special Instruction'
                  defaultValue='Check shoes size and color before packing'
                  {...register('special_instruction', { required: 'Special Instruction is required' })}
                  error={!!errors.special_instruction}
                  helperText={errors.special_instruction?.message}
                />
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-4'>
                <Typography variant='h5' className='min-is-[95px]'>
                  Resturant Details:
                </Typography>
              </div>
              <div className='flex items-center'>
                <Typography className='min-is-[95px] mie-4' color='text.primary'>
                  Resturant Status:
                </Typography>
                <Typography className='min-is-[95px] mie-4' color='text.primary'>
                  {selectedRestoData?.active ? 'Active' : 'In Active'}
                </Typography>
              </div>
              <div className='flex items-center'>
                <CustomTextField
                  select
                  fullWidth
                  id='delivery_type'
                  label='Select Delivery Type *'
                  {...register('delivery_type', {
                    required: 'Delivery Type is required'
                  })}
                  error={!!errors.delivery_type}
                  helperText={errors.delivery_type?.message}
                  value={watch('delivery_type') || ''}
                >
                  {' '}
                  <MenuItem key='Select Delivery Type' value='Select Delivery Type'>
                    Select Delivery Type
                  </MenuItem>
                  <MenuItem value='delivery'>Delivery</MenuItem>
                  <MenuItem value='pickup'>Pick Up</MenuItem>
                </CustomTextField>
              </div>
              <div className='flex items-center'>
                <CustomTextField
                  label='Enter Address *'
                  fullWidth
                  multiline
                  rows={3}
                  placeholder='Enter Address'
                  {...register('address', { required: 'Address is required' })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={deliveryType === 'pickup'}
                />
              </div>
            </div>
          </div>
        </div>
      </Box>
      <Box sx={{ display: 'flex', gap: 3, width: '100%' }}>
        <Box sx={{ width: '75%', bgcolor: 'background.paper', textAlign: 'left' }}>
          <Tabs value={value} onChange={handleChange} variant='scrollable' scrollButtons allowScrollButtonsMobile>
            {foodTypeData?.map((food, index) => (
              <Tab label={food.name} key={food.id} value={index} sx={{ fontWeight: 'bold' }} />
            ))}
          </Tabs>
          <Box className='m-5' sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {filteredMenus.length > 0 ? (
              filteredMenus.map((product, index) => (
                <MenuCard
                  key={index}
                  product={product}
                  onAdd={() => addToOrder(product)}
                  currencySymbol={currencySymbol}
                />
              ))
            ) : (
              <Typography variant='h6' color='text.secondary' className='m-5'>
                No menu available
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ width: '25%', bgcolor: 'background.paper' }}>
          <Card sx={{ p: 2 }}>
            <Typography variant='h6' className='mb-4'>
              Current Order
            </Typography>

            {order.length > 0 ? (
              order.map(item => (
                <Box
                  key={item.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    p: 1,
                    borderBottom: '1px solid #eee'
                  }}
                >
                  <Box>
                    <Typography variant='body1'>{item.name}</Typography>

                    <input
                      type='number'
                      value={item.price}
                      min='1'
                      onChange={e => {
                        let newPrice = parseFloat(e.target.value)

                        if (isNaN(newPrice) || newPrice <= 0) {
                          newPrice = 1 // Ensures price is always positive
                        }

                        setOrder(prev =>
                          prev.map(orderItem =>
                            orderItem.id === item.id ? { ...orderItem, price: newPrice } : orderItem
                          )
                        )
                      }}
                      style={{
                        width: '100px',
                        padding: '4px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        textAlign: 'center'
                      }}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size='small'
                      onClick={() => decrementQuantity(item.id)}
                      sx={{ border: '1px solid #ddd' }}
                    >
                      -
                    </IconButton>
                    <Typography component='span' mx={1}>
                      {item.quantity}
                    </Typography>
                    <IconButton
                      size='small'
                      onClick={() => incrementQuantity(item.id)}
                      sx={{ border: '1px solid #ddd' }}
                    >
                      +
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => deleteItem(item.id)}>
                      ×
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant='body2' color='text.secondary' className='mb-4'>
                No items in cart
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal:</Typography>
                <Typography>
                  {currencySymbol} {''}
                  {subtotal.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Tax:</Typography>
                <Typography>0.00</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Profit:</Typography>
                <Typography>
                  {currencySymbol} {''}
                  {profit.toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                <Typography>Total:</Typography>
                <Typography>
                  {currencySymbol} {''}
                  {total.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant='contained'
              color='primary'
              fullWidth
              onClick={handleSubmit(onSubmit)}
              disabled={loading || order.length === 0 || orderSuccessFlag}
            >
              Process Order
            </Button>
            <Button
              style={{ marginTop: '10px' }}
              variant='contained'
              color='primary'
              fullWidth
              onClick={e => handlePrintOrder(orderId, e)}
              disabled={!orderSuccessFlag}
            >
              Print Order
            </Button>
          </Card>
        </Box>
      </Box>
      {loading && <Loader />}
      {/* <Toaster /> */}
    </div>
  )
}

export default OrderMenuBar
