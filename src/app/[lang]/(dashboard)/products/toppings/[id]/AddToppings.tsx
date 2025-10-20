// MUI Imports
'use client'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import CustomTextField from '@core/components/mui/TextField'
import { useForm } from 'react-hook-form'
import MenuItem from '@mui/material/MenuItem'
import Loader from '@/components/loader/Loader'
import { createToppings } from '@/api/toppings'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import type { ButtonProps } from '@mui/material/Button'
import type { ThemeColor } from '@core/types'
import AddType from '@/components/dialogs/add-type'
import { getAllFoodTypesOfSpecificBusiness } from '@/api/foodTypes'
import { ToppingDataType } from '@/api/interface/toppingInterface'
import { BusinessType } from '@/api/interface/businessInterface'
import { ListItemText } from '@mui/material'
import { useAuthStore } from '@/store/authStore'

type PreviewToppingsProps = {
  id: string
  isCreated: boolean
  onCreateTopping: (isCreated: boolean) => void
}
const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

const AddToppings = ({ id, isCreated, onCreateTopping }: PreviewToppingsProps) => {
  const [FoodTypeData, setFoodTypeData] = useState<ToppingDataType[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [addType, setAddType] = useState<boolean>(false)
  const [businessId, setBusinessId] = useState<string>('')
  const { businessData } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ToppingDataType>()

  const handleBusinessChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedBusinessId = Number(event.target.value)
    // const selectedBusiness = businessData.find(b => b.id === selectedBusinessId)
    const selectedBusiness = businessData.find((b: BusinessType) => b.id === selectedBusinessId)

    if (selectedBusiness) {
      setBusinessId(selectedBusiness.business_id)
    } else {
      setBusinessId('')
    }
  }

  const onSubmitTopping = (data: ToppingDataType, e: any) => {
    e.preventDefault()
    onCreateTopping(false)
    setLoading(true)

    createToppings(data)
      .then(res => {
        toast.success('Topping saved successfully')
        onCreateTopping(true)
        setAddType(true)
        reset()
        reset({
          business: 0,
          type: 0
        })
      })
      .catch(error => {
        if (error?.data && error?.data?.name[0]) {
          toast.error(error?.data?.name[0])
        } else {
          toast.error('Error in creating order')
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    const fetchFoodTypes = async () => {
      try {
        const response = await getAllFoodTypesOfSpecificBusiness(businessId)
        setFoodTypeData(response?.data)
      } catch (error: any) {
        // Handle error
      }
    }
    fetchFoodTypes()
  }, [id, addType, businessId])

  const handleTypeAdded = async () => {
    try {
      const response = await getAllFoodTypesOfSpecificBusiness(businessId)
      setFoodTypeData(response?.data)
      reset({
        business: 0,
        type: 0
      })
    } catch (error) {
      console.log(error, 'Error fetching updated food types')
    }
    // }

    // fetchTopping()
    // reset({
    //   business: 0,
    //   type: 0
    // })
  }

  return (
    <>
      <Card>
        <form onSubmit={e => e.preventDefault()} className='flex flex-col gap-6 p-6'>
          <Grid container spacing={5} alignItems='center'>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Topping Name *'
                fullWidth
                placeholder='Enter Topping Name'
                {...register('name', { required: 'Topping Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                id='business'
                label='Select Business*'
                value={watch('business') || 0}
                {...register('business', {
                  required: 'Business ID is required',
                  validate: value => (value !== 0 ? true : 'Business ID is required'),
                  onChange: e => {
                    handleBusinessChange(e)
                    return e.target.value // Make sure to return the value for react-hook-form
                  }
                })}
                error={!!errors.business}
                helperText={errors.business?.message}
              >
                <MenuItem key='Select Business' value={0}>
                  Select Business
                </MenuItem>

                {businessData && businessData.length > 0 ? (
                  businessData.map((business: BusinessType) => (
                    <MenuItem key={business.id} value={business.id}>
                      {business.business_id}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled value=''>
                    <ListItemText primary='No business found' />
                  </MenuItem>
                )}
              </CustomTextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Topping Description *'
                fullWidth
                placeholder='Enter Topping Description'
                {...register('description', { required: 'Topping Description is required' })}
                error={!!errors.description}
                helperText={errors.description?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Additional Price *'
                fullWidth
                type='number'
                placeholder='Enter Additional Price'
                inputProps={{ step: 'any', min: '0.1' }} // Allows precise decimal values
                {...register('additional_price', {
                  required: 'Additional Price is required',
                  pattern: {
                    value: /^(0\.\d*[1-9]\d*|[1-9]\d*(\.\d+)?|\d)$/, // Accepts positive integers & decimals, prevents leading zeros
                    message: 'Only positive integers or decimal values are allowed'
                  },
                  min: {
                    value: 0.1, // Ensures greater than 0
                    message: 'Value must be at least 0.1'
                  }
                })}
                error={!!errors.additional_price}
                helperText={errors.additional_price?.message}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              {businessId && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CustomTextField
                    select
                    fullWidth
                    id='business'
                    label='Select Food Type *'
                    value={watch('type') || 0}
                    {...register('type', {
                      required: 'Food Type is required',
                      validate: value => (value !== 0 ? true : 'Food Type is required')
                    })}
                    error={!!errors.type}
                    helperText={errors.type?.message}
                    style={{ flex: 1 }} // Takes up remaining space
                  >
                    <MenuItem key='Select Food Type' value={0}>
                      Select Food Type
                    </MenuItem>
                    {FoodTypeData &&
                      FoodTypeData?.map(food => (
                        <MenuItem key={food.id} value={food.id}>
                          {food.name}
                        </MenuItem>
                      ))}
                  </CustomTextField>

                  <div style={{ marginLeft: '10px', marginTop: errors.description ? '0px' : '15px', flex: '0 0 10%' }}>
                    <OpenDialogOnElementClick
                      element={Button}
                      elementProps={buttonProps('Add', 'primary', 'contained')}
                      dialog={AddType}
                      dialogProps={{}}
                      onTypeAdded={handleTypeAdded} // Pass the callback
                    />
                  </div>
                </div>
              )}
            </Grid>

            <Grid item xs={12} sm={6}>
              <div className='flex items-center gap-4' style={{ marginTop: errors.description ? '0px' : '15px' }}>
                <Button variant='contained' type='button' onClick={handleSubmit(onSubmitTopping)} disabled={loading}>
                  Save Topping
                </Button>
              </div>
              {loading && <Loader />}
            </Grid>
          </Grid>
        </form>
      </Card>
    </>
  )
}

export default AddToppings
