"use client";

import React from "react";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import { Input } from "./ui/input";

const SearchInput = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const queryValue = (form.query as HTMLInputElement).value.trim();

    if (!queryValue) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(queryValue)}`);
  };

  return (
    <form onSubmit={handleSubmit} method="GET" action="/search">
      <div className="relative">
        <Input name="query" placeholder="Search" className="pe-10" />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
};

export default SearchInput;
