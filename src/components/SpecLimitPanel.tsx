import React from "react";
import { SpecLimits } from "@/lib/statistics";

interface SpecLimitPanelProps {
  specLimits: SpecLimits;
  onSpecChange: (specs: SpecLimits) => void;
}

/**
 * Spec Limit 입력 패널
 * 각 파라미터의 Min/Max 값을 설정
 */
const SpecLimitPanel: React.FC<SpecLimitPanelProps> = ({ specLimits, onSpecChange }) => {
  const handleChange = (param: keyof SpecLimits, bound: "min" | "max", value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    onSpecChange({
      ...specLimits,
      [param]: { ...specLimits[param], [bound]: num },
    });
  };

  const params: { key: keyof SpecLimits; label: string; unit: string }[] = [
    { key: "vth", label: "Vth", unit: "V" },
    { key: "idsat", label: "Idsat", unit: "µA" },
    { key: "leakage", label: "Leakage", unit: "A" },
    { key: "resistance", label: "Resistance", unit: "Ω" },
  ];

  return (
    <div className="space-y-2">
      <div className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
        Spec Limits
      </div>
      {params.map(({ key, label, unit }) => (
        <div key={key} className="grid grid-cols-[70px_1fr_1fr] gap-1.5 items-center text-xs">
          <span className="text-muted-foreground">{label} ({unit})</span>
          <input
            type="number"
            step="any"
            value={specLimits[key].min}
            onChange={(e) => handleChange(key, "min", e.target.value)}
            className="bg-input border border-border rounded px-2 py-1 text-foreground text-xs font-mono w-full focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Min"
          />
          <input
            type="number"
            step="any"
            value={specLimits[key].max}
            onChange={(e) => handleChange(key, "max", e.target.value)}
            className="bg-input border border-border rounded px-2 py-1 text-foreground text-xs font-mono w-full focus:outline-none focus:ring-1 focus:ring-ring"
            placeholder="Max"
          />
        </div>
      ))}
    </div>
  );
};

export default SpecLimitPanel;
