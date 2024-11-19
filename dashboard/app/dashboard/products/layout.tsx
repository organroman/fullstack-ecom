import { Button } from "@/components/ui/button";

import Image from "next/image";
import Link from "next/link";

interface ProductsLayoutProps {
  children: React.ReactNode;
}

const ProductsLayout = ({ children }: ProductsLayoutProps) => {
  return (
    <main className="">
      {/* <div className="mx-auto max-w-screen-2xl p-4 flex flex-col gap-4">
        <nav className="flex items-center justify-between">
          <Link href="/dashboard">
            <Image src="/logo.svg" alt="logo" width={40} height={40} />
          </Link>
          <Button value="secondary" asChild>
            <Link href="/dashboard/products/create">Create Product</Link>
          </Button>
        </nav> */}
      {/* <div className="flex flex-col items-center justify-center"> */}
        {children}
      {/* </div> */}
      {/* </div> */}
    </main>
  );
};

export default ProductsLayout;
