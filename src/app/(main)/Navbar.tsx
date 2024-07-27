import React from "react";
import Link from "next/link";

import UserButton from "@/components/UserButton";
import SearchInput from "@/components/SearchInput";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-5 px-5 py-3">
        <Link href="/" className="text-2xl font-bold text-primary">
          D-Chat
        </Link>
        <SearchInput />
        <UserButton className="sm:ms-auto" />
      </div>
    </header>
  );
};

export default Navbar;
