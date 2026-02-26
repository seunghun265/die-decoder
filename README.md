# 🌐 Wafer Map Analyzer (ATE Data Visualizer)

반도체 ATE(Automated Test Equipment) 테스트 데이터를 시각화하고 분석하기 위한 고성능 웹 기반 **Wafer Map Analyzer**입니다. 각 Die의 전기적 측정값을 기반으로 수율(Yield)을 계산하고 공정 이상 패턴을 식별하는 데 최적화되어 있습니다.

---

## 🚀 Key Features

### 1. Wafer Map Visualization
- **Canvas-based Rendering**: 대량의 Die 데이터를 빠르고 매끄럽게 렌더링합니다.
- **Interactive Navigation**: 마우스 휠을 통한 확대/축소(Zoom) 및 드래그를 통한 이동(Pan) 기능을 지원합니다.
- **Bin-based Coloring**: Bin 번호에 따른 자동 색상 매핑으로 Pass/Fail 상태를 한눈에 파악할 수 있습니다.

### 2. Data Analysis & Stats
- **Yield Calculation**: 실시간으로 수율(%) 및 Pass/Fail 수량을 산출합니다.
- **Fail Density Analysis**: 웨이퍼 중심부(Center)와 가장자리(Edge)의 불량률을 구분하여 분석함으로써 공정 패턴을 파악합니다.
- **Spec Limit Monitoring**: 사용자 정의 Spec(Min/Max)을 기준으로 위반된 Die를 실시간으로 강조 표시합니다.

### 3. Professional Workflow
- **CSV Data Import**: 표준화된 CSV 파일을 통해 실데이터를 간편하게 로드합니다.
- **Die Details**: 특정 Die 클릭 시 상세 전기적 특성(Vth, Idsat, Leakage, Resistance)과 Spec 위반 항목을 즉시 확인합니다.
- **Demo Data Generation**: 실제 데이터가 없어도 테스트 가능한 알고리즘 기반 데모 데이터 생성 기능을 포함합니다.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (Cyberpunk/Dark Theme)
- **Visualization**: HTML5 Canvas API
- **Icons**: Lucide React
- **UI Components**: shadcn/ui

---

## 📂 Project Structure

```text
src/
├── components/          # UI 및 기능별 컴포넌트 (WaferCanvas, StatsBar 등)
├── lib/                 # 통계 계산 및 CSV 파싱 로직 (statistics.ts)
├── pages/               # 메인 레이아웃 및 페이지 구성
└── hooks/               # 재사용 가능한 커스텀 훅
```

---

## 📊 CSV Data Format

가져올 CSV 파일은 다음과 같은 헤더와 형식을 권장합니다:
`X, Y, Bin, Vth, Idsat, Leakage, Resistance`

```csv
X,Y,Bin,Vth,Idsat,Leakage,Resistance
5,5,1,0.45,250,2.1e-9,120
5,6,2,0.72,180,1.5e-8,195
...
```

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)

### Installation
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

---

## 📖 Analyzer Guide
ATE 테스트 결과는 각 Die별 전기적 측정값으로 구성되며, Spec 비교 결과에 따라 Pass/Fail 또는 Bin 번호로 분류됩니다. 본 UI는 각 Die를 X-Y 좌표로 매핑하여 시각화하고, Yield 및 패턴 분석을 통해 공정 안정성을 평가할 수 있도록 설계되었습니다.
