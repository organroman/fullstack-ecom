interface ItemsListHeaderCellProps {
  children: React.ReactNode;
  styles?: string;
}

const ItemsListHeaderCell = ({
  children,
  styles = "text-lg text-zinc-700 dark:text-zinc-300 col-span-1",
}: ItemsListHeaderCellProps) => {
  return <p className={styles}>{children}</p>;
};

export default ItemsListHeaderCell;
