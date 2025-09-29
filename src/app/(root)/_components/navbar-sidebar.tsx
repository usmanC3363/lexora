import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavbarItem } from "./navbar";
import { navLinks } from "@/lib/constants";
import Link from "next/link";

interface NavLinkItem {
  title: string;
  href: string;
  className?: string;
  //   children: React.ReactNode;
}

interface Props {
  items: NavLinkItem[];
  open: boolean;
  onChange: (open: boolean) => void;
}

const NavbarSidebar = ({ items, open, onChange }: Props) => {
  return (
    <div>
      <Sheet open={open} onOpenChange={onChange}>
        <SheetContent>
          <SheetHeader className="border-b p-4">
            <div className="flex items-center">
              <SheetTitle>Menu</SheetTitle>
            </div>
          </SheetHeader>
          <ScrollArea className="flex h-full flex-col gap-8 overflow-y-auto pb-2">
            {navLinks.map((navLink: NavLinkItem) => (
              <NavbarItem
                key={navLink.title}
                {...navLink}
                navLinkClass="w-full text-left p-4 hover:bg-black hover:text-white flex items-center justify-start text-base font-medium rounded-none shadow-none"
                // isActive={pathname === navLink.href}
              />
            ))}
            <div className="border-t">
              <Link
                href="sign-in"
                className="flex w-full items-center rounded-none p-4 text-left text-base font-medium shadow-none hover:bg-black hover:text-white"
              >
                Log in
              </Link>
              <Link
                href="sign-up"
                className="flex w-full items-center rounded-none p-4 text-left text-base font-medium shadow-none hover:bg-black hover:text-white"
              >
                Start Selling
              </Link>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavbarSidebar;
