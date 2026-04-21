"use client";

import { useState } from "react";
import { Download } from "lucide-react";

import { exportEntrepreneursAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import type { FilterState } from "@/lib/types";

type ExportButtonProps = {
  filters?: Partial<FilterState>;
  label?: string;
};

function base64ToBlob(base64: string, mimeType: string) {
  const byteCharacters = atob(base64);
  const chunks: BlobPart[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = Array.from(slice).map((character) =>
      character.charCodeAt(0),
    );
    chunks.push(new Uint8Array(byteNumbers));
  }

  return new Blob(chunks, { type: mimeType });
}

export function ExportButton({
  filters,
  label = "Export to Excel",
}: ExportButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Button
      type="button"
      variant="secondary"
      isLoading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        try {
          const formData = new FormData();
          formData.set("search", filters?.search ?? "");
          formData.set("city", filters?.city ?? "");
          formData.set("gender", filters?.gender ?? "");
          formData.set("businessStatus", filters?.businessStatus ?? "");
          formData.set("service", filters?.service ?? "");

          const result = await exportEntrepreneursAction(formData);
          const blob = base64ToBlob(result.content, result.mimeType);
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = result.filename;
          link.click();
          URL.revokeObjectURL(url);
        } finally {
          setIsLoading(false);
        }
      }}
    >
      <Download size={16} />
      {label}
    </Button>
  );
}
