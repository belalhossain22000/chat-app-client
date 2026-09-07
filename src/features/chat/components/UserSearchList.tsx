"use client";

import { Check, SearchX } from "lucide-react";
import { cn } from "@/utils/cn";
import { Avatar } from "@/components/ui/Avatar";
import { UserListSkeleton } from "./UserListSkeleton";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useSearchUsersQuery } from "@/features/chat/api/users.api";
import type { User } from "@/features/chat/types/user.types";

interface UserSearchListProps {
  query: string;
  multi?: boolean;
  selectedIds: Set<string>;
  excludeIds?: Set<string>;
  onToggle: (user: User) => void;
}

export function UserSearchList({
  query,
  multi = false,
  selectedIds,
  excludeIds,
  onToggle,
}: UserSearchListProps) {
  const debounced = useDebouncedValue(query.trim(), 300);
  const { data, isFetching, isError } = useSearchUsersQuery(debounced);

  const users = (data ?? []).filter((u) => !excludeIds?.has(u.id));

  if (isFetching) return <UserListSkeleton />;

  if (isError) {
    return (
      <p className="py-10 text-center text-sm text-ink-muted">
        Couldn&rsquo;t search right now. Try again.
      </p>
    );
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-tint-coral/50 text-accent">
          <SearchX className="size-5" />
        </span>
        <p className="text-sm font-medium text-ink">Can&rsquo;t find the person?</p>
        <p className="text-xs text-ink-muted">Try a different name or phone number.</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col">
      {users.map((user) => {
        const selected = selectedIds.has(user.id);
        return (
          <li key={user.id}>
            <button
              type="button"
              onClick={() => onToggle(user)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                selected ? "bg-tint-coral/40" : "hover:bg-surface-muted",
              )}
            >
              <Avatar name={user.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                <p className="truncate text-xs text-ink-muted">{user.phone}</p>
              </div>
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border",
                  selected
                    ? "border-accent bg-accent text-accent-contrast"
                    : "border-line",
                  multi ? "rounded-md" : "rounded-full",
                )}
              >
                {selected && <Check className="size-3.5" />}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
