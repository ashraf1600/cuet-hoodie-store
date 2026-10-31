import React from 'react';
import { SIZE_CHART } from '../data/products';

interface SizeChartProps {
  /** Highlights this size's row */
  selected?: string;
  compact?: boolean;
}

/** Hoodie measurements in inches and centimetres. */
export const SizeChart: React.FC<SizeChartProps> = ({ selected, compact = false }) => {
  const cm = (inch: number) => Math.round(inch * 2.54);
  const cell = compact ? 'px-2 py-2' : 'px-3 py-3';

  return (
    <div className="overflow-x-auto">
      <table className="w-full font-body text-sm text-left border-collapse">
        <caption className="sr-only">Hoodie size chart in inches</caption>
        <thead>
          <tr className="text-[11px] uppercase tracking-[0.14em] text-muted border-b border-line">
            <th scope="col" className={`${cell} font-semibold`}>Size</th>
            <th scope="col" className={`${cell} font-semibold`}>Chest</th>
            <th scope="col" className={`${cell} font-semibold`}>Length</th>
            <th scope="col" className={`${cell} font-semibold`}>Sleeve</th>
          </tr>
        </thead>
        <tbody>
          {SIZE_CHART.map(row => {
            const active = row.size === selected;
            return (
              <tr
                key={row.size}
                className={`border-b border-line/50 tabular-nums ${active ? 'bg-paper/[0.06] text-paper' : 'text-paper/85'}`}
              >
                <th scope="row" className={`${cell} font-anton text-lg ${active ? 'text-brick-bright' : 'text-paper'}`}>
                  {row.size}
                </th>
                <td className={cell}>
                  {row.chest}&quot; {!compact && <span className="text-muted-dark text-xs">/ {cm(row.chest)} cm</span>}
                </td>
                <td className={cell}>
                  {row.length}&quot; {!compact && <span className="text-muted-dark text-xs">/ {cm(row.length)} cm</span>}
                </td>
                <td className={cell}>
                  {row.sleeve}&quot; {!compact && <span className="text-muted-dark text-xs">/ {cm(row.sleeve)} cm</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SizeChart;
