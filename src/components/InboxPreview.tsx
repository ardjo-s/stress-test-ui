import type { StressPack } from "../types.ts";

type InboxPreviewProps = {
  pack: StressPack;
  worst: boolean;
};

export function InboxPreview({ pack, worst }: InboxPreviewProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_20px_50px_-28px_rgba(17,17,17,0.35)]">
      <header className="flex items-center justify-between px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-[15px] font-medium">Inbox</h2>
          <p className="text-[13px] text-mute">
            {worst ? `${pack.totalCount.toLocaleString()} open` : "Today"}
          </p>
        </div>
        <span
          data-stress="unread-count"
          className="rounded-full bg-ink px-2 py-0.5 text-[11px] text-canvas"
        >
          {worst ? "1,284" : "1"}
        </span>
      </header>

      <ul className="divide-y divide-line border-t border-line">
        {pack.messages.map((message) => (
          <li
            key={message.id}
            dir={message.dir}
            className="flex items-start gap-3 px-5 py-3.5"
          >
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-medium">
              {message.initials}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p
                  data-stress={`from-${message.id}`}
                  className={`text-[13px] font-medium ${worst ? "break-all" : "truncate"}`}
                >
                  {message.from}
                </p>
                <span className="shrink-0 text-[11px] text-soft">{message.time}</span>
              </div>
              <p
                data-stress={`subject-${message.id}`}
                className={`mt-0.5 text-[13px] leading-5 ${
                  worst ? "line-clamp-2" : "truncate"
                }`}
              >
                {message.subject}
              </p>
              <p className={`text-[12px] text-mute ${worst ? "line-clamp-2" : "truncate"}`}>
                {message.preview}
              </p>
            </div>
            {message.unread ? (
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ink" />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
