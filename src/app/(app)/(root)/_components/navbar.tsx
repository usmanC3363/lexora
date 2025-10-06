"use client";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useTRPC } from "@/trpc/client";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import NavbarSidebar from "./navbar-sidebar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarItemProps {
  title: string;
  href: string;
  //   children: React.ReactNode;
  navItemClass?: string;
  navLinkClass?: string;
  isActive?: boolean;
  clickHandler?: () => void;
}

export const NavbarItem = ({
  title,
  href,
  isActive,
  navItemClass,
  navLinkClass,
  clickHandler,
}: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        navItemClass,
        isActive && "bg-black text-white hover:bg-black hover:text-white",
        navLinkClass,
      )}
    >
      <Link key={title} href={href} onClick={clickHandler}>
        <span>{title}</span>
      </Link>
    </Button>
  );
};

export const Navbar = () => {
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  return (
    <nav
      className={`flex h-20 items-center justify-between gap-8 border-b bg-white font-medium`}
    >
      <Link href="/" className="pl-6">
        <span className={cn("text-5xl font-semibold tracking-tight")}>
          Lexora
        </span>
      </Link>

      <NavbarSidebar
        open={isSidebarOpen}
        onChange={setIsSidebarOpen}
        items={navLinks}
      />
      <div className="flex justify-between gap-2">
        {navLinks.map((navLink) => (
          <NavbarItem
            key={navLink.title}
            {...navLink}
            isActive={pathname === navLink.href}
            navItemClass="hover:border-primary rounded-full border-transparent bg-transparent px-3.5 text-lg hover:bg-transparent"
          />
        ))}
      </div>
      {session.data?.user ? (
        // dashboard button if signed In
        <div className="hidden lg:flex">
          <Button
            variant="secondary"
            className={cn(
              "h-full min-h-[4.9rem] rounded-none border-t-0 border-r-0 border-b-0 border-l bg-black px-10 text-lg text-white transition-all duration-100 ease-linear hover:bg-cyan-300 hover:tracking-wide hover:text-black",
            )}
          >
            <Link className="min-w-[5.5em]" prefetch href="/admin">
              Dashboard
            </Link>
          </Button>
        </div>
      ) : (
        // login and sign-up buttons if not signed in
        <>
          <div className="hidden lg:flex">
            <Button
              variant="secondary"
              className={cn(
                // fix this issue currently using manual h- values for button, should adapt to full
                "h-full min-h-[4.9rem] rounded-none border-t-0 border-r-0 border-b-0 border-l bg-white px-12 text-lg transition-colors hover:bg-pink-400",
              )}
            >
              <Link className="" prefetch href="/sign-in">
                Login
              </Link>
            </Button>
            <Button
              variant="secondary"
              className={cn(
                "h-full min-h-[4.9rem] rounded-none border-t-0 border-r-0 border-b-0 border-l bg-black px-12 text-lg text-white transition-colors hover:bg-pink-400 hover:text-black",
              )}
            >
              <Link className="" prefetch href="/sign-up">
                Start selling
              </Link>
            </Button>
          </div>
        </>
      )}
      {/* Menu Icon */}
      <div className="flex lg:hidden">
        <Button
          variant="ghost"
          className={`size-12 border-transparent bg-white`}
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
};
