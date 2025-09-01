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

import { useFormState } from "react-dom";
import { createListing } from "@/lib/actions";
import Button from "@/components/common/Button";
import { BiSolidError } from "react-icons/bi";

const initialState = { message: null, errors: {} };
export default function Form() {
  const [state, formAction] = useFormState(createListing, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Listing Title */}
        <div className="mb-4">
          <label
            htmlFor="listingTitle"
            className="mb-2 block text-sm font-medium"
          >
            Choose a Title
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="listingTitle"
                name="listingTitle"
                type="text"
                required
                placeholder="Enter Title"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              />
              <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Listing Amount */}
        {/* <div className="mb-4">
          <label htmlFor="amount" className="mb-2 block text-sm font-medium">
            Choose an amount
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
        </div> */}
        {/* Listing Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-medium"
          >
            Write a Description
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="description"
                name="description"
                type="text"
                required
                rows={3}
                maxLength={255}
                placeholder="Enter Brief Description"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="amount-error"
              />
              <ListBulletIcon className="pointer-events-none absolute left-3 top-4 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        {/* Listing Media */}
        <div className="mb-4">
          <label htmlFor="media" className="mb-2 block text-sm font-medium">
            Media{" "}
            <span className="text-sm text-gray-500 text-normal">
              {" "}
              ( You can attach upto max 5 photos)
            </span>
          </label>
          <input
            id="media"
            name="media"
            type="file"
            required
            accept="image/*"
            multiple
            className="block w-full rounded-md border bg-white border-gray-200 py-3 pl-3 text-sm placeholder:text-gray-500"
            aria-describedby="media-error"
          />
        </div>

        {state?.message && (
          <p className="flex items-center gap-4 text-red-600 border-l-4 px-2 shadow-md border-l-red-600 bg-red-100 w-fit mx-auto py-1 mt-1 text-sm">
            <BiSolidError className="text-2xl" />
            {state?.message}
          </p>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/seller/listings"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button
          type="submit"
          className="!w-fit bg-storekwiltext/[0.88] hover:bg-storekwiltext min-w-[200px] flex items-center justify-center"
        >
          Create Listing
        </Button>
      </div>
    </form>
  );
}
