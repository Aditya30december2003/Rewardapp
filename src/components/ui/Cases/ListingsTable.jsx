import Image from "next/image";
import {
  DeleteListing,
  UpdateListing,
  ViewListingDetails,
  ViewListingProducts,
} from "@/components/ui/Cases/buttons";
import { formatEpochToLocal, formatCurrencytoEuro } from "@/lib/utils";
import { fetchSellerListings } from "@/lib/data";
import GenerateQR from "@/components/ui/listings/GenerateQR";
import Link from "next/link";

export default async function ListingsTable({ query, currentPage }) {
  const listings = await fetchSellerListings(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {listings?.map(({ $id, name, $createdAt, products, media }) => {
              const thumbnail = media[0]?.link; // Safely access the first media link
              return (
                <div
                  key={$id}
                  className="mb-2 w-full rounded-md bg-white p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <Image
                        src={thumbnail}
                        alt=""
                        width={120}
                        height={80}
                        className="w-[120px] h-[80px] object-cover rounded-md"
                      />
                    </div>
                    {/* <CaseStatus status={response_status} /> */}
                    {/* <div className="flex flex-col items-end justify-between gap-1">
                      <p className="text-sm text-gray-500">
                        {formatEpochToLocal($createdAt)}
                      </p>
                    </div> */}
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">{name}</p>
                      <p className="text-gray-500">
                        Products: {products.length}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div></div>
                    <div className="flex justify-end gap-2">
                      <ViewListingProducts id={$id} />
                      <ViewListingDetails id={$id} />
                      <GenerateQR id={$id} />
                      <UpdateListing listingId={$id} />
                      <DeleteListing
                        mediaId={[...media.map((item) => item.mediaId)]}
                        listingId={$id}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table  ">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Thumbnail
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Location
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Products
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {listings?.map(({ $id, name, $createdAt, products, media }) => {
                const thumbnail = media[0]?.link; // Safely access the first media link
                return (
                  <tr
                    key={$id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg "
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={thumbnail}
                          alt=""
                          className="w-[120px] h-[80px] object-cover rounded-md"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/seller/listings/${$id}`}
                          className="hover:text-storekwiltext"
                        >
                          {name}
                        </Link>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {products.length}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {formatEpochToLocal($createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 ">
                      <div className="flex justify-end gap-3">
                        <div className="flex justify-start gap-3">
                          <ViewListingProducts id={$id} />
                          <ViewListingDetails id={$id} />
                          <GenerateQR id={$id} />
                        </div>
                        <div className="flex justify-start gap-3">
                          <UpdateListing listingId={$id} />
                          <DeleteListing
                            mediaId={[...media.map((item) => item.mediaId)]}
                            listingId={$id}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
