import Image from "next/image";
import {
  DeleteListing,
  ViewListingDetails,
  ViewSalesDetails,
} from "@/components/ui/Cases/buttons";
import { formatEpochToLocal, formatCurrencytoEuro } from "@/lib/utils";
import { fetchSellerListings } from "@/lib/data";
import GenerateQR from "@/components/ui/listings/GenerateQR";

export default async function SalesTable({ query, currentPage }) {
  const listings = await fetchSellerListings(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {listings?.map(({ $id, name, tickets, media }) => {
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
                    <div className="flex flex-col items-end justify-between gap-1">
                      <p>{tickets.length}</p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">{name}</p>

                      <ViewSalesDetails id={$id} />
                    </div>
                    <div className="flex justify-end gap-2"></div>
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
                  Total Sales
                </th>

                <th scope="col" className="relative py-3 pl-6 pr-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {listings?.map(({ $id, name, $createdAt, tickets, media }) => {
                const thumbnail = media[0]?.link; // Safely access the first media link
                return (
                  <tr
                    key={$id}
                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                  >
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={thumbnail}
                          alt=""
                          className="w-[100px] h-[60px] object-cover rounded-md"
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex items-center gap-3">
                        <p>{name}</p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      {tickets.length}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 ">
                      <div className="flex justify-between gap-3">
                        <div className="flex justify-start gap-3">
                          <ViewSalesDetails id={$id} />
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
