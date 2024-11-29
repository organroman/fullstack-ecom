import { useParams } from "next/navigation";
import React from "react";

const UserIdPage = ({ params }: { params: { userId: string } }) => {
  //   const { userId } = useParams();

  return <div>UserIdPage {params.userId}</div>;
};

export default UserIdPage;
