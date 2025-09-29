"use client";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavbarSidebar from "./navbar-sidebar";
import { useState } from "react";
import { MenuIcon } from "lucide-react";

const poppins = Poppins({
  weight: ["700"],
  subsets: ["latin"],
});

interface NavbarItemProps {
  title: string;
  href: string;
  //   children: React.ReactNode;
  navLinkClass?: string;
  isActive?: boolean;
}

export const NavbarItem = ({
  title,
  href,
  isActive,
  navLinkClass,
}: NavbarItemProps) => {
  return (
    <Button
      asChild
      variant="outline"
      className={cn(
        "hover:border-primary rounded-full border-transparent bg-transparent px-3.5 text-lg hover:bg-transparent",
        isActive && "bg-black text-white hover:bg-black hover:text-white",
        navLinkClass,
      )}
    >
      {/* {children} */}
      <Link key={title} href={href}>
        <span>{title}</span>
      </Link>
    </Button>
  );
};

export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  return (
    <nav
      className={`flex h-20 items-center justify-between gap-8 border-b bg-white font-medium`}
    >
      <Link href="/" className="pl-6">
        <span
          className={cn(
            "text-5xl font-semibold tracking-tight",
            poppins.className,
          )}
        >
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
          />
        ))}
      </div>
      <div className="hidden lg:flex">
        <Button
          variant="secondary"
          className={cn(
            // fix this issue currently using manual h- values for button, should adapt to full
            "h-full min-h-[4.9rem] rounded-none border-t-0 border-r-0 border-b-0 border-l bg-white px-12 text-lg transition-colors hover:bg-pink-400",
          )}
        >
          <Link className="" href="/sign-in">
            Login
          </Link>
        </Button>
        <Button
          variant="secondary"
          className={cn(
            "h-full min-h-[4.9rem] rounded-none border-t-0 border-r-0 border-b-0 border-l bg-black px-12 text-lg text-white transition-colors hover:bg-pink-400 hover:text-black",
          )}
        >
          <Link className="" href="/sign-up">
            Start selling
          </Link>
        </Button>
      </div>
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
