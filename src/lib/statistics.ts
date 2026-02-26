/**
 * 통계 계산 모듈
 * Wafer Map 데이터에 대한 통계 분석 함수들을 제공합니다.
 */

export interface DieData {
  x: number;
  y: number;
  bin: number;
  vth: number;
  idsat: number;
  leakage: number;
  resistance: number;
}

export interface SpecLimits {
  vth: { min: number; max: number };
  idsat: { min: number; max: number };
  leakage: { min: number; max: number };
  resistance: { min: number; max: number };
}

export interface YieldStats {
  total: number;
  pass: number;
  fail: number;
  yieldPercent: number;
}

export interface FailDensity {
  centerFailPercent: number;
  edgeFailPercent: number;
  centerTotal: number;
  edgeTotal: number;
  centerFail: number;
  edgeFail: number;
}

/** Yield 계산: Bin 1 = Pass, 나머지 = Fail */
export function calculateYield(dies: DieData[]): YieldStats {
  const total = dies.length;
  const pass = dies.filter((d) => d.bin === 1).length;
  const fail = total - pass;
  return {
    total,
    pass,
    fail,
    yieldPercent: total > 0 ? (pass / total) * 100 : 0,
  };
}

/** Fail Density: 웨이퍼 중심/가장자리 기준 분석 */
export function calculateFailDensity(
  dies: DieData[],
  waferRadius: number,
  edgeThresholdRatio = 0.7
): FailDensity {
  // 웨이퍼 중심 좌표 계산
  const xs = dies.map((d) => d.x);
  const ys = dies.map((d) => d.y);
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cy = (Math.min(...ys) + Math.max(...ys)) / 2;

  const threshold = waferRadius * edgeThresholdRatio;

  let centerTotal = 0, centerFail = 0;
  let edgeTotal = 0, edgeFail = 0;

  for (const die of dies) {
    const dist = Math.sqrt((die.x - cx) ** 2 + (die.y - cy) ** 2);
    if (dist <= threshold) {
      centerTotal++;
      if (die.bin !== 1) centerFail++;
    } else {
      edgeTotal++;
      if (die.bin !== 1) edgeFail++;
    }
  }

  return {
    centerFailPercent: centerTotal > 0 ? (centerFail / centerTotal) * 100 : 0,
    edgeFailPercent: edgeTotal > 0 ? (edgeFail / edgeTotal) * 100 : 0,
    centerTotal,
    edgeTotal,
    centerFail,
    edgeFail,
  };
}

/** Die가 Spec Limit을 초과하는지 체크 */
export function isOutOfSpec(die: DieData, specs: SpecLimits): boolean {
  return (
    die.vth < specs.vth.min || die.vth > specs.vth.max ||
    die.idsat < specs.idsat.min || die.idsat > specs.idsat.max ||
    die.leakage < specs.leakage.min || die.leakage > specs.leakage.max ||
    die.resistance < specs.resistance.min || die.resistance > specs.resistance.max
  );
}

/** 어떤 파라미터가 spec 초과인지 상세 반환 */
export function getSpecViolations(die: DieData, specs: SpecLimits): string[] {
  const violations: string[] = [];
  if (die.vth < specs.vth.min || die.vth > specs.vth.max) violations.push("Vth");
  if (die.idsat < specs.idsat.min || die.idsat > specs.idsat.max) violations.push("Idsat");
  if (die.leakage < specs.leakage.min || die.leakage > specs.leakage.max) violations.push("Leakage");
  if (die.resistance < specs.resistance.min || die.resistance > specs.resistance.max) violations.push("Resistance");
  return violations;
}

/** Bin별 색상 매핑 */
export function getBinColor(bin: number): string {
  const binColors: Record<number, string> = {
    1: "#22c55e",  // Pass - green
    2: "#ef4444",  // Fail - red
    3: "#f59e0b",  // Warn - amber
    4: "#3b82f6",  // Info - blue
    5: "#a855f7",  // purple
    6: "#ec4899",  // pink
    7: "#14b8a6",  // teal
    8: "#f97316",  // orange
    9: "#6366f1",  // indigo
  };
  return binColors[bin] || "#6b7280"; // default gray
}

/** CSV 파싱: X, Y, Bin, Vth, Idsat, Leakage, Resistance */
export function parseCSV(text: string): DieData[] {
  const lines = text.trim().split("\n");
  const dies: DieData[] = [];

  // 헤더 스킵 (첫 행이 숫자가 아닌 경우)
  const startIdx = isNaN(Number(lines[0]?.split(",")[0]?.trim())) ? 1 : 0;

  for (let i = startIdx; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim());
    if (cols.length >= 7) {
      dies.push({
        x: Number(cols[0]),
        y: Number(cols[1]),
        bin: Number(cols[2]),
        vth: Number(cols[3]),
        idsat: Number(cols[4]),
        leakage: Number(cols[5]),
        resistance: Number(cols[6]),
      });
    }
  }
  return dies;
}

/** 데모 데이터 생성 */
export function generateDemoData(gridSize = 21): DieData[] {
  const dies: DieData[] = [];
  const center = Math.floor(gridSize / 2);
  const radius = center;

  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // 원형 웨이퍼 내부만
      if (dist <= radius) {
        // 가장자리에서 fail 확률 높게
        const edgeFactor = dist / radius;
        const failProb = 0.05 + edgeFactor * 0.25;
        const isFail = Math.random() < failProb;
        const bin = isFail ? (Math.random() < 0.6 ? 2 : Math.floor(Math.random() * 7) + 3) : 1;

        dies.push({
          x,
          y,
          bin,
          vth: 0.4 + Math.random() * 0.3 + (isFail ? 0.2 : 0),
          idsat: 200 + Math.random() * 100 - (isFail ? 80 : 0),
          leakage: 1e-9 + Math.random() * 5e-9 + (isFail ? 1e-8 : 0),
          resistance: 100 + Math.random() * 50 + (isFail ? 80 : 0),
        });
      }
    }
  }
  return dies;
}
