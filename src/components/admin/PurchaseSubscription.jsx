"use client"
import { BuySubscription } from '@/lib/actions'
import React from 'react'

const PurchaseSubscription = ({bodyColor}) => {
  return (
    <div>
    <form action={BuySubscription}>
      <button
        type="submit"
        className="px-[30px] rounded-sm  hover:!opacity-90 text-white font-semibold py-2"
        style={{backgroundColor:bodyColor || "#ae6af5"}}
      >
        Buy Now
      </button>
    </form>
  </div>
  )
}

export default PurchaseSubscription