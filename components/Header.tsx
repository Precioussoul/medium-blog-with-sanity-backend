import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header className="flex bg-white shadow-sm xl:shadow-none justify-between p-5 max-w-7xl mx-auto sticky top-0 z-10">
      <div className="flex items-center space-x-5">
        <Link href={"/"}>
          <img
            src="https://links.papareact.com/yvf"
            alt="Medium logo"
            className="w-44 object-contain cursor-pointer"
          />
        </Link>
        <div className="hidden md:inline-flex items-center space-x-5">
          <h3>About</h3>
          <h3>Contact</h3>
          <h3 className="text-white bg-green-600 px-4 py-1 rounded-full ">
            Follow
          </h3>
        </div>
      </div>
      <div className="flex items-center space-x-5">
        <Link
          href={"https://mediumblogsite.sanity.studio"}
          target={"_blank"}
          className="text-green-600 py-1 px-3 cursor-pointer border sm:border-none rounded-full border-green-500"
        >
          Sign in
        </Link>
        <h3 className="border px-2 py-1 rounded-full border-green-600 cursor-pointer text-sm hidden sm:block">
          Get Started
        </h3>
      </div>
    </header>
  );
};

export default Header;
