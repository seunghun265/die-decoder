import React from "react";
import { getBinColor } from "@/lib/statistics";

interface BinLegendProps {
  bins: number[];
}

/**
 * Bin 색상 범례
 */
const BinLegend: React.FC<BinLegendProps> = ({ bins }) => {
  const uniqueBins = [...new Set(bins)].sort((a, b) => a - b);

  return (
    <div className="space-y-1">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
        Bin Legend
      </div>
      <div className="grid grid-cols-2 gap-1">
        {uniqueBins.map((bin) => (
          <div key={bin} className="flex items-center gap-2 text-xs">
            <div
              className="w-3 h-3 rounded-sm border border-border/50"
              style={{ backgroundColor: getBinColor(bin) }}
            />
            <span className="text-muted-foreground">
              Bin {bin} {bin === 1 ? "(Pass)" : "(Fail)"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BinLegend;
