import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTRPC } from "@/trpc/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { DEFAULT_LIMIT } from "@/lib/constants";
import { Loader2, LoaderIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface TagsFilterProps {
  value?: string[] | null;
  onChange: (value: string[]) => void;
}

export const TagsFilter = ({ value, onChange }: TagsFilterProps) => {
  const trpc = useTRPC();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      trpc.tags.getMany.infiniteQueryOptions(
        { limit: DEFAULT_LIMIT },
        {
          getNextPageParam: (lastPage) => {
            return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
          },
        },
      ),
    );

  const onClick = (tag: string) => {
    // if tag is already in the list, remove it
    if (value?.includes(tag)) {
      onChange(value?.filter((t) => t !== tag));
      // otherwise add it
    } else {
      onChange([...(value || []), tag]);
    }
  };

  return (
    <div className="flex flex-col gap-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="size-4 animate-spin" />
        </div>
      ) : (
        data?.pages.map((page) =>
          page.docs.map(({ id, name }) => (
            <div
              key={id}
              className="flex items-center justify-between"
              onClick={() => onClick(name)}
            >
              <p className="">{name}</p>
              <Checkbox
                checked={value?.includes(name)}
                onCheckedChange={() => onClick(name)}
              />
            </div>
          )),
        )
      )}

      {hasNextPage && (
        <button
          type="button"
          disabled={isFetchingNextPage}
          onClick={() => {}}
          className="justify-start text-start font-medium underline disabled:opacity-50"
        >
          Load More
        </button>
      )}
    </div>
  );
};
