import {
  Check,
  UserPlus,
  Pencil,
  Users,
  LogOut,
  Plus,
  Hash,
  Camera,
  Bookmark,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";

const points = [
  "Add or remove members",
  "Make members admin",
  "Rename groups",
  "Leave groups anytime",
];

const channels = ["General", "Product", "Design", "Development"];

const actions = [
  { icon: UserPlus, label: "Add members" },
  { icon: Pencil, label: "Rename group" },
  { icon: Users, label: "Manage members" },
  { icon: LogOut, label: "Leave group", danger: true },
];

export function GroupCollaboration() {
  return (
    <section className="overflow-hidden bg-surface">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-8 lg:px-0 lg:py-16">
        {/* left: group panel mockup — narrow & tall */}
        <div className="mx-auto flex w-full max-w-[300px] lg:ml-[1.875rem]">
          <div className="flex flex-col items-center gap-5 rounded-l-2xl bg-surface-muted px-3 py-6">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-accent text-accent-contrast">
              <Bookmark className="size-4" />
            </span>
            <div className="flex flex-col items-center gap-1 text-[10px] text-ink-muted">
              <Camera className="size-4" />
              Concept
            </div>
            <div className="flex flex-col items-center gap-1 text-[10px] text-ink-muted">
              <Bookmark className="size-4" />
              Dataped
            </div>
          </div>

          <div className="flex-1 rounded-2xl border border-line bg-surface p-4 shadow-lg">
            <p className="text-sm font-bold text-ink">Project Team</p>
            <p className="text-xs text-ink-muted">8 members</p>

            <div className="mt-4 flex items-center">
              <div className="flex -space-x-2">
                {[
                  { n: "Ada", c: "#ff5a4f" },
                  { n: "Ben", c: "#3f8fd9" },
                  { n: "Cara", c: "#7c5cff" },
                  { n: "Dan", c: "#3fae87" },
                  { n: "Eve", c: "#d99a1f" },
                ].map(({ n, c }) => (
                  <Avatar
                    key={n}
                    name={n}
                    size="sm"
                    color={c}
                    className="ring-2 ring-surface"
                  />
                ))}
              </div>
              <span className="ml-2 flex size-8 items-center justify-center rounded-full bg-accent text-accent-contrast">
                <Plus className="size-3.5" />
              </span>
            </div>

            <div className="mt-5 flex flex-col gap-3.5">
              {channels.map((c) => (
                <div
                  key={c}
                  className="flex items-center gap-2.5 text-sm font-medium text-ink"
                >
                  <span className="flex size-5 items-center justify-center rounded-md bg-tint-coral/40 text-accent">
                    <Hash className="size-3" />
                  </span>
                  {c}
                </div>
              ))}
              <div className="flex items-center gap-2.5 pt-1 text-sm text-ink-muted">
                <Plus className="size-4" />
                Add channel
              </div>
            </div>
          </div>
        </div>

        {/* center: text + checklist */}
        <div className="px-5 sm:px-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-muted">
            Group collaboration
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-[1.15] text-ink sm:text-[1.9rem]">
            Teams communicate
            <br />
            better together.
          </h2>
          <p className="mt-3 text-sm text-ink-muted">
            Create groups, manage members, assign admins, and keep everyone in the
            loop.
          </p>
          <ul className="mt-5 flex flex-col gap-2.5">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-ink">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-success-ink text-accent-contrast">
                  <Check className="size-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* right: actions card */}
        <div className="w-full max-w-[300px] px-5 sm:px-0 lg:mx-auto xl:ml-4">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-xl">
            {actions.map(({ icon: Icon, label, danger }, i) => (
              <div
                key={label}
                className={`flex items-center gap-3 px-5 py-4 text-sm font-medium ${
                  i > 0 ? "border-t border-line/70" : ""
                } ${danger ? "text-accent" : "text-ink"}`}
              >
                <Icon
                  className={`size-4 shrink-0 ${danger ? "text-accent" : "text-ink-muted"}`}
                />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
