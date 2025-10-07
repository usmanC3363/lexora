import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  minPrice: string | null;
  maxPrice: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export const FormatAsCurrency = (value: string) => {
  // regex
  const numericValue = value.replace(/[^0-9.]/g, "");
  const parts = numericValue.split(".");
  //   decimal value
  const formattedValue =
    parts[0] + (parts.length > 1 ? "." + parts[1]?.slice(0, 2) : "");
  if (!formattedValue) return "";
  const numberValue = parseFloat(formattedValue);
  if (isNaN(numberValue)) return "";

  //   built in API
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numberValue);
};

export const PriceFilter = ({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: Props) => {
  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMinPriceChange(numericValue);
  };
  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const numericValue = e.target.value.replace(/[^0-9.]/g, "");
    onMaxPriceChange(numericValue);
  };
  <div className="flex flex-col gap-2">
    <div className="flex flex-col gap-2">
      <Label className="text-base font-medium">Minimum Price</Label>
      <Input
        type="text"
        placeholder="$0"
        value={minPrice ? FormatAsCurrency(minPrice) : ""}
        onChange={handleMinPriceChange}
      />
    </div>
    <div className="flex flex-col gap-2">
      <Label className="text-base font-medium">Maximum Price</Label>
      <Input
        type="text"
        placeholder="∞"
        value={maxPrice ? FormatAsCurrency(maxPrice) : ""}
        onChange={handleMaxPriceChange}
      />
    </div>
  </div>;
};
