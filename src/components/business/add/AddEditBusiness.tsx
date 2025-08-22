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
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

// Component Imports
import DialogCloseButton from '@/components/dialogs/DialogCloseButton'
import CustomTextField from '@core/components/mui/TextField'
import toast from 'react-hot-toast'
import Loader from '@/components/loader/Loader'
import UpdateConfirmationDialog from '@/components/UpdateConfirmationDialog'

// API Imports
import { createBusiness, updateBusiness } from '@/api/business'
import type { CurrencyDataType } from '@/api/interface/currencyInterface'
import { BusinessDataTypeForAddBusiness, BusinessEditPayload } from '@/api/interface/businessInterface'
import { useSession } from 'next-auth/react'
import { getUserBusinessesById } from '@/api/user'

type AddEditBusinessProps = {
  open: boolean
  setOpen: (open: boolean) => void
  mode: 'add' | 'edit'
  data?: BusinessEditPayload
  currencies: CurrencyDataType[]
  onTypeAdded?: () => void
}

const AddEditBusiness = ({ open, setOpen, mode, data, onTypeAdded, currencies }: AddEditBusinessProps) => {
  const { data: session, update } = useSession()

  const [loading, setLoading] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [payloadData, setPayloadData] = useState<BusinessEditPayload | null>(null)

  const [created, setCreated] = useState(false)
  const [updated, setUpdated] = useState(false)
  const userSession = useSession()
  const userId = userSession?.data?.user?.id!
  //   if (!userSession?.data?.user?.id) {
  //     throw new Error('User ID missing')
  //   }
  //   const userId = userSession.data.user.id // Now safe

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BusinessEditPayload | BusinessDataTypeForAddBusiness>()

  useEffect(() => {
    if (mode === 'edit' && data) {
      reset(data)
    } else {
      reset()
    }
  }, [mode, data, reset, created, updated])

  const handleConfirm = async () => {
    if (!payloadData) return
    try {
      setLoading(true)

      const submittedpayload = {
        business_address: payloadData?.business_address,
        business_contact: payloadData?.business_contact,
        business_desc: payloadData?.business_desc,
        business_id: payloadData?.business_id,
        contact_number: payloadData?.contact_number,
        business_initial: payloadData?.business_initial,
        id: payloadData?.id,
        name: payloadData?.name,
        business_type: payloadData?.business_type
      }

      await updateBusiness(payloadData.id, submittedpayload)
      // const response = await getAllBusiness()
      // const businesses = response?.data?.results ?? []
      const response = await getUserBusinessesById(userId)
      const businesses = response?.data ?? []
      // console.log(businesses, 'allBusinessData before-----------')

      await update({ userBusinesses: businesses })

      toast.success('Business Updated Successfully')
      setUpdated(true)
      onTypeAdded?.()
      setOpen(false)
    } catch (err: any) {
      console.log(err, 'error updating business')
      toast.error(err?.data?.message || 'Error updating business')
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const onSubmit = async (data: BusinessEditPayload | BusinessDataTypeForAddBusiness, e: any) => {
    e.preventDefault()
    if (mode === 'edit') {
      setPayloadData({ ...data, id: data?.id ?? 0 })
      setOpenConfirmation(true)
    } else {
      try {
        setLoading(true)
        const formData: any = new FormData()
        formData.append('business_id', data.business_id)
        formData.append('name', data.name)
        formData.append('business_address', data.business_address)
        formData.append('business_desc', data.business_desc)
        formData.append('contact_number', data.contact_number)
        formData.append('business_initial', data.business_initial)
        formData.append('business_type', data.business_type)
        formData.append('currency', data.currency)

        if (session && session?.user?.user_type === 'admin') {
          formData.append('user', data?.user)
        } else {
          formData.append('user', session?.user?.id)
        }

        if (data.business_doc && data.business_doc instanceof FileList && data.business_doc.length > 0) {
          formData.append('business_doc', data.business_doc[0])
        }

        if (data.logo && data.logo instanceof FileList && data.logo.length > 0) {
          formData.append('logo', data.logo[0])
        }

        await createBusiness(formData)
        const response = await getUserBusinessesById(userId)
        const businesses = response?.data ?? []
        // const response = await getAllBusiness()
        // const businesses = response?.data?.results ?? []
        // console.log(businesses, 'allBusinessData before-----------')

        await update({ userBusinesses: businesses })

        // console.log(businesses, 'allBusinessData after-----------')

        toast.success('Business Created Successfully')
        setCreated(true)
        onTypeAdded?.()
        setOpen(false)
        reset()
      } catch (err: any) {
        console.log(err, 'error for add business')
        if (err?.data?.logo) toast.error(err.data.logo[0])
        else if (err?.data?.business_initial) toast.error(err.data.business_initial[0])
        else if (err?.data?.currency) toast.error(err.data.currency[0])
        else toast.error('Error creating business')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleClose = () => {
    setOpen(false)
    reset()
  }

  return (
    <Dialog fullWidth open={open} maxWidth='md' scroll='body' sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}>
      <DialogCloseButton onClick={handleClose} disableRipple>
        <i className='tabler-x' />
      </DialogCloseButton>
      <DialogTitle variant='h4' className='flex gap-2 flex-col text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {mode === 'edit' ? 'Edit Business Information' : 'Add Business Information'}
        {mode === 'edit' && (
          <Typography component='span' className='flex flex-col text-center'>
            Updating Business details will receive a privacy audit.
          </Typography>
        )}
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent className='overflow-visible pbs-0 sm:pli-16'>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business Name *'
                fullWidth
                placeholder='Enter Business Name'
                defaultValue={data?.name || ''}
                {...register('name', { required: 'Business Name is required' })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business Meta Id *'
                fullWidth
                // type='number'
                placeholder='Enter business Meta Id'
                defaultValue={data?.business_id || ''}
                {...register('business_id', { required: 'Business Meta Id is required' })}
                error={!!errors.business_id}
                helperText={errors.business_id?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <CustomTextField
                label='Business Description *'
                fullWidth
                placeholder='Enter business description'
                defaultValue={data?.business_desc || ''}
                {...register('business_desc', { required: 'Business description is required' })}
                error={!!errors.business_desc}
                helperText={errors.business_desc?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business Address *'
                fullWidth
                placeholder='Enter business address'
                defaultValue={data?.business_address || ''}
                {...register('business_address', { required: 'Business address is required' })}
                error={!!errors.business_address}
                helperText={errors.business_address?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Business Initial *'
                fullWidth
                placeholder='Enter business initial (A-Z only, max 5 letters)'
                defaultValue={data?.business_initial || ''}
                {...register('business_initial', {
                  required: 'Business initial is required',
                  pattern: {
                    value: /^[A-Z]{1,5}$/,
                    message: 'Up to 5 capital letters (A–Z) are allowed'
                  }
                })}
                error={!!errors.business_initial}
                helperText={errors.business_initial?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                label='Contact number *'
                fullWidth
                placeholder='Enter contact number'
                defaultValue={data?.contact_number || ''}
                {...register('contact_number', { required: 'Contact number is required' })}
                error={!!errors.contact_number}
                helperText={errors.contact_number?.message}
              />
            </Grid>
            {mode === 'add' && (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  label='Currency *'
                  {...register('currency', { required: 'Currency is required' })}
                  error={!!errors.currency}
                  helperText={errors.currency?.message}
                >
                  {currencies &&
                    currencies.map(item => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.label}
                      </MenuItem>
                    ))}
                </CustomTextField>
              </Grid>
            )}
            {mode === 'edit' && (
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label='Currency *'
                  defaultValue={data?.currency?.label || ''}
                  disabled={mode === 'edit'}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={6}>
              <CustomTextField
                select
                fullWidth
                label='Business Type *'
                defaultValue={data?.business_type || ''}
                {...register('business_type', { required: 'Business type is required' })}
                error={!!errors.business_type}
                helperText={errors.business_type?.message}
                // disabled={mode === 'edit'}
              >
                {[
                  { id: 'Fast_food', label: 'Fast Food' },
                  { id: 'Clothes', label: 'Clothes' },
                  { id: 'Shoes', label: 'Shoes' },
                  { id: 'Electronics', label: 'Electronics' },
                  { id: 'Grocery', label: 'Grocery' },
                  { id: 'Salon', label: 'Salon' },
                  { id: 'Pharmacy', label: 'Pharmacy' },
                  { id: 'Books', label: 'Books' },
                  { id: 'Hardware', label: 'Hardware' },
                  { id: 'Furniture', label: 'Furniture' },
                  { id: 'Other', label: 'Other' }
                ].map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.label}
                  </MenuItem>
                ))}
              </CustomTextField>
            </Grid>

            {mode === 'add' && (
              <>
                <Grid item xs={12} sm={6}>
                  <CustomTextField
                    type='file'
                    label='Business Document *'
                    fullWidth
                    {...register('business_doc', { required: 'Business document is required' })}
                    error={!!errors.business_doc}
                    helperText={errors.business_doc?.message}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <CustomTextField type='file' label='Business Logo' fullWidth {...register('logo')} />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit' disabled={loading}>
            Submit
          </Button>
          <Button variant='tonal' color='secondary' type='reset' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
        {loading && <Loader />}
      </form>

      {mode === 'edit' && (
        <UpdateConfirmationDialog
          openConfirmation={openConfirmation}
          onClose={() => setOpenConfirmation(false)}
          onConfirm={handleConfirm}
          title='Edit Business'
          description='Are you sure you want to edit this business?'
        />
      )}
    </Dialog>
  )
}

export default AddEditBusiness
