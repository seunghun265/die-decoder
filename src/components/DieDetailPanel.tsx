import React from "react";
import { DieData, getSpecViolations, SpecLimits } from "@/lib/statistics";

interface DieDetailPanelProps {
  die: DieData | null;
  specLimits: SpecLimits;
}

/**
 * 선택된 Die의 전기적 특성 표시 패널
 */
const DieDetailPanel: React.FC<DieDetailPanelProps> = ({ die, specLimits }) => {
  if (!die) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        <div className="text-center">
          <div className="text-2xl mb-2 opacity-30">⬡</div>
          <p>Die를 클릭하여</p>
          <p>상세 정보 확인</p>
        </div>
      </div>
    );
  }

  const violations = getSpecViolations(die, specLimits);
  const isPass = die.bin === 1;

  const params = [
    { label: "Vth", value: `${die.vth.toFixed(4)} V`, key: "Vth" },
    { label: "Idsat", value: `${die.idsat.toFixed(2)} µA`, key: "Idsat" },
    { label: "Leakage", value: `${die.leakage.toExponential(2)} A`, key: "Leakage" },
    { label: "Resistance", value: `${die.resistance.toFixed(2)} Ω`, key: "Resistance" },
  ];

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
        Die Information
      </div>

      {/* 좌표 및 Bin */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-muted rounded px-3 py-2">
          <div className="text-[10px] text-muted-foreground">COORD</div>
          <div className="text-sm font-semibold">({die.x}, {die.y})</div>
        </div>
        <div className="bg-muted rounded px-3 py-2">
          <div className="text-[10px] text-muted-foreground">BIN</div>
          <div className={`text-sm font-semibold ${isPass ? "text-pass" : "text-fail"}`}>
            {die.bin} ({isPass ? "PASS" : "FAIL"})
          </div>
        </div>
      </div>

      {/* 전기적 특성 */}
      <div className="space-y-1.5">
        {params.map((p) => {
          const isViolation = violations.includes(p.key);
          return (
            <div
              key={p.key}
              className={`flex items-center justify-between px-3 py-2 rounded text-sm ${
                isViolation
                  ? "bg-destructive/10 border border-destructive/30"
                  : "bg-muted"
              }`}
            >
              <span className="text-muted-foreground text-xs">{p.label}</span>
              <span className={`font-mono font-semibold ${isViolation ? "text-warn text-glow-warn" : ""}`}>
                {p.value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Spec 위반 경고 */}
      {violations.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/30 rounded px-3 py-2 text-xs">
          <span className="text-warn">⚠ SPEC VIOLATION:</span>{" "}
          <span className="text-destructive-foreground">{violations.join(", ")}</span>
        </div>
      )}
    </div>
  );
};

export default DieDetailPanel;
