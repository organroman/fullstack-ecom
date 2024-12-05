import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { ORDER_STATUSES } from "@/lib/constants";
import { capitalizeFirstLetter } from "@/lib/utils";

interface OrdersFilterProps {
  selectedStatus: string;
  onFilterChange: (status: string) => void;
}

const OrdersFilter = ({
  selectedStatus,
  onFilterChange,
}: OrdersFilterProps) => {
  return (
    <Select value={selectedStatus} onValueChange={onFilterChange}>
      <SelectTrigger className="w-[180px]">
        {selectedStatus === "All"
          ? "Select a status"
          : capitalizeFirstLetter(selectedStatus)}
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((status) => (
          <SelectItem value={status} key={status}>
            {capitalizeFirstLetter(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default OrdersFilter;
