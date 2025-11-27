/* eslint-disable @typescript-eslint/no-explicit-any */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SerializedEditorState, SerializedLexicalNode } from "lexical";

export function extractPlainText(
  rich: SerializedEditorState | undefined,
): string {
  if (!rich?.root?.children) return "";

  return rich.root.children
    .map((node: SerializedLexicalNode) =>
      "text" in node && typeof (node as any).text === "string"
        ? (node as any).text
        : "",
    )
    .join(" ");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateTenantURL(tenantSlug: string) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const isSubdomainRoutingEnabled =
    process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_ROUTING === "true";

  if (isDevelopment || !isSubdomainRoutingEnabled)
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}`;

  const protocol = "https";
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;

  // in production, https://john.lexora.com
  return `${protocol}://${tenantSlug}.${domain}`;
}

export function formatCurrency(value: string | number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

// export function extractPlainText(rich: any): string {
//   if (!rich?.root?.children) return "";
//   return rich.root.children
//     .map((node: any) => ("text" in node ? node.text : ""))
//     .join(" ");
// }
