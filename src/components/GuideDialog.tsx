import React, { useState } from "react";
import { HelpCircle, X } from "lucide-react";

const guideItems = [
  {
    title: "🖱️ 웨이퍼 탐색",
    steps: [
      "마우스 휠로 확대/축소 (Zoom)",
      "드래그하여 이동 (Pan)",
      "Die를 클릭하면 오른쪽 패널에 상세 정보 표시",
    ],
  },
  {
    title: "📁 CSV 데이터 업로드",
    steps: [
      "오른쪽 패널 하단의 'CSV 업로드' 클릭 또는 드래그 앤 드롭",
      "CSV 컬럼 형식: X, Y, Bin, Vth, Idsat, Leakage, Resistance",
      "헤더 행은 자동으로 무시됩니다",
    ],
  },
  {
    title: "📊 Yield & Fail Density",
    steps: [
      "상단 바에서 Yield %, Pass/Fail 수 실시간 확인",
      "Center Fail %: 웨이퍼 중심부(70% 반경 이내) 불량률",
      "Edge Fail %: 웨이퍼 가장자리 불량률",
    ],
  },
  {
    title: "⚙️ Spec Limit 설정",
    steps: [
      "오른쪽 패널에서 각 파라미터의 Min/Max 값 입력",
      "Spec 초과 Die는 노란색 테두리로 강조 표시",
      "Die 상세 패널에서 어떤 파라미터가 위반인지 확인 가능",
    ],
  },
  {
    title: "🎨 Bin 색상 매핑",
    steps: [
      "Bin 1 = Pass (초록), Bin 2+ = Fail",
      "Bin 번호별로 고유 색상이 자동 할당됩니다",
      "오른쪽 패널의 Bin Legend에서 색상 확인",
    ],
  },
];

const GuideDialog: React.FC = () => {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-3 py-1 text-[10px] border border-border rounded
          text-muted-foreground hover:text-foreground hover:border-primary/50
          transition-colors uppercase tracking-wider flex items-center gap-1"
      >
        <HelpCircle className="w-3 h-3" />
        Guide
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setOpen(false)} />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-card border border-border rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border sticky top-0 bg-card">
            <h2 className="text-sm font-semibold text-foreground text-glow tracking-wider">
              📖 WAFER MAP ANALYZER GUIDE
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-5">
            {guideItems.map((item) => (
              <div key={item.title}>
                <h3 className="text-xs font-semibold text-foreground mb-2">{item.title}</h3>
                <ul className="space-y-1">
                  {item.steps.map((step, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex gap-2">
                      <span className="text-primary/60 shrink-0">▸</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* CSV 예시 */}
            <div>
              <h3 className="text-xs font-semibold text-foreground mb-2">📝 CSV 예시</h3>
              <pre className="text-[10px] text-muted-foreground bg-muted rounded px-3 py-2 overflow-x-auto">
{`X,Y,Bin,Vth,Idsat,Leakage,Resistance
5,5,1,0.45,250,2.1e-9,120
5,6,2,0.72,180,1.5e-8,195
6,5,1,0.48,265,3.0e-9,115`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GuideDialog;
