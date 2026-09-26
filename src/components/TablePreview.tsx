import type { StressPack } from "../types.ts";

type TablePreviewProps = {
  pack: StressPack;
  worst: boolean;
};

export function TablePreview({ pack, worst }: TablePreviewProps) {
  return (
    <section className="overflow-hidden rounded-[28px] border border-line bg-paper shadow-[0_20px_50px_-28px_rgba(17,17,17,0.35)]">
      <header className="flex items-center justify-between px-5 py-4">
        <div className="min-w-0">
          <h2 className="text-[15px] font-medium">Invoices</h2>
          <p className="text-[13px] text-mute">
            {worst ? `${pack.totalCount.toLocaleString()} records` : "This month"}
          </p>
        </div>
        <button
          type="button"
          className="rounded-full border border-line px-3 py-1 text-[13px]"
        >
          Export
        </button>
      </header>

      <div className={worst ? "overflow-x-auto" : "overflow-hidden"}>
        <table className="w-full min-w-[640px] border-t border-line text-left text-[13px]">
          <thead className="bg-neutral-50 text-[11px] uppercase tracking-[0.08em] text-mute">
            <tr>
              {pack.columns.map((column) => (
                <th
                  key={column}
                  data-stress={`col-${column}`}
                  className={`border-b border-line px-4 py-2.5 font-medium ${
                    worst ? "whitespace-nowrap" : ""
                  }`}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pack.rows.map((row) => (
              <tr key={row.id} className="border-b border-line last:border-0">
                {row.cells.map((cell, index) => (
                  <td
                    key={`${row.id}-${index}`}
                    data-stress={`cell-${row.id}-${index}`}
                    className={`px-4 py-3 align-top ${
                      worst
                        ? index === 1
                          ? "max-w-[220px] break-all"
                          : "whitespace-nowrap"
                        : "truncate"
                    }`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
