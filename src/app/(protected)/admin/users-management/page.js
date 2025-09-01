import FilteredUsersTable from "@/components/admin/FilteredUsersTable";
import SearchFilters from "@/components/admin/SearchFilters";
import { LatestInvoicesSkeleton } from "@/components/ui/skeletons";
import { cookies } from "next/headers";
import { Suspense } from "react";

export default async function UsersManagementPage({ searchParams }) {
  cookies();
    // Extract filters from searchParams
    const {
      query = "",
      queryType = "",
      dateFilterType = "",
      dateStart = "",
      dateEnd = "",
      pointsFilterType = "",
      pointsValue = "",
      pointsMin = "",
      pointsMax = "",
      order = "asc",
      limit = "",
      offset = "0",
    } = searchParams;


  // Decode the query parameter if queryType is 'email'
  let decodedQuery = query;
  if (queryType === "email" && query) {
    decodedQuery = decodeURIComponent(query);  // Decode the email query param
  }

    const filters = {
      query: decodedQuery,  // Use the decoded value
      queryType,
      dateFilterType,
      dateStart,
      dateEnd,
      pointsFilterType,
      pointsValue: pointsValue ? parseInt(pointsValue, 10) : undefined,
      pointsMin: pointsMin ? parseInt(pointsMin, 10) : undefined,
      pointsMax: pointsMax ? parseInt(pointsMax, 10) : undefined,
      order,
      limit: limit ? parseInt(limit, 10) : 25, // Default to 25 if no limit is provided
      offset: offset ? parseInt(offset, 10) : 0,
    };


  return (
    <>
      <div className="mb-4">
        <SearchFilters />
      </div>
      <Suspense fallback={<LatestInvoicesSkeleton />}> 
      <FilteredUsersTable filters={filters}/>
      </Suspense>
    </>
  );
}
