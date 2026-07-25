"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronDown, Check, FolderKanban, Plus } from "lucide-react";

interface Project {
    id: string;
    name: string;
}

interface ProjectSelectorProps {
    projects: Project[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export function ProjectSelector({ projects, selectedId, onSelect }: ProjectSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const newProjectRef = useRef<HTMLAnchorElement>(null);

    // Safety check for projects array
    const safeProjects = Array.isArray(projects) ? projects : [];
    const selectedProject = safeProjects.find(p => p.id === selectedId);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // When the "New project" link is focused, let the browser handle
            // Enter/Space/Tab natively so it stays keyboard-activatable.
            if (newProjectRef.current && document.activeElement === newProjectRef.current) {
                if (e.key === "Escape") setIsOpen(false);
                return;
            }
            switch (e.key) {
                case "ArrowDown":
                    e.preventDefault();
                    setHighlightedIndex(i => (i + 1) % safeProjects.length);
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setHighlightedIndex(i => (i - 1 + safeProjects.length) % safeProjects.length);
                    break;
                case "Enter":
                    e.preventDefault();
                    if (safeProjects[highlightedIndex]) {
                        onSelect(safeProjects[highlightedIndex].id);
                    }
                    setIsOpen(false);
                    break;
                case "Escape":
                    setIsOpen(false);
                    break;
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, highlightedIndex, safeProjects, onSelect]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (isOpen && listRef.current) {
            const highlighted = listRef.current.children[highlightedIndex] as HTMLElement;
            if (highlighted) {
                highlighted.scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightedIndex, isOpen]);

    // Reset highlighted index when opening
    useEffect(() => {
        if (isOpen) {
            const index = safeProjects.findIndex(p => p.id === selectedId);
            setHighlightedIndex(index >= 0 ? index : 0);
        }
    }, [isOpen, safeProjects, selectedId]);

    return (
        <div ref={containerRef} className="relative">
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-2 h-10 p-1 rounded-xl border transition-all duration-200",
                    "bg-card hover:bg-accent",
                    isOpen
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/50"
                )}
            >
                {/* Icon */}
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10">
                    <FolderKanban className="h-3.5 w-3.5 text-primary" />
                </div>

                {/* Project Name */}
                <div className="flex flex-col items-start min-w-[120px]">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                        Project
                    </span>
                    <span className="text-sm font-semibold text-foreground -mt-0.5 truncate max-w-[140px]">
                        {selectedProject?.name || "Select project"}
                    </span>
                </div>

                {/* Chevron */}
                <ChevronDown
                    className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform duration-200",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-2 z-50 min-w-[240px] animate-in fade-in slide-in-from-top-2 duration-200"
                >
                    <div className="rounded-xl border border-border bg-popover shadow-xl shadow-black/10 overflow-hidden">
                        {/* Header */}
                        <div className="px-3 py-2 border-b border-border bg-muted/50">
                            <p className="text-xs font-medium text-muted-foreground">
                                Switch Project
                            </p>
                        </div>

                        {/* Project List */}
                        <ul
                            ref={listRef}
                            className="max-h-[280px] overflow-auto py-1 scrollbar-hide"
                        >
                            {safeProjects.map((project, index) => {
                                const isSelected = project.id === selectedId;
                                const isHighlighted = index === highlightedIndex;

                                return (
                                    <li key={project.id}>
                                        <button
                                            onClick={() => {
                                                onSelect(project.id);
                                                setIsOpen(false);
                                            }}
                                            onMouseEnter={() => setHighlightedIndex(index)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                                                isHighlighted && "bg-accent",
                                                isSelected && "bg-primary/5"
                                            )}
                                        >
                                            {/* Project Icon */}
                                            <div className={cn(
                                                "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                                                isSelected
                                                    ? "bg-primary text-primary-foreground"
                                                    : "bg-muted text-muted-foreground"
                                            )}>
                                                <FolderKanban className="h-4 w-4" />
                                            </div>

                                            {/* Project Name */}
                                            <span className={cn(
                                                "flex-1 text-sm font-medium truncate",
                                                isSelected ? "text-primary" : "text-foreground"
                                            )}>
                                                {project.name}
                                            </span>

                                            {/* Checkmark */}
                                            {isSelected && (
                                                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                                                    <Check className="h-3 w-3 text-primary-foreground" />
                                                </div>
                                            )}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* New project */}
                        <Link
                            ref={newProjectRef}
                            href="/projects/new"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 border-t border-border hover:bg-accent transition-colors"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground">
                                <Plus className="h-4 w-4" />
                            </div>
                            <span className="text-sm font-medium text-foreground">New project</span>
                        </Link>

                        {/* Footer hint */}
                        <div className="px-3 py-2 border-t border-border bg-muted/30">
                            <p className="text-[10px] text-muted-foreground flex items-center gap-2">
                                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">↑↓</kbd>
                                navigate
                                <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">↵</kbd>
                                select
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
