import React, { useState, useMemo, useCallback } from "react";
import WaferCanvas from "@/components/WaferCanvas";
import DieDetailPanel from "@/components/DieDetailPanel";
import StatsBar from "@/components/StatsBar";
import SpecLimitPanel from "@/components/SpecLimitPanel";
import CsvUpload from "@/components/CsvUpload";
import BinLegend from "@/components/BinLegend";
import GuideDialog from "@/components/GuideDialog";
import {
  DieData,
  SpecLimits,
  calculateYield,
  calculateFailDensity,
  parseCSV,
  generateDemoData,
} from "@/lib/statistics";

/** 기본 Spec Limits */
const DEFAULT_SPECS: SpecLimits = {
  vth: { min: 0.35, max: 0.65 },
  idsat: { min: 150, max: 350 },
  leakage: { min: 0, max: 1e-8 },
  resistance: { min: 50, max: 200 },
};

const Index: React.FC = () => {
  const [dies, setDies] = useState<DieData[]>(() => generateDemoData(21));
  const [selectedDie, setSelectedDie] = useState<DieData | null>(null);
  const [specLimits, setSpecLimits] = useState<SpecLimits>(DEFAULT_SPECS);

  // 통계 실시간 계산
  const yieldStats = useMemo(() => calculateYield(dies), [dies]);
  const failDensity = useMemo(() => {
    const xs = dies.map((d) => d.x);
    const ys = dies.map((d) => d.y);
    const gridMax = Math.max(
      (Math.max(...xs) - Math.min(...xs)) / 2,
      (Math.max(...ys) - Math.min(...ys)) / 2
    );
    return calculateFailDensity(dies, gridMax);
  }, [dies]);
  const bins = useMemo(() => dies.map((d) => d.bin), [dies]);

  // CSV 업로드 핸들러
  const handleCsvUpload = useCallback((text: string) => {
    const parsed = parseCSV(text);
    if (parsed.length > 0) {
      setDies(parsed);
      setSelectedDie(null);
    }
  }, []);

  // 데모 데이터 리로드
  const handleReload = useCallback(() => {
    setDies(generateDemoData(21));
    setSelectedDie(null);
  }, []);

  return (
    <div className="flex flex-col h-screen overflow-hidden scanline">
      {/* 헤더 */}
      <header className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-pass animate-pulse-glow" />
          <h1 className="text-sm font-semibold text-foreground text-glow tracking-wider">
            WAFER MAP ANALYZER
          </h1>
          <span className="text-[10px] text-muted-foreground">v1.0</span>
        </div>
        <div className="flex items-center gap-2">
          <GuideDialog />
          <button
            onClick={handleReload}
            className="px-3 py-1 text-[10px] border border-border rounded
              text-muted-foreground hover:text-foreground hover:border-primary/50
              transition-colors uppercase tracking-wider"
          >
            Demo Data
          </button>
        </div>
      </header>

      {/* Stats Bar */}
      <StatsBar yield_stats={yieldStats} failDensity={failDensity} />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* 웨이퍼 맵 (메인 영역) */}
        <div className="flex-1 relative bg-background">
          <WaferCanvas
            dies={dies}
            specLimits={specLimits}
            selectedDie={selectedDie}
            onSelectDie={setSelectedDie}
          />
        </div>

        {/* 오른쪽 패널 */}
        <aside className="w-72 border-l border-border bg-card overflow-y-auto flex flex-col">
          <div className="flex-1 p-4 space-y-5">
            {/* Die 상세 정보 */}
            <DieDetailPanel die={selectedDie} specLimits={specLimits} />

            <div className="border-t border-border" />

            {/* Spec Limits */}
            <SpecLimitPanel specLimits={specLimits} onSpecChange={setSpecLimits} />

            <div className="border-t border-border" />

            {/* Bin Legend */}
            <BinLegend bins={bins} />

            <div className="border-t border-border" />

            {/* CSV Upload */}
            <CsvUpload onUpload={handleCsvUpload} />
          </div>

          {/* 하단 상태 */}
          <div className="px-4 py-2 border-t border-border text-[9px] text-muted-foreground/50">
            SCROLL TO ZOOM • DRAG TO PAN • CLICK DIE FOR DETAILS
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Index;
