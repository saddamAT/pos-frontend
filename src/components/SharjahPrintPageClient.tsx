'use client'

import React, { useEffect, useRef, useState } from 'react'

import styles from '@/styles/Receipt.module.css'
import { getOrderById } from '@/api/order'
import { OrderItems } from '@/types/apps/orderTypes'
import { BusinessDataTypeForAddBusiness } from '@/api/interface/businessInterface'

import { convertToPakistanTime } from '@/utils/dateUtils'

interface PrintPageProps {
  id: string
}

const SharjahPrintPageClient: React.FC<PrintPageProps> = ({ id }) => {
  const [orderAddress, setOrderAddress] = useState<string | null>(null)
  const [deliveryType, setDeliveryType] = useState<string | null>(null)
  const [orderCreatedDate, setOrderCreatedDate] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [orderItemsData, setOrderItemsData] = useState<OrderItems[]>([])
  const [orderBusinessData, setOrderBusinessData] = useState<BusinessDataTypeForAddBusiness | null>(null)
  const [orderBusinessName, setOrderBusinessName] = useState<string | null>(null)
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [orderTotalPrice, setOrderTotalPrice] = useState<string | null>(null)
  const [currencySymbol, setCurrencySymbol] = useState('')

  const myRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrderById(Number(id))
        const orderData = response?.data

        if (!orderData.is_pos && orderData.delivery_type === 'delivery') {
          const refinedAddress = orderData.address.replace(/Textinput /g, '')
          setOrderAddress(refinedAddress)
        } else {
          setOrderAddress(orderData.address)
        }

        setOrderTotalPrice(response?.data?.total_price)
        setOrderNumber(response?.data?.order_number)
        setOrderItemsData(response?.data?.order_items)
        setOrderBusinessData(response?.data?.business)
        setOrderBusinessName(response?.data?.business?.name)
        setOrderCreatedDate(response?.data?.created_at)
        setDeliveryType(response?.data?.delivery_type)
        setCurrencySymbol(response?.data?.business?.currency?.symbol)
      } catch (error: any) {
        console.error('An error occurred while fetching order data:', error)
      }
    }
    fetchOrder()
  }, [id])

  useEffect(() => {
    const calculateTotal = () => {
      const sum = orderItemsData.reduce((acc, item) => {
        // changed total_price to net_price to fix the mismatched value
        const itemTotal = item.quantity * parseFloat(item.net_price)
        return acc + itemTotal
      }, 0)
      setTotalAmount(sum)
    }
    calculateTotal()
  }, [orderItemsData])

  return (
    <>
      <div className={styles.receiptContainer} ref={myRef}>
        <div
          style={{
            textAlign: 'center',
            borderRadius: '8px',
            fontFamily: 'Alvi Nastaleeq, Noto Nastaliq Urdu, Jameel Noori Nastaleeq, serif'
          }}
        >
          <div className='mt-5 font-bold text-[25px]'>Sharjah 👠</div>
          <p>{orderAddress ? orderAddress : 'No order Address Found'}</p>
          <p style={{ fontWeight: 'bold' }}>Order ID: {orderNumber ? orderNumber : 'No order number found'}</p>
          Date: {orderCreatedDate ? convertToPakistanTime(orderCreatedDate) : 'No date available'}
          <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
        </div>

        <div
          style={{
            marginTop: '10px',
            borderRadius: '8px',
            fontFamily: 'Alvi Nastaleeq, Noto Nastaliq Urdu, Jameel Noori Nastaleeq, serif'
          }}
        >
          {orderItemsData.length > 0 ? (
            orderItemsData.map(item => (
              <div key={item.id}>
                <h3>{item.name}</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '30px', marginTop: '5px' }}>
                  <p>
                    {item.quantity} × {currencySymbol} {''} {parseFloat(item.net_price).toFixed(2)}
                  </p>
                  {/* <p>=</p> */}
                  <p>
                    {currencySymbol} {''} {(item.quantity * parseFloat(item.net_price)).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No order items found.</p>
          )}
          <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
        </div>

        <div
          style={{
            textAlign: 'right',
            borderRadius: '8px',
            fontFamily: 'Alvi Nastaleeq, Noto Nastaliq Urdu, Jameel Noori Nastaleeq, serif'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginTop: '5px' }}>
            <p>Delivery Cost</p>
            <p> - 0.00</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginTop: '5px' }}>
            <p>Service Charge</p>
            <p> - 0.00</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', marginTop: '5px' }}>
            <p>Total</p>
            {/* <p style={{ textAlign: 'start' }}>=</p> */}
            <p>
              {currencySymbol} {''}
              {orderTotalPrice}
            </p>
          </div>
          <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
        </div>

        <div
          style={{
            borderRadius: '8px',
            fontFamily: 'Alvi Nastaleeq, Noto Nastaliq Urdu, Jameel Noori Nastaleeq, serif',
            fontWeight: 'bold'
          }}
        >
          <h3>The order has not been paid.</h3>
          <h4>
            Customer will pay with {currencySymbol} {''} {orderTotalPrice}
          </h4>
          <hr style={{ borderTop: '1px solid gray', margin: '10px 0' }} />
        </div>

        <div style={{ textAlign: 'right', direction: 'rtl' }}>
          <ul
            style={{
              textAlign: 'right',
              direction: 'rtl',
              margin: '10px',
              padding: '15px',
              borderRadius: '8px',
              fontFamily: "'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif",
              fontSize: '12px', // Adjust size for better readability
              lineHeight: '1.5' // Improves spacing for Nastaliq script
            }}
          >
            <li> استعمال شدہ جوتا واپس یا تبدیل نہیں ہوگا۔</li>
            <li> جوتے کی واپسی یا تبدیلی صرف 3 دن کے اندر ممکن ہے، بشرطیکہ جوتا بغیر استعمال اور اصل حالت میں ہو۔</li>
            <li> خریداری کی رسید کے بغیر کوئی کلیم قابل قبول نہیں ہوگا۔</li>
            <li> ڈسکاؤنٹ یا سیل پر خریدے گئے جوتے قابل واپسی یا تبدیلی نہیں ہوں گے۔</li>
            <li> سائز کی تبدیلی صرف دستیاب اسٹاک پر منحصر ہوگی۔</li>
            <li> اگر جوتے میں کسی قسم کا فیکٹری نقص ہو تو 7 دن کے اندر تبدیل کیا جا سکتا ہے۔</li>
            <li> مٹی، پانی یا دیگر کسی بھی بیرونی عوامل سے خراب شدہ جوتے کلیم کے اہل نہیں ہوں گے۔</li>
            <li> کسٹمر کی اپنی پسند یا ناپسند کی بنیاد پر واپسی یا ریفنڈ ممکن نہیں ہوگا۔</li>
            <li> تمام کلیمز دکان کی پالیسی کے مطابق پرکھے جائیں گے اور حتمی فیصلہ دکان کے اختیار میں ہوگا۔</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default SharjahPrintPageClient
