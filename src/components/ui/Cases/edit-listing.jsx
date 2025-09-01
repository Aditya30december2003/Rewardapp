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
import { createListing, updateListing } from "@/lib/actions";
import Button from "@/components/common/Button";
import HandleMedia from "./HandleMedia";
import { useParams } from "next/navigation";

export default function EditListingForm({ listingDetails }) {
  const { propertyId } = useParams();

  return (
    <>
      <form action={updateListing} id="edit-listing-form">
        <div className="rounded-md bg-gray-50 p-4 md:p-6">
          <h1 className="text-lg font-bold">Mangage Listing Content</h1>
          <p className="text-gray-500 text-sm mb-4">
            You can update title and Description here
          </p>
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
                  defaultValue={listingDetails?.name}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

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
                  defaultValue={listingDetails?.smallDescription}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  aria-describedby="amount-error"
                />
                <ListBulletIcon className="pointer-events-none absolute left-3 top-4 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
              </div>
            </div>
          </div>

          <input type="hidden" value={propertyId} name="listingId" />
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
            Update Content
          </Button>
        </div>
      </form>

      <div className="rounded-md bg-gray-50 p-4 md:p-6 mt-8">
        <h1 className="text-lg font-bold">Handle Listing Media</h1>
        <p className="text-gray-500 text-sm mb-4">
          You can upload upto max 5 photos
        </p>
        <HandleMedia
          defaultFiles={listingDetails.media}
          listingId={listingDetails.$id}
        />
      </div>
    </>
  );
}
