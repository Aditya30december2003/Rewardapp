import { formatDateToLocal } from "@/lib/utils";
import React from "react";
import Empty from "../ui/Empty";

const TransactionHistory = ({ transactions }) => {


  if(transactions.length===0) return(
    <section className="mb-4 mt-6 p-4 border rounded-xl hover:bg-light duration-200 ease-in-out bg-light">
    <div className="flex items-center justify-center">
      <Empty msg={"No transactions found"}/>
    </div>
  </section>
  )

  return (
    <div className="p-6 max-md:bg-white bg-white border rounded-lg ">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Transaction History</h2>
      
      {/* Table on larger screens */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-500 font-medium">
                <th className="px-4 py-2 text-left font-medium">Username</th>
                <th className="px-4 py-2 text-left font-medium">User Email</th>
                <th className="px-4 py-2 text-left font-medium">Coupon Code</th>
                <th className="px-4 py-2 text-left font-medium">Points Spent</th>
                <th className="px-4 py-2 text-left font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index} className="border-b bg-gray-50 last-of-type:border-none">
                  <td className="px-4 py-2 text-gray-700">{transaction.user.firstName}{" "}{transaction.user.lastName}</td>
                  <td className="px-4 py-2 text-gray-500">{transaction.user.email}</td>
                  <td className="px-4 py-2 text-gray-700">{transaction.coupon.promoCode}</td>
                  <td className="px-4 py-2 text-gray-700">{transaction.coupon.pointsRequired}</td>
                  <td className="px-4 py-2 text-gray-700">{formatDateToLocal(transaction.$createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Div structure for mobile */}
      <div className="lg:hidden">
        {transactions.map((transaction, index) => (
          <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-sm">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Username:</span>
              <span className="text-gray-700">{transaction.user.firstName}{" "}{transaction.user.lastName}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">User Email:</span>
              <span className="text-gray-700">{transaction.user.email}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Coupon Code:</span>
              <span className="text-gray-700">{transaction.coupon.promoCode}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-gray-800">Points Spent:</span>
              <span className="text-gray-700">{transaction.coupon.pointsRequired}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-800">Date:</span>
              <span className="text-gray-700">{formatDateToLocal(transaction.$createdAt)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionHistory;
