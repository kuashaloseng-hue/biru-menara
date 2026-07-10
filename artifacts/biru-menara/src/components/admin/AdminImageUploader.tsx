import { useRef } from "react";
import { useUpload } from "@workspace/object-storage-web";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface AdminImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
}

export function AdminImageUploader({ value, onChange, label = "รูปภาพ", required }: AdminImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading, progress } = useUpload({
    onSuccess: (res: { objectPath: string }) => {
      onChange(`/api/storage${res.objectPath}`);
      toast.success("อัปโหลดรูปสำเร็จ");
    },
    onError: (err: Error) => {
      toast.error(`อัปโหลดไม่สำเร็จ: ${err.message}`);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  return (
    <div className="grid gap-2">
      <Label>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Preview */}
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-white/10 h-40 bg-black/40 group">
          <img
            src={value}
            alt="preview"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/60"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-white/20 h-40 bg-black/20 flex flex-col items-center justify-center gap-2 text-gray-500">
          <ImageIcon className="w-8 h-8" />
          <span className="text-sm">ยังไม่มีรูปภาพ</span>
        </div>
      )}

      {/* Upload + URL row */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="shrink-0 border-white/10 hover:border-primary/50 gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? `${progress}%…` : "อัปโหลดรูป"}
        </Button>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="หรือวางลิงก์ URL รูปภาพ"
          className="bg-black/30 border-white/10 text-sm"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
