import { EOrderStatus } from "@/types/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_STATUSES } from "@/lib/constants";
import { capitalizeFirstLetter } from "@/lib/utils";

interface StatusChangeSelectorProps {
  defaultValue: EOrderStatus;
  className?: string;
  disabled: boolean;
  onStatusChange: (status: EOrderStatus) => void;
}

const StatusChangeSelector = ({
  defaultValue,
  onStatusChange,
  className = "w-[180px]",
  disabled,
}: StatusChangeSelectorProps) => {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={onStatusChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder="Select a status" />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {capitalizeFirstLetter(status)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default StatusChangeSelector;
