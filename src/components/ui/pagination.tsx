"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  getPageUrl?: (page: number) => string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  getPageUrl,
  className,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(totalPages - 1, currentPage + halfVisible);

      // Adjust if near the beginning
      if (currentPage <= halfVisible + 1) {
        endPage = Math.min(totalPages - 1, maxVisible - 1);
      }

      // Adjust if near the end
      if (currentPage > totalPages - halfVisible - 1) {
        startPage = Math.max(2, totalPages - maxVisible + 2);
      }

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const renderPageButton = (
    page: number,
    isActive: boolean,
    label: string,
    icon?: React.ReactNode
  ) => {
    if (getPageUrl) {
      return (
        <Button
          key={page}
          variant={isActive ? "default" : "outline"}
          size="sm"
          asChild
          aria-label={label}
          aria-current={isActive ? "page" : undefined}
        >
          <Link href={getPageUrl(page)}>{icon || page}</Link>
        </Button>
      );
    }

    return (
      <Button
        key={page}
        type="button"
        variant={isActive ? "default" : "outline"}
        size="sm"
        onClick={() => onPageChange?.(page)}
        aria-label={label}
        aria-current={isActive ? "page" : undefined}
      >
        {icon || page}
      </Button>
    );
  };

  const renderNavButton = (direction: "prev" | "next", disabled: boolean, targetPage: number) => {
    const icon =
      direction === "prev" ? (
        <ChevronLeft className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      );
    const label = direction === "prev" ? "Go to previous page" : "Go to next page";

    if (disabled) {
      return (
        <Button variant="outline" size="sm" disabled aria-label={label}>
          {icon}
        </Button>
      );
    }

    if (getPageUrl) {
      return (
        <Button variant="outline" size="sm" asChild aria-label={label}>
          <Link href={getPageUrl(targetPage)}>{icon}</Link>
        </Button>
      );
    }

    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onPageChange?.(targetPage)}
        aria-label={label}
      >
        {icon}
      </Button>
    );
  };

  return (
    <nav
      className={cn("flex items-center justify-center gap-1", className)}
      aria-label="Pagination"
    >
      {renderNavButton("prev", !canGoPrevious, currentPage - 1)}

      <div className="flex items-center gap-1">
        {pages.map((page, index) => {
          if (page === "...") {
            return (
              <span key={`ellipsis-${index}`} className="px-2 py-1 text-muted-foreground">
                <MoreHorizontal className="h-4 w-4" />
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return renderPageButton(pageNum, isActive, `Go to page ${pageNum}`);
        })}
      </div>

      {renderNavButton("next", !canGoNext, currentPage + 1)}
    </nav>
  );
}

interface PaginationInfoProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  className?: string;
}

export function PaginationInfo({
  currentPage,
  pageSize,
  totalItems,
  className,
}: PaginationInfoProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      Showing {startItem} to {endItem} of {totalItems} results
    </p>
  );
}
