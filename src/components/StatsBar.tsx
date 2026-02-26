import React from "react";
import { YieldStats, FailDensity } from "@/lib/statistics";

interface StatsBarProps {
  yield_stats: YieldStats;
  failDensity: FailDensity;
}

/**
 * 상단 통계 바: Yield %, Fail Density, 총 Die 수
 */
const StatsBar: React.FC<StatsBarProps> = ({ yield_stats, failDensity }) => {
  const yieldColor =
    yield_stats.yieldPercent >= 90 ? "text-pass text-glow" :
    yield_stats.yieldPercent >= 70 ? "text-warn text-glow-warn" :
    "text-fail text-glow-fail";

  return (
    <div className="flex items-center gap-6 px-4 py-2 bg-card border-b border-border text-xs font-mono">
      {/* Yield */}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">YIELD:</span>
        <span className={`text-lg font-bold ${yieldColor}`}>
          {yield_stats.yieldPercent.toFixed(1)}%
        </span>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* 총계 */}
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">
          TOTAL: <span className="text-foreground">{yield_stats.total}</span>
        </span>
        <span className="text-muted-foreground">
          PASS: <span className="text-pass">{yield_stats.pass}</span>
        </span>
        <span className="text-muted-foreground">
          FAIL: <span className="text-fail">{yield_stats.fail}</span>
        </span>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Fail Density */}
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground">
          CENTER FAIL: <span className="text-warn">{failDensity.centerFailPercent.toFixed(1)}%</span>
          <span className="text-muted-foreground/60 ml-1">({failDensity.centerFail}/{failDensity.centerTotal})</span>
        </span>
        <span className="text-muted-foreground">
          EDGE FAIL: <span className="text-warn">{failDensity.edgeFailPercent.toFixed(1)}%</span>
          <span className="text-muted-foreground/60 ml-1">({failDensity.edgeFail}/{failDensity.edgeTotal})</span>
        </span>
      </div>
    </div>
  );
};

export default StatsBar;
