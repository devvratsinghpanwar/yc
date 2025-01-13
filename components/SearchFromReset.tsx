"use client";
import Link from "next/link";
import React from "react";

const SearchFromReset = () => {
  const reset = () => {
    document.querySelector(".search-form") as HTMLFormElement;
  };
  return (
    <button type="reset" onClick={reset}>
      <Link href="/" className="search-btn text-white">
        X
      </Link>
    </button>
  );
};

export default SearchFromReset;
