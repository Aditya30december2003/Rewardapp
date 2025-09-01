import Image from "next/image";
import { VisitListingDetails } from "@/components/ui/Cases/buttons";
import { formatEpochToLocal } from "@/lib/utils";
import { fetchAllSellers } from "@/lib/data";
import Link from "next/link";

export default async function AllSellersTable({ query, currentPage }) {
  const listings = await fetchAllSellers(query, currentPage);

  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <div className="md:hidden">
            {listings?.map(({ $id, name, $createdAt, email, phone, prefs }) => {
              const accountid = prefs?.connectedAccountId; // Safely access the first media link
              const accountstatus = prefs?.stripeConnectedLinked; // Safely access the first media link
              return (
                <div
                  key={$id}
                  className="mb-2 w-full rounded-md bg-white p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex flex-col items-start justify-between gap-1">
                      <p className="text-sm text-gray-500">{accountid}</p>
                      <p className="text-sm text-gray-500">
                        {accountstatus === "true" ? "Linked" : "Restricted"}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatEpochToLocal($createdAt)}
                    </p>
                  </div>
                  <div className="flex w-full items-center justify-between pt-4">
                    <div>
                      <p className="text-xl font-medium">{name}</p>
                      <p className="text-gray-500">{email}</p>
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
                  Seller Name
                </th>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Email
                </th>
                {/* <th scope="col" className="px-3 py-5 font-medium">
                  Phone
                </th> */}
                <th scope="col" className="px-3 py-5 font-medium">
                  Account ID
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Linked Status
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {listings?.map(
                ({ $id, name, $createdAt, email, phone, prefs }) => {
                  const accountid = prefs?.connectedAccountId; // Safely access the first media link
                  const accountstatus = prefs?.stripeConnectedLinked; // Safely access the first media link
                  return (
                    <tr
                      key={$id}
                      className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg "
                    >
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">{name}</div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">{email}</div>
                      </td>
                      {/* <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">{phone}</div>
                      </td> */}
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          {accountid}
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex items-center gap-3">
                          {accountstatus === "true" ? "Linked" : "Restricted"}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {formatEpochToLocal($createdAt)}
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
