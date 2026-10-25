import Form from "next/form";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Page } from "@/lib/api/types";
import { pageRange, tableHref, type SearchParams } from "@/lib/table-query";

/**
 * Table footer: "Showing 1–9 of 14 accounts" + page links + "Go to" box.
 * Pages are links that keep every other search param (filters, sort, search).
 */
export function TablePagination({
  data,
  searchParams,
  itemLabel,
}: {
  data: Page<unknown>;
  searchParams: SearchParams;
  itemLabel: string;
}) {
  const totalPages = Math.max(1, Math.ceil(data.totalItems / data.size));
  const from = data.items.length ? data.page * data.size + 1 : 0;
  const to = data.page * data.size + data.items.length;
  const hrefFor = (page: number) => tableHref(searchParams, { page: page === 0 ? null : page + 1 });
  const keep = Object.entries(searchParams).filter(([key]) => key !== "page");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <p className="text-[13px] text-placeholder" aria-live="polite">
        Showing <span className="font-medium text-foreground">{from === to ? to : `${from}–${to}`}</span> of{" "}
        <span className="font-medium text-foreground">{data.totalItems}</span> {itemLabel}
      </p>

      {totalPages > 1 && (
        <div className="flex flex-wrap items-center gap-5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href={data.page > 0 ? hrefFor(data.page - 1) : undefined} />
              </PaginationItem>
              {pageRange(data.page, totalPages).map((page, i) => (
                <PaginationItem key={page === "ellipsis" ? `gap-${i}` : page}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink href={hrefFor(page)} isActive={page === data.page}>
                      {page + 1}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext href={data.page < totalPages - 1 ? hrefFor(data.page + 1) : undefined} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <Form action="" className="flex items-center gap-2 pl-3">
            {keep.flatMap(([key, value]) =>
              (Array.isArray(value) ? value : [value]).map((v, i) =>
                v === undefined ? null : <input key={`${key}-${i}`} type="hidden" name={key} value={v} />,
              ),
            )}
            <label htmlFor="table-go-to-page" className="text-sm text-placeholder">
              Go to
            </label>
            <input
              id="table-go-to-page"
              name="page"
              type="number"
              inputMode="numeric"
              min={1}
              max={totalPages}
              required
              defaultValue={data.page + 1}
              className="h-9 w-[52px] [appearance:textfield] rounded-full border border-input bg-background text-center text-[15px] font-medium text-foreground transition-[border-color,box-shadow] outline-none focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/25 [&::-webkit-inner-spin-button]:appearance-none"
            />
            <Button type="submit" variant="soft" size="sm">
              Go
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
