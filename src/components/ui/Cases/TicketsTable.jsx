import Image from "next/image";
import {
  DeleteListing,
  ViewListingDetails,
  ViewSalesDetails,
} from "@/components/ui/Cases/buttons";
import {
  formatEpochToLocal,
  formatCurrencytoEuro,
  formatMinutes,
  formatDateToLocal,
} from "@/lib/utils";
import { fetchListingDetails } from "@/lib/data";

export default async function TicketsTable({ propertyId }) {
  const { tickets } = await fetchListingDetails(propertyId);

  console.log(tickets);
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {tickets.map(
              ({
                $id,
                licensePlateNo,
                productName,
                price,
                duration,
                $createdAt,
              }) => {
                return (
                  <div
                    key={$id}
                    className="mb-2 w-full rounded-md bg-white p-4 border border-gray-200"
                  >
                    <div className="flex w-full items-center justify-between pt-4 border-b ">
                      <div>
                        <p className="text-xl font-medium">{licensePlateNo}</p>
                        <p className="text-gray-500">
                          {formatDateToLocal($createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between pt-4">
                      <div>
                        <p className="text-xl font-medium">{productName}</p>
                        <p className="text-gray-500">
                          {formatCurrencytoEuro(price)}
                        </p>
                      </div>
                      <div className="flex justify-end gap-2">
                        {formatMinutes(duration)}
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
          <table className="hidden min-w-full text-gray-900 md:table  ">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  License Plate
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Product Name
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Price
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Duration
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Purchase Date/Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {tickets?.map(
                ({
                  $id,
                  licensePlateNo,
                  productName,
                  price,
                  duration,
                  $createdAt,
                }) => {
                  return (
                    <tr
                      key={$id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <p>{licensePlateNo}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          <p>{productName}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatCurrencytoEuro(price)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatMinutes(duration)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatDateToLocal($createdAt)}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
