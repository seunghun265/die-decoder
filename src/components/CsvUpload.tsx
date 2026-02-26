import React, { useRef } from "react";
import { Upload } from "lucide-react";

interface CsvUploadProps {
  onUpload: (text: string) => void;
}

/**
 * CSV 파일 업로드 컴포넌트
 * 드래그 앤 드롭 및 클릭 업로드 지원
 */
const CsvUpload: React.FC<CsvUploadProps> = ({ onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) onUpload(text);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className="border border-dashed border-border rounded px-3 py-3 text-center cursor-pointer
        hover:border-primary/50 hover:bg-primary/5 transition-colors"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <Upload className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
      <div className="text-[10px] text-muted-foreground">
        CSV 업로드
      </div>
      <div className="text-[9px] text-muted-foreground/50 mt-0.5">
        X, Y, Bin, Vth, Idsat, Leakage, Resistance
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
};

export default CsvUpload;
