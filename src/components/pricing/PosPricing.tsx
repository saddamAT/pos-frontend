'use client'

import CustomInputVertical from '@/@core/components/custom-inputs/Vertical'
import { CustomInputVerticalData } from '@/@core/components/custom-inputs/types'
import { createUserSubscription, getUserSubscription, updateUserSubscription } from '@/api/subscription'
import { CreationSubscription, UserSubscription } from '@/types/apps/subscriptions'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import type { TypographyProps } from '@mui/material/Typography'
import { styled } from '@mui/material/styles'

import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'

/* -------------------- DESIGN (COPIED 1:1) -------------------- */

const Content = styled(Typography, {
  name: 'MuiCustomInputVertical',
  slot: 'content'
})<TypographyProps>(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center'
}))

type PlanOption = CustomInputVerticalData & {
  label: string
  price: number
}

const planOptions: PlanOption[] = [
  {
    label: 'Aiming to Try',
    price: 0,
    title: <Typography variant='h3'>Aiming to Try</Typography>,
    value: 'trial',
    content: (
      <Content component='div' className='flex flex-col justify-center items-center gap-2 p-2'>
        <Typography>Free 30-Day Trial</Typography>
        <div className='flex flex-col items-center my-4'>
          <Typography variant='h2'>FREE</Typography>
          <Typography className='text-xs'>30-Day Trial</Typography>
        </div>
        <ul className='text-start'>
          <li>Accounting System Agnostic</li>
          <li>Process Training</li>
          <li>Access to Support</li>
          <li>Process up to 1,000 Invoices</li>
        </ul>
      </Content>
    )
  },
  {
    label: 'Aiming to Start',
    price: 2000,
    title: <Typography variant='h3'>Aiming to Start</Typography>,
    value: 'start',
    content: (
      <Content component='div' className='flex flex-col justify-center items-center gap-2'>
        <Typography>Starting at $2,000</Typography>
        <div className='flex flex-col items-center my-4'>
          <Typography variant='h2'>$2,000</Typography>
          <Typography className='text-xs'>Monthly</Typography>
        </div>
        <ul className='text-start'>
          <li>Up to 2,500 Invoices/Month</li>
          <li>Invoice Entry and Coding</li>
          <li>Invoice Approval Routing</li>
          <li>Priority Support</li>
        </ul>
      </Content>
    )
  },
  {
    label: 'Aiming to Scale',
    price: 3000,
    title: <Typography variant='h3'>Aiming to Scale</Typography>,
    value: 'scale',
    content: (
      <Content component='div' className='flex flex-col justify-center items-center gap-2'>
        <Typography>Starting at $3,000</Typography>
        <div className='flex flex-col items-center my-4'>
          <Typography variant='h2'>$3,000</Typography>
          <Typography className='text-xs'>Monthly</Typography>
        </div>
        <ul className='text-start'>
          <li>Up to 5,000 Invoices/Month</li>
          <li>Invoice Entry and Coding</li>
          <li>Invoice Approval Routing</li>
          <li>PO Matching</li>
          <li>Priority Support</li>
        </ul>
      </Content>
    )
  },
  {
    label: 'Enterprise',
    price: 5000,
    title: <Typography variant='h3'>Enterprise</Typography>,
    value: 'enterprise',
    content: (
      <Content component='div' className='flex flex-col justify-center items-center gap-2'>
        <Typography>Processing more than 5,000</Typography>
        <Typography>invoices/month?</Typography>
        <div className='flex flex-col items-center my-4'>
          <Typography variant='h2'>$5,000+</Typography>
          <Typography className='text-xs'>Contact Us for</Typography>
          <Typography className='text-xs'>Enterprise Pricing options.</Typography>
        </div>
      </Content>
    )
  }
]

/* -------------------- COMPONENT -------------------- */

const PosPricing: React.FC = () => {
  const methods = useForm<CreationSubscription>({ defaultValues: { plan: '' } })
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors }
  } = methods

  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [activeSubscription, setActiveSubscription] = useState<UserSubscription | null>(null)

  const selectedBusinessId = session?.user?.selectedBusiness?.id ?? null

  const fetchUserSubscription = async () => {
    if (!session?.user?.id || !selectedBusinessId) return

    try {
      setLoading(true)

      const response = await getUserSubscription(selectedBusinessId)
      const subscriptions: UserSubscription[] = response.data.results ?? []

      const active = subscriptions.find(
        sub => sub.is_active === true && sub.user === session.user.id && sub.business === selectedBusinessId
      )

      if (active) {
        setActiveSubscription(active)
        setValue('plan', active.plan)
      } else {
        setActiveSubscription(null)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserSubscription()
  }, [selectedBusinessId])

  const onSubmit = async (data: CreationSubscription) => {
    if (!session?.user?.id || !selectedBusinessId) {
      toast.error('Missing user or business')
      return
    }

    const selectedPlan = planOptions.find(p => p.value === data.plan)
    if (!selectedPlan) {
      toast.error('Invalid subscription plan')
      return
    }

    const payload: CreationSubscription = {
      plan: data.plan,
      price: selectedPlan.price,
      trial_limit: 4,
      notes: 'Initial plan',
      is_active: true,
      user: session.user.id,
      business: selectedBusinessId
    }

    try {
      if (activeSubscription) {
        await updateUserSubscription(activeSubscription.id, selectedBusinessId, payload)
        toast.success('Subscription updated successfully')
      } else {
        await createUserSubscription(payload)
        toast.success('Subscription created successfully')
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.detail ?? 'Something went wrong')
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mb-5 text-center'>
          <Typography variant='h4'>Select Plan</Typography>
          <Typography>Select plan as per your requirement</Typography>
        </div>

        <Controller
          name='plan'
          control={control}
          rules={{ required: 'Please select a plan' }}
          render={({ field }) => (
            <Grid container spacing={5}>
              {planOptions.map(option => (
                <CustomInputVertical
                  key={option.value}
                  type='radio'
                  data={option}
                  selected={field.value}
                  name={field.name}
                  handleChange={valOrEv => {
                    const val = typeof valOrEv === 'string' ? valOrEv : valOrEv.target.value
                    field.onChange(val)
                  }}
                />
              ))}
            </Grid>
          )}
        />

        {errors.plan && (
          <Typography variant='body2' color='error' align='center' className='mt-2'>
            {errors.plan.message}
          </Typography>
        )}

        <Button type='submit' variant='contained' className='mt-6'>
          Confirm Plan
        </Button>

        {loading && <Typography className='mt-4 text-center'>Loading…</Typography>}
      </form>
    </FormProvider>
  )
}

export default PosPricing
