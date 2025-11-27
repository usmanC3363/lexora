import {
  useQueryStates,
  parseAsArrayOf,
  parseAsString,
  parseAsStringLiteral,
} from "nuqs";

const sortValues = ["curated", "trending", "popular"];

const params = {
  search: parseAsString.withOptions({ clearOnDefault: true }).withDefault(""),
  sort: parseAsStringLiteral(sortValues).withDefault("curated"),
  minPrice: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  maxPrice: parseAsString
    .withOptions({
      clearOnDefault: true,
    })
    .withDefault(""),
  tags: parseAsArrayOf(parseAsString)
    .withOptions({ clearOnDefault: true })
    .withDefault([]),
};

export const useProductFilters = () => {
  return useQueryStates(params);
};
