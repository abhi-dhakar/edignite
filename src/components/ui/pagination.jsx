import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import Link from "next/link";

const Pagination = ({ className, ...props }) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

const PaginationContent = ({ className, ...props }) => (
  <ul className={cn("flex flex-row items-center gap-1", className)} {...props} />
);

const PaginationItem = ({ className, ...props }) => (
  <li className={cn("", className)} {...props} />
);

const PaginationLink = ({
  className,
  isActive = false,
  disabled = false,
  size = "icon",
  href,
  ...props
}) => {
  const Comp = href ? Link : "button";
  return (
    <Comp
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "border border-input",
        isActive
          ? "bg-primary text-primary-foreground hover:bg-primary/90"
          : "hover:bg-accent hover:text-accent-foreground",
        disabled ? "pointer-events-none opacity-50" : "",
        size === "sm" && "h-8 min-w-8 px-2 text-xs",
        size === "default" && "h-9 min-w-9 px-3",
        size === "lg" && "h-10 min-w-10 px-4",
        size === "icon" && "h-9 w-9",
        className
      )}
      href={disabled ? "#" : href}
      {...props}
    />
  );
};

const PaginationPrevious = ({
  className,
  href,
  onClick,
  disabled,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to previous page"
    size="default"
    className={cn("gap-1", className)}
    href={href}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <ChevronLeft className="h-4 w-4" />
    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Previous</span>
  </PaginationLink>
);

const PaginationNext = ({
  className,
  href,
  onClick,
  disabled,
  ...props
}) => (
  <PaginationLink
    aria-label="Go to next page"
    size="default"
    className={cn("gap-1", className)}
    href={href}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Next</span>
    <ChevronRight className="h-4 w-4" />
  </PaginationLink>
);

const PaginationEllipsis = ({ className, ...props }) => (
  <div
    aria-hidden
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </div>
);

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};