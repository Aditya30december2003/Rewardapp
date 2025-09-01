import { VisitListingDetails } from "@/components/ui/Cases/buttons";
import { fetchBestSelling } from "@/lib/data";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";

export default async function BestSelling() {
  const bestselling = await fetchBestSelling();

  return (
    <div className="flex w-full flex-col">
      <h2 className={` mb-4 text-xl md:text-2xl`}>Best Selling Listing</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        <div className="bg-white px-6">
          {bestselling && (
            <div className="grid md:grid-cols-2 gap-8 p-4 ">
              <Image
                src={bestselling.media[0].link}
                alt={`${bestselling.name}'s profile picture`}
                className="w-full h-[400px] object-cover rounded-lg"
                width={200}
                height={200}
              />
              <div className="">
                <p className="truncate text-sm font-semibold md:text-2xl mb-3">
                  {bestselling.name}
                </p>
                <p className=" text-sm text-gray-500 sm:block mb-2">
                  {bestselling.smallDescription}
                </p>
                <div className="flex flex-col items-start justify-start">
                  <p className=" text-xl text-gray-500 font-semibold sm:block">
                    Products:{" "}
                    <span className=" font-medium">
                      {bestselling.products.length}
                    </span>
                  </p>
                  <p className=" text-xl text-gray-500 font-semibold sm:block">
                    Tickets Sold:{" "}
                    <span className=" font-medium">
                      {bestselling.tickets.length}
                    </span>
                  </p>
                </div>

                <div className="w-[120px] ml-0 mt-8">
                  <VisitListingDetails id={bestselling.$id} />
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
