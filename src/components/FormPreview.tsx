import type { StressPack } from "../types.ts";

type FormPreviewProps = {
  pack: StressPack;
  worst: boolean;
};

export function FormPreview({ pack, worst }: FormPreviewProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_20px_50px_-28px_rgba(17,17,17,0.35)]">
      <div className="flex items-start gap-3 border-b border-line px-5 py-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[13px] font-medium text-neutral-600">
          {worst ? "AW" : "MO"}
        </span>
        <div className="min-w-0 flex-1">
          <p
            data-stress="profile-name"
            className={`text-[15px] font-medium leading-5 ${worst ? "break-words" : "truncate"}`}
          >
            {pack.profileName}
          </p>
          <p
            data-stress="profile-email"
            className={`text-[12px] text-mute ${worst ? "break-all" : "truncate"}`}
          >
            {pack.profileEmail}
          </p>
          <p
            data-stress="profile-title"
            className={`mt-1 text-[12px] text-soft ${worst ? "" : "truncate"}`}
          >
            {pack.profileTitle}
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-line px-3 py-1 text-[13px]"
        >
          Save
        </button>
      </div>

      <div className="space-y-4 px-5 py-5">
        {pack.fields.map((field) => (
          <label key={field.id} className="block">
            <span
              data-stress={`label-${field.id}`}
              className="block text-[12px] font-medium leading-4 text-neutral-700"
            >
              {field.label}
            </span>
            {field.multiline ? (
              <textarea
                readOnly
                value={field.value}
                rows={worst ? 4 : 2}
                className="mt-1.5 w-full resize-none rounded-xl border border-line bg-neutral-50 px-3 py-2 text-[13px] leading-5 outline-none"
              />
            ) : (
              <input
                readOnly
                value={field.value}
                className="mt-1.5 w-full rounded-xl border border-line bg-neutral-50 px-3 py-2 text-[13px] outline-none"
              />
            )}
            {field.hint ? (
              <span className="mt-1 block text-[11px] leading-4 text-mute">
                {field.hint}
              </span>
            ) : null}
            {field.error && worst ? (
              <span className="mt-1 block text-[11px] leading-4 text-warn">
                {field.error}
              </span>
            ) : null}
          </label>
        ))}
      </div>
    </section>
  );
}
