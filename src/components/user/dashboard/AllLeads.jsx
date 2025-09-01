



import { fetchLatestRegistrations, fetchUserAllLeads, fetchUserLatestRegistrations } from '@/lib/data';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { cookies } from 'next/headers';
import Image from 'next/image';


export default async function AllLeads({userId}) {
  cookies();
  const latestRegistrations = await fetchUserAllLeads(userId);



  return (
    <div className="flex w-full flex-col ">
      <div className="flex grow flex-col justify-between rounded-xl bg-white border p-4">
      <h2 className={` mb-4 text-base md:text-xl text-gray-500`}>
        All Referred Registrations 
      </h2>
        <div className="bg-gray-50 px-6 border rounded-lg">
          {latestRegistrations?.map((invoice, i) => (
            <div
              key={invoice.$id}
              className={clsx(
                'flex flex-row items-center justify-between py-4',
                {
                  'border-t': i !== 0,
                }
              )}
            >
              <div className="flex items-center">
                {/* <Image
                  src={invoice.image_url}
                  alt={`${invoice.name}'s profile picture`}
                  className="mr-4 rounded-full"
                  width={32}
                  height={32}
                /> */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold md:text-base">
                    {invoice.firstName}{" "}{invoice.lastName}
                  </p>
                  <p className=" text-sm text-gray-500 sm:block">
                    {invoice.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-end">
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 sm:block">
                    Company: {invoice.company}
                  </p>
                  <p className=" text-sm text-gray-500 sm:block">
                    Country {invoice.country}
                  </p>
                </div>
              </div>
              {/* <p
                className={` truncate text-sm font-medium md:text-base`}
              >
                {invoice.amount}
              </p> */}
            </div>
          ))}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
}
