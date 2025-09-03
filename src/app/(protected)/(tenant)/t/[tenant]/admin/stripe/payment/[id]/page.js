import Link from "next/link";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloseCircle } from "react-icons/io";


const PurchaseSuccessPage = async ({ params }) => {
  const customerId = (await params).id;
  console.log("customers=>..",customerId,"END")
  // const customer = await fetchCustomer(customerId);
  console.log("THIS IS customerId..=>",customerId,"END")


  if (!customerId)
    return (
      <section className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="w-full max-w-xl text-center">
        <div className="bg-white shadow-lg p-6 rounded-3xl">
          <div className="card-body">
            <IoMdCloseCircle className="text-green-500 mx-auto" size={60} />
            <h3 className="mt-4 text-green-600 text-2xl font-semibold">Purchase Failed!</h3>
            <p className="text-gray-500 text-lg mt-2">
             Oops failed!
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="inline-block text-white px-6 py-3 rounded-lg font-medium"
                style={{
                  backgroundImage: "linear-gradient(to right, #3543f4 , #b627fe)",
                }}
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
  else
    return (
      <section className="flex justify-center items-center min-h-[60vh] px-4">
      <div className="w-full max-w-xl text-center">
        <div className="bg-white shadow-lg p-6 rounded-3xl">
          <div className="card-body">
            <FaCheckCircle className="text-green-500 mx-auto" size={60} />
            <h3 className="mt-4 text-green-600 text-2xl font-semibold">Purchase Successful!</h3>
            <p className="text-gray-500 text-lg mt-2">
              Thank you for your order. Your purchase has been successfully processed.
            </p>
            <div className="mt-6">
              <a
                href="/"
                className="inline-block text-white px-6 py-3 rounded-lg font-medium"
                style={{
                  backgroundImage: "linear-gradient(to right, #3543f4 , #b627fe)",
                }}
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
    );
};

export default PurchaseSuccessPage;
