import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isPro } from "@/lib/tiers";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// GET /api/projects/[id]/intent-responses/export - Export Why-Not-Buy responses (Pro only)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        const { id } = await params;
        const url = new URL(request.url);
        const format = url.searchParams.get("format") || "csv";

        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userIsPro = await isPro(session.user.id);
        if (!userIsPro) {
            return NextResponse.json(
                { error: "Export is a Pro feature.", code: "PRO_FEATURE_REQUIRED" },
                { status: 403 }
            );
        }

        const project = await prisma.project.findFirst({
            where: { id, userId: session.user.id },
        });
        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        // Cap the export so it can't load an unbounded result set (newest first),
        // but count the true total so we can flag when the export is truncated.
        const MAX_EXPORT_ROWS = 10000;
        const [responses, totalResponseCount] = await Promise.all([
            prisma.intentResponse.findMany({
                where: { projectId: id },
                orderBy: { createdAt: "desc" },
                take: MAX_EXPORT_ROWS,
            }),
            prisma.intentResponse.count({ where: { projectId: id } }),
        ]);
        const truncated = totalResponseCount > responses.length;

        const planOf = (ctx: unknown) => {
            if (ctx && typeof ctx === "object" && "plan" in ctx) {
                const p = (ctx as Record<string, unknown>).plan;
                return typeof p === "string" ? p : "";
            }
            return "";
        };

        const dateStr = new Date().toISOString().split("T")[0];
        // Sanitize the user-controlled project name for use in Content-Disposition:
        // strip quotes, CR/LF, and other unsafe filename chars.
        const safeName =
            (project.name || "project")
                .replace(/[\r\n"]/g, "")
                .replace(/[^\w.\- ]+/g, "_")
                .trim()
                .slice(0, 80) || "project";

        // CSV cell escaper: quote CSV-special values and neutralize spreadsheet
        // formula injection (leading =, +, -, @) by prefixing with a single quote.
        const csvCell = (value: unknown): string => {
            let s = value == null ? "" : String(value);
            // Neutralize spreadsheet formula injection, including tab/CR-prefixed payloads
            if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
            if (/[",\r\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
            return s;
        };

        if (format === "pdf") {
            // PDFs render far fewer rows than CSV can hold; cap lower to keep them light.
            const MAX_PDF_ROWS = 2000;
            const pdfRows = responses.slice(0, MAX_PDF_ROWS);
            const pdfTruncated = totalResponseCount > pdfRows.length;
            const doc = new jsPDF();
            doc.setFontSize(20);
            doc.setTextColor(23, 23, 23);
            doc.text(project.name, 14, 22);
            doc.setFontSize(10);
            doc.setTextColor(115, 115, 115);
            doc.text(`Why-Not-Buy Report - Generated on ${new Date().toLocaleDateString()}`, 14, 30);
            doc.setFontSize(12);
            doc.setTextColor(23, 23, 23);
            doc.text(
                pdfTruncated
                    ? `Total responses: ${totalResponseCount} (showing latest ${pdfRows.length})`
                    : `Total responses: ${totalResponseCount}`,
                14,
                42
            );

            const tableData = pdfRows.map((r) => [
                r.optionLabel || "-",
                r.text || "-",
                planOf(r.context),
                r.country || "-",
                new Date(r.createdAt).toLocaleDateString(),
            ]);

            autoTable(doc, {
                startY: 50,
                head: [["Reason", "Detail", "Plan", "Country", "Date"]],
                body: tableData,
                headStyles: { fillColor: [23, 23, 23], textColor: [255, 255, 255], fontSize: 9, fontStyle: "bold" },
                bodyStyles: { fontSize: 8, textColor: [51, 51, 51] },
                alternateRowStyles: { fillColor: [250, 250, 250] },
                columnStyles: {
                    0: { cellWidth: 35 },
                    1: { cellWidth: 75, overflow: "linebreak" },
                    2: { cellWidth: 20 },
                    3: { cellWidth: 20 },
                    4: { cellWidth: 25 },
                },
                margin: { top: 50 },
            });

            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(163, 163, 163);
                doc.text(
                    `Generated by Feedinbox • Page ${i} of ${pageCount}`,
                    doc.internal.pageSize.getWidth() / 2,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: "center" }
                );
            }

            const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
            return new NextResponse(pdfBuffer, {
                status: 200,
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="${safeName}-why-not-buy-${dateStr}.pdf"`,
                    "X-Total-Responses": String(totalResponseCount),
                    "X-Exported-Responses": String(pdfRows.length),
                    "X-Truncated": String(pdfTruncated),
                },
            });
        }

        // CSV: every field goes through csvCell for consistent escaping + injection safety
        const headers = ["ID", "Reason", "Detail", "Plan", "Country", "Page URL", "Created At"];
        const rows = responses.map((r) => [
            r.id,
            r.optionLabel || "",
            r.text || "",
            planOf(r.context),
            r.country || "",
            r.pageUrl || "",
            r.createdAt.toISOString(),
        ]);
        // Prepend a UTF-8 BOM so Excel opens non-ASCII characters correctly.
        const csv = "﻿" + [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="${safeName}-why-not-buy-${dateStr}.csv"`,
                "X-Total-Responses": String(totalResponseCount),
                "X-Exported-Responses": String(responses.length),
                "X-Truncated": String(truncated),
            },
        });
    } catch (error) {
        console.error("Error exporting intent responses:", error);
        return NextResponse.json({ error: "Failed to export responses" }, { status: 500 });
    }
}
