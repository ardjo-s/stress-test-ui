import type { Member, StressPack } from "../types.ts";

type MembersPreviewProps = {
  pack: StressPack;
  worst: boolean;
};

function StatusPill({ member, worst }: { member: Member; worst: boolean }) {
  const isActive = member.status === "active";
  const isExpired = member.status === "expired";

  return (
    <span
      data-stress={`status-${member.id}`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] leading-none ${
        isActive
          ? "bg-neutral-50 text-neutral-700"
          : isExpired
            ? "bg-neutral-50 text-neutral-500"
            : "border border-line bg-paper text-neutral-600"
      } ${worst && isExpired ? "max-w-[148px]" : ""}`}
    >
      {isActive ? <span className="size-1.5 rounded-full bg-ok" /> : null}
      <span className={worst && isExpired ? "truncate" : "whitespace-nowrap"}>
        {member.statusLabel}
      </span>
    </span>
  );
}

export function MembersPreview({ pack, worst }: MembersPreviewProps) {
  const countLabel = worst
    ? `${pack.totalCount.toLocaleString()} members`
    : `${pack.members.length} members`;

  return (
    <section className="overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_20px_50px_-28px_rgba(17,17,17,0.35)]">
      <header className="flex items-center justify-between px-5 py-4">
        <div className="flex min-w-0 items-baseline gap-2">
          <h2 className="text-[15px] font-medium">Members</h2>
          <p className="truncate text-[13px] text-mute">{countLabel}</p>
        </div>
        <button
          type="button"
          className="rounded-full border border-line px-3 py-1 text-[13px] text-ink"
        >
          Invite
        </button>
      </header>

      <ul
        className={`divide-y divide-line border-y border-line ${
          worst ? "max-h-[360px] overflow-y-auto" : ""
        }`}
      >
        {pack.members.map((member) => (
          <li key={member.id} className="flex items-start gap-3 px-5 py-3.5">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-medium text-neutral-600">
              {member.initials}
            </span>
            <div className="min-w-0 flex-1">
              <p
                data-stress={`name-${member.id}`}
                className={`text-[14px] font-medium leading-5 text-ink ${
                  worst ? "break-words" : "truncate"
                }`}
              >
                {member.name}
              </p>
              <p
                data-stress={`role-${member.id}`}
                className={`text-[13px] leading-5 text-mute ${
                  worst ? "whitespace-normal" : "truncate"
                }`}
              >
                {member.role}
              </p>
            </div>
            <div className="mt-0.5 flex items-center gap-2">
              <StatusPill member={member} worst={worst} />
              <span className="text-soft">···</span>
            </div>
          </li>
        ))}
      </ul>

      <footer className="flex items-center justify-between px-5 py-3 text-[12px] text-mute">
        <span>{worst ? pack.visibleLabel : "Showing all 5"}</span>
        <span>Updated just now</span>
      </footer>
    </section>
  );
}
