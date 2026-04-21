"use client";

import Papa from "papaparse";
import { useRef, useState, useTransition } from "react";

import { importEntrepreneursAction } from "@/app/actions";
import {
  defaultImportRows,
  entrepreneurCsvTemplateHeaders,
} from "@/lib/constants";
import type { ActionState, ImportRow } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ImportDialogProps = {
  title: string;
  description: string;
  downloadTemplateLabel: string;
  sampleLabel: string;
};

function parseWorkbookRows(file: File): Promise<ImportRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read file."));
    reader.onload = async () => {
      try {
        const ExcelJS = await import("exceljs");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(reader.result as ArrayBuffer);
        const sheet = workbook.worksheets[0];
        const rows: ImportRow[] = [];
        const headers: string[] = [];

        sheet.eachRow((row, rowNumber) => {
          const values = row.values as Array<string | number | null>;
          const normalized = values
            .slice(1)
            .map((value) => `${value ?? ""}`.trim());

          if (rowNumber === 1) {
            headers.push(...normalized);
            return;
          }

          if (!normalized.some(Boolean)) {
            return;
          }

          const mapped = headers.reduce<Record<string, string>>(
            (accumulator, header, index) => {
              accumulator[header] = normalized[index] ?? "";
              return accumulator;
            },
            {},
          );

          rows.push(mapped);
        });

        resolve(rows);
      } catch (error) {
        reject(
          error instanceof Error
            ? error
            : new Error("Failed to parse workbook."),
        );
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

export function ImportDialog({
  title,
  description,
  downloadTemplateLabel,
  sampleLabel,
}: ImportDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<ActionState>({ status: "idle" });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    setResult({ status: "idle" });

    try {
      const extension = file.name.split(".").pop()?.toLowerCase();
      let rows: ImportRow[] = [];

      if (extension === "csv") {
        rows = await new Promise<ImportRow[]>((resolve, reject) => {
          Papa.parse<ImportRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (parsed) => resolve(parsed.data),
            error: (error) => reject(error),
          });
        });
      } else if (extension === "xlsx") {
        rows = await parseWorkbookRows(file);
      } else {
        setResult({
          status: "error",
          message: "Unsupported file type. Use CSV or XLSX.",
        });
        return;
      }

      startTransition(async () => {
        const actionResult = await importEntrepreneursAction(rows);
        setResult(actionResult);
      });
    } catch (error) {
      setResult({
        status: "error",
        message: error instanceof Error ? error.message : "Import failed.",
      });
    } finally {
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="card-description">{description}</p>
      </CardHeader>
      <CardContent className="stack">
        <div className="upload-panel">
          <input
            ref={inputRef}
            type="file"
            accept=".csv,.xlsx"
            className="file-input"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void handleFile(file);
              }
            }}
          />
        </div>

        <div className="stack stack-tight">
          <p className="section-kicker">Expected columns</p>
          <div className="chip-list">
            {entrepreneurCsvTemplateHeaders.map((header) => (
              <span key={header} className="chip">
                {header}
              </span>
            ))}
          </div>
        </div>

        <div className="callout callout-muted">
          <strong>{sampleLabel}</strong>
          <p>{defaultImportRows[0]?.["Support Services"]}</p>
        </div>

        {result.message ? (
          <div
            className={
              result.status === "error" ? "alert alert-error" : "alert alert-success"
            }
          >
            {result.message}
            {result.issues?.length ? (
              <ul className="issues-list">
                {result.issues.map((issue) => (
                  <li key={`${issue.row}-${issue.reason}`}>
                    Row {issue.row}: {issue.reason}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <Button
          type="button"
          variant="ghost"
          disabled={isPending}
          onClick={() => {
            const csvRows = [
              entrepreneurCsvTemplateHeaders.join(","),
              ...defaultImportRows.map((row) =>
                entrepreneurCsvTemplateHeaders
                  .map(
                    (header) =>
                      `"${String(row[header as keyof typeof row] ?? "").replaceAll("\"", "\"\"")}"`,
                  )
                  .join(","),
              ),
            ];

            const blob = new Blob([csvRows.join("\n")], {
              type: "text/csv;charset=utf-8",
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "entrepreneurs-template.csv";
            link.click();
            URL.revokeObjectURL(url);
          }}
        >
          {downloadTemplateLabel}
        </Button>
      </CardContent>
    </Card>
  );
}
