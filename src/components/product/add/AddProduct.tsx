'use client'

// React Imports
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

// MUI Imports
import Grid from '@mui/material/Grid'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import { MenuDataType } from '@/api/interface/menuIterface'
import { createMenu } from '@/api/menu'
import toast from 'react-hot-toast'
import { ToppingDataType } from '@/api/interface/toppingInterface'
import { getAllFoodTypesOfSpecificBusiness } from '@/api/foodTypes'
import OpenDialogOnElementClick from '@/components/dialogs/OpenDialogOnElementClick'
import type { ButtonProps } from '@mui/material/Button'
import type { ThemeColor } from '@core/types'
import Loader from '@/components/loader/Loader'
import AddType from '@/components/dialogs/add-type'
import { BusinessType } from '@/api/interface/businessInterface'
import { ListItemText } from '@mui/material'

type AddProductFormProps = {
  open: boolean
  setOpen: (open: boolean) => void
  data?: MenuDataType
  businesses: BusinessType[]
  onTypeAdded?: any
}

const buttonProps = (children: string, color: ThemeColor, variant: ButtonProps['variant']): ButtonProps => ({
  children,
  color,
  variant
})

const AddProduct = ({ open, setOpen, onTypeAdded, businesses }: AddProductFormProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  const [FoodTypeData, setFoodTypeData] = useState<ToppingDataType[]>([])
  const [addType, setAddType] = useState<boolean>(false)

  const [businessId, setBusinessId] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<MenuDataType>()

  const fetchFoodTypes = async () => {
    try {
      const response = await getAllFoodTypesOfSpecificBusiness(businessId)

      setFoodTypeData(response?.data)
    } catch (error: any) {
      // Handle error
    }
  }

  useEffect(() => {
    if (businessId) {
      fetchFoodTypes()
    }
  }, [addType, businessId])

  const handleBusinessChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedBusiness = businesses.find(b => b.id === event.target.value)
    if (selectedBusiness) {
      setBusinessId(selectedBusiness.business_id) // Store business.business_id in state
    } else {
      setBusinessId('')
    }
  }

  // States
  const onSubmitProduct = (data: MenuDataType, e: any) => {
    e.preventDefault()
    setLoading(true)
    setAddType(false)

    const payload = {
      ...data,
      title: data.title,
      brand: data.brand,
      description: data.description,
      availability: 'in stock',
      condition: 'good',
      business: data.business,
      restaurant: data.restaurant,
      image_link: data.image_link,
      link: data.link,
      price: data.price,
      sale_price: data.sale_price,
      sku: data.sku,
      type: data.type
    }

    createMenu(payload)
      .then(res => {
        toast.success('Product created successfully', {
          duration: 5000
        })
        if (onTypeAdded) {
          onTypeAdded()
        }

        setAddType(true)
        reset()
        setOpen(false)
      })
      .catch(error => {
        if (error?.data && error?.data?.availability[0]) {
          toast.error(error?.data?.availability[0], {
            duration: 5000
          })
        } else {
          toast.error('Error in creating Product', {
            duration: 5000
          })
        }
      })
      .finally(() => {
        setLoading(false)
        reset()
      })
  }

  const handleReset = () => {
    setOpen(false)
    reset()
    setBusinessId('')
  }

  const handleTypeAdded = () => {
    fetchFoodTypes()
  }
  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={() => setOpen(false)} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>

      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        Add Product Information
      </DialogTitle>
      <div>
        <form
          // onSubmit={handleSubmit(onSubmit)}
          onSubmit={e => e.preventDefault()}
        >
          <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
            <Grid container spacing={5} alignItems='center'>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Title *'
                  fullWidth
                  placeholder='Enter Title'
                  {...register('title', { required: 'Title is required' })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  InputLabelProps={{
                    className: errors.title && 'requiredFieldError'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Sku *'
                  fullWidth
                  placeholder='Enter sku'
                  // {...register('sku', { required: 'sku is required' })}
                  {...register('sku', {
                    required: 'SKU is required',
                    pattern: {
                      value: /^[a-z0-9_]+$/,
                      message: 'Only lowercase letters, numbers, and underscores are allowed'
                    }
                  })}
                  error={!!errors.sku}
                  helperText={errors.sku?.message}
                  InputLabelProps={{
                    className: errors.sku && 'requiredFieldError'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  id='business'
                  label='Business *'
                  {...register('business', { required: 'Business Id is required ' })}
                  error={!!errors.business}
                  helperText={errors.business?.message}
                  onChange={handleBusinessChange}
                >
                  {businesses.length > 0 ? (
                    businesses.map(business => (
                      <MenuItem key={business.id} value={business.id}>
                        {business.business_id}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>
                      <ListItemText primary='No business found' />
                    </MenuItem>
                  )}
                </CustomTextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Brand*'
                  fullWidth
                  placeholder='Enter Brand'
                  {...register('brand', { required: 'Brand Name is required ' })}
                  error={!!errors.brand}
                  helperText={errors.brand?.message}
                  InputLabelProps={{
                    className: errors.brand && 'requiredFieldError'
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Purchase Price *'
                  fullWidth
                  type='number'
                  placeholder='Enter purchase price'
                  {...register('price', {
                    required: 'Purchase Price is required'
                    // pattern: {
                    //   value: /^(?:\s*(Rs|₨|PKR|\$|USD)?\s*\d{1,3}(?:[,.]?\d{3})*(?:\.\d{1,2})?\s*(Rs|₨|PKR|\$|USD)?)$/i,
                    //   message:
                    //     'Please enter a valid price in PKR or USD (e.g., Rs 1999, $5000, 1000 PKR, ₨120000, 1,000 USD)'
                    // }
                  })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  InputLabelProps={{
                    className: errors.price && 'requiredFieldError'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Sale Price *'
                  fullWidth
                  type='number'
                  placeholder='Enter Sale  price '
                  {...register('sale_price', {
                    required: 'Sale Price is required'
                    // pattern: {
                    //   value: /^(?:\s*(Rs|₨|PKR|\$|USD)?\s*\d{1,3}(?:[,.]?\d{3})*(?:\.\d{1,2})?\s*(Rs|₨|PKR|\$|USD)?)$/i,
                    //   message:
                    //     'Please enter a valid price in PKR or USD (e.g., Rs 1999, $5000, 1000 PKR, ₨120000, 1,000 USD)'
                    // }
                  })}
                  error={!!errors.sale_price}
                  helperText={errors.sale_price?.message}
                  InputLabelProps={{
                    className: errors.sale_price && 'requiredFieldError'
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Description *'
                  fullWidth
                  placeholder='Enter Description '
                  {...register('description', { required: 'Description is required ' })}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  InputLabelProps={{
                    className: errors.description && 'requiredFieldError'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Product Link *'
                  fullWidth
                  placeholder='Enter Product link '
                  {...register('link', { required: 'Product Link is required ' })}
                  error={!!errors.link}
                  helperText={errors.link?.message}
                  InputLabelProps={{
                    className: errors.link && 'requiredFieldError'
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  label='Image Link *'
                  fullWidth
                  placeholder='Enter Image Link '
                  {...register('image_link', { required: 'Image Link is required ' })}
                  error={!!errors.image_link}
                  helperText={errors.image_link?.message}
                  InputLabelProps={{
                    className: errors.image_link && 'requiredFieldError'
                  }}
                />
              </Grid>
              {businessId && (
                <>
                  <Grid item xs={12} sm={6}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <CustomTextField
                        select
                        fullWidth
                        label='Choose Type *'
                        {...register('type', { required: 'Type is required' })}
                        error={!!errors.business}
                        helperText={errors.business?.message}
                        InputLabelProps={{
                          className: errors.type && 'requiredFieldError'
                        }}
                        style={{ flex: 1 }} // Takes up remaining space
                      >
                        {FoodTypeData.length > 0 ? (
                          FoodTypeData.map(food => (
                            <MenuItem key={food.id} value={food.id}>
                              {food.name}
                            </MenuItem>
                          ))
                        ) : (
                          <MenuItem disabled value=''>
                            No type available
                          </MenuItem>
                        )}
                      </CustomTextField>

                      <div style={{ marginLeft: '10px', marginTop: errors.title ? '0px' : '17px', flex: '0 0 10%' }}>
                        <OpenDialogOnElementClick
                          element={Button}
                          elementProps={buttonProps('Add', 'primary', 'contained')}
                          dialog={AddType}
                          dialogProps={{ businesses: businesses }}
                          onTypeAdded={handleTypeAdded} // Pass the callback
                        />
                      </div>
                    </div>
                  </Grid>
                </>
              )}
            </Grid>
            <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16 mt-5'>
              <Button variant='contained' type='button' disabled={loading} onClick={handleSubmit(onSubmitProduct)}>
                Submit
              </Button>
              <Button variant='tonal' color='error' type='reset' onClick={() => handleReset()}>
                Cancel
              </Button>
            </DialogActions>

            {loading && <Loader />}
          </DialogContent>
        </form>
      </div>
    </Dialog>
  )
}

export default AddProduct
