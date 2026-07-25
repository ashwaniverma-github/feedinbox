"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ExportDropdownProps {
    projectId: string;
    isPro: boolean;
    onUpgradeClick: () => void;
    /** API endpoint to hit; defaults to the feedback export. */
    endpoint?: string;
    /** Fallback filename prefix when the response has no Content-Disposition. */
    filenamePrefix?: string;
}

export function ExportDropdown({ projectId, isPro, onUpgradeClick, endpoint, filenamePrefix = "feedback-export" }: ExportDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState<"csv" | "pdf" | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleExport = async (format: "csv" | "pdf") => {
        if (!isPro) {
            setIsOpen(false);
            onUpgradeClick();
            return;
        }

        setLoading(format);
        try {
            const base = endpoint || `/api/projects/${projectId}/export`;
            const response = await fetch(`${base}?format=${format}`);

            if (!response.ok) {
                const error = await response.json();
                if (error.code === "PRO_FEATURE_REQUIRED") {
                    onUpgradeClick();
                    return;
                }
                throw new Error(error.error || "Export failed");
            }

            // Get filename from Content-Disposition header
            const contentDisposition = response.headers.get("Content-Disposition");
            const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || `${filenamePrefix}.${format}`;

            // Download the file
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Export error:", error);
            alert("Failed to export. Please try again.");
        } finally {
            setLoading(null);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="gap-2"
            >
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
            </Button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg z-50 overflow-hidden">
                    <div className="py-1">
                        <button
                            onClick={() => handleExport("csv")}
                            disabled={loading !== null}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                            <span className="flex-1 text-left">Export as CSV</span>
                            {loading === "csv" && (
                                <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent rounded-full animate-spin" />
                            )}
                            {!isPro && <img src="/feedinbox.png" alt="Pro" className="h-3 w-3 rounded-full" />}
                        </button>
                        <button
                            onClick={() => handleExport("pdf")}
                            disabled={loading !== null}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            <FileText className="h-4 w-4 text-red-600" />
                            <span className="flex-1 text-left">Export as PDF</span>
                            {loading === "pdf" && (
                                <div className="h-3 w-3 rounded-full border-2 border-current border-t-transparent rounded-full animate-spin" />
                            )}
                            {!isPro && <img src="/feedinbox.png" alt="Pro" className="h-3 w-3 rounded-full" />}
                        </button>
                    </div>
                    {!isPro && (
                        <div className="border-t border-border px-4 py-2 bg-muted/50">
                            <p className="text-xs text-muted-foreground">
                                <img src="/feedinbox.png" alt="Pro" className="h-3 w-3 rounded-full inline mr-1" />
                                Export is a Pro feature
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
