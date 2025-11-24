"use client";

import { useState, useEffect, startTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");

  useEffect(() => {
    startTransition(() => {
      setQuery(searchParams.get("search") || "");
    });
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/menu?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/menu");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-[200px] lg:max-w-[300px]">
      <Input
        type="search"
        placeholder="Search..."
        className="pr-10 h-9 text-sm font-medium"
        style={{ fontFamily: "var(--font-geist-sans)" }}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button
        type="submit"
        size="icon"
        variant="ghost"
        className="absolute right-0 top-0 h-9 w-9 text-muted-foreground hover:text-foreground"
        style={{ fontFamily: "var(--font-geist-sans)" }}
      >
        <Search className="h-4 w-4" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
