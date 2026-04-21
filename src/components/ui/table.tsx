import type {
  HTMLAttributes,
  TableHTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export function Table(props: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="table-wrap">
      <table {...props} className={cn("data-table", props.className)} />
    </div>
  );
}

export function THead(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} className={cn(props.className)} />;
}

export function TBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} className={cn(props.className)} />;
}

export function TR(props: HTMLAttributes<HTMLTableRowElement>) {
  return <tr {...props} className={cn(props.className)} />;
}

export function TH(props: ThHTMLAttributes<HTMLTableCellElement>) {
  return <th {...props} className={cn(props.className)} />;
}

export function TD(props: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td {...props} className={cn(props.className)} />;
}
