"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Users, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SidebarHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  onNewConversation: () => void;
  onCreateGroup: () => void;
}

export function SidebarHeader({
  search,
  onSearchChange,
  onNewConversation,
  onCreateGroup,
}: SidebarHeaderProps) {
  return (
    <div className="border-b border-line px-4 pb-3 pt-4">
      <Link href="/" aria-label="ChatFlow home" className="mb-4 inline-block">
        <Image src="/logo.png" alt="ChatFlow" width={240} height={80} priority className="h-16 w-auto" />
      </Link>

      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={onNewConversation}>
          <Plus className="size-4" />
          New conversation
        </Button>
        <Button size="sm" variant="secondary" onClick={onCreateGroup}>
          <Users className="size-4" />
          Create group
        </Button>
      </div>

      <div className="mt-3 flex h-11 items-center gap-2.5 rounded-xl border border-line bg-surface-muted px-3.5 focus-within:ring-2 focus-within:ring-accent">
        <Search className="size-4 shrink-0 text-ink-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search conversations..."
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
        />
      </div>
    </div>
  );
}
