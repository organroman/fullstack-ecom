//TODO DELETE THIS COMPONENT

// "use client";

// import { Dispatch, SetStateAction, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { ChevronLeftIcon } from "lucide-react";

// import Search from "@/components/Search";
// import { Dialog, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
// } from "@/components/ui/select";
// import OrderFormModal from "./OrderFormModal";
// import { capitalizeFirstLetter } from "@/lib/utils";
// import { ORDER_STATUSES } from "@/lib/constants";

// interface OrdersHeaderProps {
//   searchPhrase?: string | "";
//   setSearchPhrase?: Dispatch<SetStateAction<string>>;
//   title: string;
// }

// const OrdersHeader = ({
//   searchPhrase,
//   setSearchPhrase,
//   title,
// }: OrdersHeaderProps) => {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const status = searchParams.get("status");

//   // const [open, setOpen] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState<string>(status || "All");

//   const updateQueryParams = (newSearch: string, newStatus?: string) => {
//     const params = new URLSearchParams(searchParams.toString());
//     newSearch
//       ? params.set("search", newSearch?.toString())
//       : params.delete("search");

//     newStatus &&
//       (newStatus === "All"
//         ? params.delete("status")
//         : params.set("status", newStatus.toString()));

//     router.push(`?${params.toString()}`, { scroll: false });
//   };

//   const handleFilterChange = (status: string) => {
//     setSelectedStatus(status);
//     updateQueryParams(searchPhrase || "", status);
//   };

//   const goBack = () => {
//     router.back();
//   };

//   return (
//     <div className="flex flex-row items-center justify-between pt-4">
//       <div className="flex items-center gap-4">
//         <Button onClick={goBack} className="text-md [&_svg]:size-5">
//           <ChevronLeftIcon />
//           Back
//         </Button>
//         <h2 className="text-3xl">{title}</h2>
//       </div>

//       <div className="flex items-center justify-end gap-4">
//         {setSearchPhrase && (
//           <Search
//             searchPhrase={searchPhrase || ""}
//             handleSearch={updateQueryParams}
//             onChange={setSearchPhrase}
//           />
//         )}
//         <Select value={selectedStatus} onValueChange={handleFilterChange}>
//           <SelectTrigger className="w-[180px]">
//             {selectedStatus === "All"
//               ? "Select a status"
//               : capitalizeFirstLetter(selectedStatus)}
//           </SelectTrigger>
//           <SelectContent>
//             {ORDER_STATUSES.map((status) => (
//               <SelectItem value={status} key={status}>
//                 {capitalizeFirstLetter(status)}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Dialog 
//         // open={open} onOpenChange={setOpen}
//         >
//           <DialogTrigger asChild>
//             <Button>Create Order</Button>
//           </DialogTrigger>
//           <OrderFormModal />
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default OrdersHeader;
