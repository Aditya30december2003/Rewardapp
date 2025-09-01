"use client";
import Link from "next/link";
import {
  CheckIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  ListBulletIcon,
  DocumentTextIcon,
  CurrencyEuroIcon,
} from "@heroicons/react/24/outline";

import { useActionState } from "react";
import { createListing, createProduct } from "@/lib/actions";
import Button from "@/components/common/Button";
import { useParams } from "next/navigation";

export default function CreateNewProductForm() {
  // const initialState = { message: null, errors: {} };
  // const [state, formAction] = useActionState(createListing, initialState);

  const { propertyId } = useParams();

  return (
    <form action={createProduct}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Product Title */}
        <div className="mb-4">
          <label
            htmlFor="productTitle"
            className="mb-2 block text-sm font-medium"
          >
            Title
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="productTitle"
                name="productTitle"
                type="text"
                required
                placeholder="Enter Title"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Product Duration */}
        <div className="mb-4 flex max-md:flex-col gap-4 md:gap-8">
          <div className="flex-1">
            <label
              htmlFor="duration"
              className="mb-2 block text-sm font-medium"
            >
              Duration
            </label>
            <div className="relative mt-2 rounded-md ">
              <div className="relative ">
                <input
                  id="duration"
                  required
                  name="duration"
                  type="number"
                  placeholder="Enter Time Duration"
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <ClockIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <label
              htmlFor="durationType"
              className="mb-2 block text-sm font-medium"
            >
              Duration Type
            </label>
            <div className="relative">
              <select
                id="durationType"
                name="durationType"
                required
                className="peer block w-full rounded-md border border-gray-200 py-2 px-4 text-sm outline-2 placeholder:text-gray-500"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>
        </div>
        {/* Product Price */}
        <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Price
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="amount"
                required
                name="amount"
                type="text"
                pattern="[0-9,]*"
                // step="0.01"
                placeholder="Enter EUR amount"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
              />
              <CurrencyEuroIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>

        <input type="hidden" value={propertyId} name="listingId" />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/seller/listings/${propertyId}`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          className="!w-fit bg-storekwiltext/[0.88] hover:bg-storekwiltext min-w-[200px] flex items-center justify-center"
        >
          Create Product
        </Button>
      </div>
    </form>
  );
}
