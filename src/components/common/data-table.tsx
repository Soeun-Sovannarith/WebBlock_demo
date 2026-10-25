import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowDown2, ArrowSwapVertical, ArrowUp2 } from "iconsax-reactjs";
import { TablePagination } from "@/components/common/table-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Page } from "@/lib/api/types";
import { parseTableQuery, tableHref, type SearchParams } from "@/lib/table-query";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  /** Unique per table. */
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** API sort field. Makes the header a link that toggles `?sort=<field>,asc|desc`. */
  sortField?: string;
  /** Width / alignment for the whole column, e.g. "w-40 text-right". */
  className?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: Page<T>;
  rowKey: (row: T) => string;
  /** The page's resolved `searchParams` — pagination and sort links keep every other param. */
  searchParams: SearchParams;
  /** Plural noun for the footer: "Showing 1–9 of 14 {itemLabel}". */
  itemLabel: string;
  /** Accessible name of the table, e.g. "User accounts". */
  label: string;
  /** Search, filters and actions shown above the table. */
  toolbar?: ReactNode;
  /** Shown when there are no items at all (use `EmptyState` when it exists). */
  empty?: ReactNode;
};

/**
 * Every list screen's table ("Draft table style"): "No." first column, sortable headers,
 * pinned footer with "Showing …" + pagination, full grid even with few rows.
 * A Server Component — page, size and sort live in the URL (see `lib/table-query`).
 *
 * @example
 * const query = parseTableQuery(await searchParams);
 * const users = await listUsers(query);
 * <DataTable
 *   label="User accounts" itemLabel="accounts" data={users} searchParams={await searchParams}
 *   rowKey={(u) => u.id}
 *   columns={[
 *     { key: "name", header: "Account", sortField: "name", cell: (u) => u.fullName },
 *     { key: "joined", header: "Joined", sortField: "joinedAt", cell: (u) => formatDate(u.joinedAt) },
 *   ]}
 * />
 */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  searchParams,
  itemLabel,
  label,
  toolbar,
  empty,
}: DataTableProps<T>) {
  const { sort } = parseTableQuery(searchParams);
  const offset = data.page * data.size;
  const fillerRows = data.items.length > 0 ? data.size - data.items.length : 0;
  const colSpan = columns.length + 1;

  return (
    <section className="overflow-hidden rounded-[20px] border border-border bg-background shadow-card">
      {toolbar && (
        <div className="flex flex-wrap items-center gap-2.5 border-b border-border px-4 py-3.5">{toolbar}</div>
      )}

      <Table aria-label={label}>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[72px] pl-[21px]">No.</TableHead>
            {columns.map((column) => {
              const active = sort && column.sortField === sort.field ? sort.direction : undefined;
              return (
                <TableHead
                  key={column.key}
                  className={column.className}
                  aria-sort={active === "asc" ? "ascending" : active === "desc" ? "descending" : undefined}
                >
                  {column.sortField ? (
                    <SortLink
                      field={column.sortField}
                      active={active}
                      searchParams={searchParams}
                    >
                      {column.header}
                    </SortLink>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.items.map((row, i) => (
            <TableRow
              key={rowKey(row)}
              className="hover:bg-muted/70 motion-safe:animate-row-in"
              style={{ animationDelay: `${i * 25}ms` }}
            >
              <TableCell className="pl-[21px] tabular-nums">{offset + i + 1}</TableCell>
              {columns.map((column) => (
                <TableCell key={column.key} className={column.className}>
                  {column.cell(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}

          {Array.from({ length: fillerRows }, (_, i) => (
            <TableRow key={`filler-${i}`} aria-hidden>
              <TableCell colSpan={colSpan} />
            </TableRow>
          ))}

          {data.items.length === 0 && (
            <TableRow>
              <TableCell colSpan={colSpan} className="h-64 text-center">
                {data.totalItems > 0 ? (
                  <p className="text-muted-foreground">
                    This page is empty.{" "}
                    <Link href={tableHref(searchParams, { page: null })} className="font-medium text-primary hover:underline">
                      Go to the first page
                    </Link>
                  </p>
                ) : (
                  (empty ?? <p className="text-muted-foreground">No {itemLabel} yet.</p>)
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {data.totalItems > 0 && (
        <div className="border-t border-border">
          <TablePagination data={data} searchParams={searchParams} itemLabel={itemLabel} />
        </div>
      )}
    </section>
  );
}

/** Header link: inactive → asc → desc → asc… Changing sort goes back to page 1. */
function SortLink({
  field,
  active,
  searchParams,
  children,
}: {
  field: string;
  active?: "asc" | "desc";
  searchParams: SearchParams;
  children: ReactNode;
}) {
  const next = active === "asc" ? "desc" : "asc";
  const Icon = active === "asc" ? ArrowUp2 : active === "desc" ? ArrowDown2 : ArrowSwapVertical;

  return (
    <Link
      href={tableHref(searchParams, { sort: `${field},${next}`, page: null })}
      scroll={false}
      className={cn(
        "group -mx-1.5 inline-flex items-center gap-1.5 rounded-full px-1.5 py-1 outline-none transition-colors duration-150 focus-visible:ring-3 focus-visible:ring-ring/40",
        active ? "text-primary" : "hover:text-foreground",
      )}
    >
      {children}
      <Icon
        aria-hidden
        className={cn(
          "size-3.5 transition-[opacity,transform] duration-150",
          active ? "opacity-100" : "opacity-60 group-hover:opacity-100 motion-safe:group-hover:scale-110",
        )}
      />
      <span className="sr-only">
        {active ? `, sorted ${active === "asc" ? "ascending" : "descending"}` : ", sort"}
      </span>
    </Link>
  );
}

/** Loading state for loading.tsx: same frame as DataTable with pulsing rows. */
export function DataTableSkeleton({ columns = 5, rows = 8 }: { columns?: number; rows?: number }) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading table"
      className="overflow-hidden rounded-[20px] border border-border bg-background shadow-card"
    >
      <div className="h-11 border-b border-border bg-muted" />
      <div className="animate-pulse">
        {Array.from({ length: rows }, (_, r) => (
          <div key={r} className="flex h-[68px] items-center gap-6 border-b border-border px-5 last:border-0">
            {Array.from({ length: columns }, (_, c) => (
              <div key={c} className={cn("h-3.5 rounded-full bg-surface", c === 0 ? "w-6" : "flex-1")} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
