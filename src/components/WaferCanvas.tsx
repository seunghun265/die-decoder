import React, { useRef, useEffect, useCallback, useState } from "react";
import { DieData, getBinColor, isOutOfSpec, SpecLimits } from "@/lib/statistics";

interface WaferCanvasProps {
  dies: DieData[];
  specLimits: SpecLimits;
  selectedDie: DieData | null;
  onSelectDie: (die: DieData | null) => void;
}

/**
 * Canvas 기반 Wafer Map 시각화 컴포넌트
 * - 원형 웨이퍼 렌더링
 * - 마우스 휠 줌, 드래그 팬
 * - Die 클릭 선택
 * - Spec 초과 Die 강조
 */
const WaferCanvas: React.FC<WaferCanvasProps> = ({ dies, specLimits, selectedDie, onSelectDie }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 뷰 상태: 줌, 팬 오프셋
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  // 그리드 범위 계산
  const gridBounds = React.useMemo(() => {
    if (dies.length === 0) return { minX: 0, maxX: 20, minY: 0, maxY: 20 };
    const xs = dies.map((d) => d.x);
    const ys = dies.map((d) => d.y);
    return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
  }, [dies]);

  /** 캔버스에 웨이퍼 맵 그리기 */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // 배경
    ctx.fillStyle = "#0d1117";
    ctx.fillRect(0, 0, w, h);

    // 그리드 크기 계산
    const gridW = gridBounds.maxX - gridBounds.minX + 1;
    const gridH = gridBounds.maxY - gridBounds.minY + 1;
    const gridMax = Math.max(gridW, gridH);
    const padding = 40;
    const availSize = Math.min(w, h) - padding * 2;
    const cellSize = (availSize / gridMax) * zoom;
    const waferRadius = (gridMax / 2) * cellSize;

    // 센터 좌표
    const cx = w / 2 + offset.x;
    const cy = h / 2 + offset.y;

    // 웨이퍼 외곽 원
    ctx.beginPath();
    ctx.arc(cx, cy, waferRadius + cellSize * 0.6, 0, Math.PI * 2);
    ctx.strokeStyle = "hsl(140, 70%, 45%)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 웨이퍼 배경 (약간 밝게)
    ctx.beginPath();
    ctx.arc(cx, cy, waferRadius + cellSize * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(34, 197, 94, 0.03)";
    ctx.fill();

    // Die 그리기
    const centerX = (gridBounds.minX + gridBounds.maxX) / 2;
    const centerY = (gridBounds.minY + gridBounds.maxY) / 2;

    for (const die of dies) {
      const dx = (die.x - centerX) * cellSize;
      const dy = (die.y - centerY) * cellSize;
      const px = cx + dx - cellSize / 2;
      const py = cy + dy - cellSize / 2;
      const dieSize = cellSize * 0.9;

      // Die 색상 (Bin 기반)
      ctx.fillStyle = getBinColor(die.bin);
      ctx.globalAlpha = 0.85;
      ctx.fillRect(px + (cellSize - dieSize) / 2, py + (cellSize - dieSize) / 2, dieSize, dieSize);
      ctx.globalAlpha = 1;

      // Spec 초과 시 테두리 강조
      if (isOutOfSpec(die, specLimits)) {
        ctx.strokeStyle = "#fbbf24";
        ctx.lineWidth = 2;
        ctx.strokeRect(px + (cellSize - dieSize) / 2, py + (cellSize - dieSize) / 2, dieSize, dieSize);
      }

      // 선택된 Die 강조
      if (selectedDie && die.x === selectedDie.x && die.y === selectedDie.y) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.strokeRect(px + (cellSize - dieSize) / 2 - 1, py + (cellSize - dieSize) / 2 - 1, dieSize + 2, dieSize + 2);
      }
    }

    // 십자선 (센터 마커)
    ctx.strokeStyle = "rgba(34, 197, 94, 0.2)";
    ctx.lineWidth = 0.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx - waferRadius - 10, cy);
    ctx.lineTo(cx + waferRadius + 10, cy);
    ctx.moveTo(cx, cy - waferRadius - 10);
    ctx.lineTo(cx, cy + waferRadius + 10);
    ctx.stroke();
    ctx.setLineDash([]);

    // Notch (하단)
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + waferRadius + cellSize * 0.6);
    ctx.lineTo(cx, cy + waferRadius + cellSize * 0.3);
    ctx.lineTo(cx + 8, cy + waferRadius + cellSize * 0.6);
    ctx.strokeStyle = "hsl(140, 70%, 45%)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [dies, zoom, offset, gridBounds, selectedDie, specLimits]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleResize = () => draw();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [draw]);

  /** 마우스 휠 줌 */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => Math.max(0.3, Math.min(5, z - e.deltaY * 0.001)));
  }, []);

  /** 드래그 시작 */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...offset };
  }, [offset]);

  /** 드래그 이동 */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: offsetStart.current.x + (e.clientX - dragStart.current.x),
      y: offsetStart.current.y + (e.clientY - dragStart.current.y),
    });
  }, [isDragging]);

  /** 드래그 종료 */
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  /** Die 클릭 감지 */
  const handleClick = useCallback((e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const w = rect.width;
    const h = rect.height;

    const gridW = gridBounds.maxX - gridBounds.minX + 1;
    const gridH = gridBounds.maxY - gridBounds.minY + 1;
    const gridMax = Math.max(gridW, gridH);
    const padding = 40;
    const availSize = Math.min(w, h) - padding * 2;
    const cellSize = (availSize / gridMax) * zoom;

    const cx = w / 2 + offset.x;
    const cy = h / 2 + offset.y;
    const centerX = (gridBounds.minX + gridBounds.maxX) / 2;
    const centerY = (gridBounds.minY + gridBounds.maxY) / 2;

    // 클릭 좌표에서 가장 가까운 Die 찾기
    let closest: DieData | null = null;
    let minDist = Infinity;

    for (const die of dies) {
      const dx = cx + (die.x - centerX) * cellSize;
      const dy = cy + (die.y - centerY) * cellSize;
      const dist = Math.sqrt((mx - dx) ** 2 + (my - dy) ** 2);
      if (dist < cellSize / 2 && dist < minDist) {
        minDist = dist;
        closest = die;
      }
    }

    onSelectDie(closest);
  }, [dies, zoom, offset, gridBounds, onSelectDie]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />
      {/* 줌 표시 */}
      <div className="absolute bottom-3 left-3 text-xs text-muted-foreground font-mono">
        ZOOM: {zoom.toFixed(1)}x
      </div>
    </div>
  );
};

export default WaferCanvas;
