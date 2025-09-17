"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CardDescription, CardTitle } from "@/components/ui/card";

interface RecentSalesCardProps {
  avatarUrl: string;
  name: string;
  email: string;
  amount: number;
}

const RecentSalesCard = ({
  avatarUrl,
  name,
  email,
  amount,
}: RecentSalesCardProps) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex gap-4">
        <Avatar>
          <AvatarImage src={avatarUrl} />
        </Avatar>
        <div>
          <CardDescription className="font-semibold text-card-foreground">
            {name}
          </CardDescription>
          <CardDescription>{email}</CardDescription>
        </div>
      </div>
      <CardTitle className="font-normal">+$ {amount.toLocaleString()}</CardTitle>
    </div>
  );
};

export default RecentSalesCard;
