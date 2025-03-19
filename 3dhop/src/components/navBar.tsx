'use client'
import Link from "next/link"
import Image from  "next/image";

const NavBar = () => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-slate-700">
      <Link href="/">
        <p>xD</p>
      </Link>
    </div>
  );
};

export default NavBar;


