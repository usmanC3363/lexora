import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

type Props = {
  activeCategory: string | null;
  activeCategoryName: string | null;
  activeSubCategoryName: string | null;
};

const BreadcrumbNav = ({
  activeCategory,
  activeCategoryName,
  activeSubCategoryName,
}: Props) => {
  if (!activeCategoryName || activeCategory === "all") return null;
  return (
    <Breadcrumb className="pb-4 max-lg:py-4">
      <BreadcrumbList>
        {activeSubCategoryName ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink
                asChild
                className="text-primary font-medium underline md:text-base lg:text-lg"
              >
                <Link href={`${activeCategory}`}> {activeCategoryName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-primary font-medium md:text-base lg:text-lg">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium md:text-base lg:text-lg">
                <Link href={`${activeSubCategoryName}`}>
                  {activeSubCategoryName}
                </Link>
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium md:text-base lg:text-lg">
              <Link href={`${activeCategory}`}> {activeCategoryName}</Link>
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadcrumbNav;
