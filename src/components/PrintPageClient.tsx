'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from '@/styles/Receipt.module.css'
import { getOrderById } from '@/api/order'
import { OrderItems } from '@/types/apps/orderTypes'
import { convertToPakistanTime } from '@/utils/dateUtils'

interface PrintPageProps {
  id: string
}

const PrintPageClient: React.FC<PrintPageProps> = ({ id }) => {
  const [orderAddress, setOrderAddress] = useState<string | null>(null)
  const [orderCreatedDate, setOrderCreatedDate] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [currencySymbol, setCurrencySymbol] = useState<string | null>(null)
  const [orderItemsData, setOrderItemsData] = useState<OrderItems[]>([])
  const [orderBusinessName, setOrderBusinessName] = useState<string | null>(null)
  const [orderTotalPrice, setOrderTotalPrice] = useState<string | null>(null)

  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(Number(id))
        const orderData = response?.data

        setCurrencySymbol(orderData?.business?.currency?.symbol)

        if (!orderData.is_pos && orderData.delivery_type === 'delivery') {
          // Remove "Textinput " from the address field
          const refinedAddress = orderData.address.replace(/Textinput /g, '')
          setOrderAddress(refinedAddress)
        } else {
          setOrderAddress(orderData.address)
        }

        setOrderTotalPrice(response?.data?.total_price)
        setOrderNumber(response?.data?.order_number)
        setOrderItemsData(response?.data?.order_items)
        setOrderBusinessName(response?.data?.business?.name)
        setOrderCreatedDate(response?.data?.created_at)
      } catch (error: any) {
        console.error('An error occurred while fetching order data:', error)
      }
    }
    fetchOrder()
  }, [id])

  return (
    <>
      <div className={styles.receiptContainer} ref={myRef}>
        <div className='flex justify-center items-center w-full'>
          <h1 className='p-4'>{orderBusinessName && orderBusinessName}</h1>
        </div>

        <div className='text-center'>
          <p>{orderAddress ? orderAddress : 'No order Address Found'}</p>
          <p className='font-bold'>Order ID: {orderNumber ? orderNumber : 'No order number found'}</p>
          Date: {orderCreatedDate ? convertToPakistanTime(orderCreatedDate) : 'No date available'}
          <hr className='border-t border-gray-400 my-2.5' />
        </div>

        <div className='mt-2.5 text-start'>
          {orderItemsData.length > 0 ? (
            orderItemsData.map(item => (
              <div key={item.id}>
                <h3>{item.name}</h3>
                <div className='flex justify-between gap-[30px]'>
                  <p>
                    {item.quantity} × {currencySymbol} {parseFloat(item.net_price).toFixed(2)}
                  </p>
                  <p>
                    {' '}
                    {currencySymbol} {(item.quantity * parseFloat(item.net_price)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No order items found.</p>
          )}
          <hr className='border-t border-gray-400 my-2.5' />
        </div>

        <div className='mt-2.5 text-start'>
          <div className='flex justify-between gap-[40px]'>
            <p>Delivery Cost</p>
            <p> - {currencySymbol}0.00</p>
          </div>
          <div className='flex justify-between gap-[40px]'>
            <p>Service Charge</p>
            <p> -{currencySymbol}0.00</p>
          </div>
          <div className='flex justify-between gap-[40px]'>
            <p>Total</p>
            <p>
              {' '}
              {currencySymbol}
              {Number(orderTotalPrice).toFixed(2)}
            </p>
          </div>
          <hr className='border-t border-gray-400 my-2.5' />
        </div>

        <div className='mt-2.5 text-start'>
          <h3>The order has not been paid.</h3>
          <h4>
            Customer will pay with {currencySymbol}
            {/* {orderTotalPrice} */}
            {Number(orderTotalPrice).toFixed(2)}
          </h4>
          <hr className='border-t border-gray-400 my-2.5' />
        </div>
      </div>
    </>
  )
}

export default PrintPageClient
