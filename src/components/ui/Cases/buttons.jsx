import Link from "next/link";
import {
  EyeIcon,
  PencilIcon,
  PlusIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { FaQrcode } from "react-icons/fa6";
// import { deleteCase, deleteProduct } from "@/lib/actions";
// import Button from "@/components/common/Button";

export function CreateCase() {
  return (
    <Link
      href="/seller/Cases/create"
      className="flex h-10 items-center rounded-lg bg-storekwiltext px-4 text-sm font-medium text-white transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Case</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
export function CreateProducts({ CaseId }) {
  return (
    <Link
      href={`/seller/Cases/${CaseId}/create`}
      className="flex h-10 items-center rounded-lg bg-storekwiltext px-4 text-sm font-medium text-white transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Products</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateProduct({ CaseId, productId }) {
  return (
    <Link
      href={`/seller/Cases/${CaseId}/${productId}/edit`}
      className="rounded-md border p-2 bg-gray-50  hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

// export function DeleteProduct({ productId, CaseId }) {
//   return (
//     <form action={deleteProduct}>
//       <input type="hidden" value={productId} name="productId" />
//       <input type="hidden" value={CaseId} name="CaseId" />
//       <Button
//         type="submit"
//         className="rounded-md border h-10 bg-gray-50  hover:bg-gray-100 flex items-center justify-center"
//       >
//         <TrashIcon className="w-5 text-gray-600" />
//       </Button>
//     </form>
//   );
// }
export function UpdateCase({ CaseId }) {
  return (
    <Link
      href={`/seller/Cases/${CaseId}/edit`}
      className="rounded-md border p-2 bg-gray-50  hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

// export function DeleteCase({ CaseId, mediaId }) {
//   return (
//     <form action={deleteCase}>
//       <input type="hidden" value={CaseId} name="CaseId" />
//       <input type="hidden" value={JSON.stringify(mediaId)} name="mediaId" />
//       <Button
//         type="submit"
//         className="rounded-md border h-10 bg-gray-50  hover:bg-gray-100 flex items-center justify-center"
//       >
//         <TrashIcon className="w-5 text-gray-600" />
//       </Button>
//     </form>
//   );
// }

export function ViewCaseDetails({ id }) {
  return (
    <Link
      href={`cases/${id}`}
      className="flex h-10 items-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 text-sm border font-medium  transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
    >
      <span className="block">View Details</span>{" "}
      {/* <EyeIcon className="w-5 text-gray-600" /> */}
    </Link>
  );
}
export function VisitCaseDetails({ id }) {
  return (
    <Link
      href={`/cases/${id}`}
      className="flex h-10 items-center justify-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 text-sm border font-medium  transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
    >
      <span className="block">Visit Page</span>{" "}
      {/* <EyeIcon className="w-5 text-gray-600" /> */}
    </Link>
  );
}
export function ViewCaseProducts({ id }) {
  return (
    <Link
      href={`/seller/Cases/${id}`}
      className="flex h-10 items-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 text-sm border font-medium  transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
    >
      <span className="max-md:hidden">View Products</span>{" "}
      <ShoppingBagIcon className="w-5 text-gray-600 md:hidden" />
    </Link>
  );
}
export function ViewSalesDetails({ id }) {
  return (
    <Link
      href={`/seller/sales/${id}`}
      className="flex h-10 items-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 text-sm border font-medium  transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
    >
      <span className="block">View Details</span>{" "}
    </Link>
  );
}

export function QR({ id }) {
  return (
    <Link
      href={`/seller/Cases/qrcode/${id}`}
      className="flex h-10 items-center rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 px-4 text-sm border font-medium  transition-colors  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
    >
      <FaQrcode className="h-5 " />
    </Link>
  );
}
