import { Link } from "wouter";
import { useState, useMemo, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { marked } from "marked";
import {
  ArrowLeft, BookOpen, Search, ChevronRight, Network, Cpu,
  Shield, GitBranch, Code, Database, Briefcase, Server,
  FileText, ListChecks, BookMarked,
  Plus, Pencil, Trash2, Save, X, Eye, EyeOff, Tag,
  Folder, FolderOpen, FolderPlus, ChevronDown,
  MoreHorizontal, Home, GripVertical
} from "lucide-react";

marked.setOptions({ breaks: true, gfm: true });

// ── Types ─────────────────────────────────────────────────────────────────────
interface WikiArticle {
  id: string;
  title: string;
  category: string;
  type: "article" | "cheatsheet" | "howto";
  tags: string[];
  content: string;
  folder?: string;
}

interface WikiFolder {
  id: string;
  path: string;
  name: string;
  parent: string;
}

// ── Config ────────────────────────────────────────────────────────────────────
const categoryConfig: Record<string, { icon: React.FC<{ className?: string }>; color: string }> = {
  Netzwerk:          { icon: Network,   color: "blue"   },
  Sicherheit:        { icon: Shield,    color: "red"    },
  Projektmanagement: { icon: GitBranch, color: "purple" },
  Datenbanken:       { icon: Database,  color: "orange" },
  Hardware:          { icon: Cpu,       color: "green"  },
  Programmierung:    { icon: Code,      color: "yellow" },
  Wirtschaft:        { icon: Briefcase, color: "teal"   },
  System:            { icon: Server,    color: "indigo" },
};
const ALL_CATEGORIES = ["Netzwerk", "Sicherheit", "Projektmanagement", "Datenbanken", "Hardware", "Programmierung", "Wirtschaft", "System"];

const typeConfig = {
  article:    { label: "Artikel",     icon: FileText,   color: "blue"   },
  cheatsheet: { label: "Cheat Sheet", icon: ListChecks, color: "green"  },
  howto:      { label: "How-To",      icon: BookMarked, color: "purple" },
};

const colorText: Record<string, string> = {
  blue:"text-blue-400", red:"text-red-400", purple:"text-purple-400",
  orange:"text-orange-400", green:"text-green-400", yellow:"text-yellow-400",
  teal:"text-teal-400", indigo:"text-indigo-400",
};
const colorBg: Record<string, string> = {
  blue:"bg-blue-500/15", red:"bg-red-500/15", purple:"bg-purple-500/15",
  orange:"bg-orange-500/15", green:"bg-green-500/15", yellow:"bg-yellow-500/15",
  teal:"bg-teal-500/15", indigo:"bg-indigo-500/15",
};
const colorBorder: Record<string, string> = {
  blue:"border-blue-500/30", red:"border-red-500/30", purple:"border-purple-500/30",
  orange:"border-orange-500/30", green:"border-green-500/30", yellow:"border-yellow-500/30",
  teal:"border-teal-500/30", indigo:"border-indigo-500/30",
};

// ── Markdown ──────────────────────────────────────────────────────────────────
function MarkdownContent({ content }: { content: string }) {
  const html = useMemo(() => marked(content) as string, [content]);
  return <div className="wiki-markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}

// ── Folder Sidebar ────────────────────────────────────────────────────────────
interface FolderSidebarProps {
  folders: WikiFolder[];
  articles: WikiArticle[];
  activeFolder: string | null; // null = all articles
  onSelectFolder: (path: string | null) => void;
  onFoldersChanged: () => void;
  draggingId: string | null;
  onDrop: (articleId: string, folderPath: string | null) => void;
}

function FolderSidebar({ folders, articles, activeFolder, onSelectFolder, onFoldersChanged, draggingId, onDrop }: FolderSidebarProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({ "": true, Schule: true, Arbeit: true });
  const [newFolderParent, setNewFolderParent] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: ({ name, parent }: { name: string; parent: string }) =>
      apiRequest("POST", "/api/wiki/folders", { name, parent }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/wiki/folders"] }); onFoldersChanged(); setNewFolderParent(null); setNewFolderName(""); },
  });

  const renameMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      apiRequest("PUT", `/api/wiki/folders/${id}`, { name }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/wiki/folders"] }); queryClient.invalidateQueries({ queryKey: ["/api/wiki"] }); onFoldersChanged(); setRenamingId(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/wiki/folders/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/wiki/folders"] }); queryClient.invalidateQueries({ queryKey: ["/api/wiki"] }); onFoldersChanged(); onSelectFolder(null); setConfirmDelete(null); },
  });

  function countInFolder(folderPath: string) {
    return articles.filter(a => a.folder === folderPath || a.folder?.startsWith(folderPath + "/")).length;
  }

  function rootFolders() { return folders.filter(f => f.parent === "").sort((a, b) => a.name.localeCompare(b.name)); }
  function childFolders(parentPath: string) { return folders.filter(f => f.parent === parentPath).sort((a, b) => a.name.localeCompare(b.name)); }

  function renderFolder(folder: WikiFolder, depth = 0) {
    const children = childFolders(folder.path);
    const isExpanded = expanded[folder.path] ?? false;
    const isActive = activeFolder === folder.path;
    const count = countInFolder(folder.path);
    const isRenaming = renamingId === folder.id;
    const isMenuOpen = menuOpen === folder.id;
    const isConfirmDelete = confirmDelete === folder.id;

    return (
      <div key={folder.id}>
        <div
          className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors text-xs ${
            dragOver === folder.path
              ? "bg-primary/30 border border-primary/60 text-primary"
              : isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
          style={{ paddingLeft: `${8 + depth * 14}px` }}
          onDragOver={e => { if (draggingId) { e.preventDefault(); setDragOver(folder.path); } }}
          onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null); }}
          onDrop={e => { e.preventDefault(); if (draggingId) { onDrop(draggingId, folder.path); setDragOver(null); } }}
        >
          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(e => ({ ...e, [folder.path]: !isExpanded }))}
            className="flex-shrink-0 p-0.5"
          >
            {children.length > 0
              ? (isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />)
              : <span className="w-3 h-3 block" />
            }
          </button>

          {/* Folder icon + name */}
          <button
            className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
            onClick={() => { onSelectFolder(isActive ? null : folder.path); }}
          >
            {isExpanded ? <FolderOpen className="w-3.5 h-3.5 flex-shrink-0" /> : <Folder className="w-3.5 h-3.5 flex-shrink-0" />}
            {isRenaming ? (
              <input
                autoFocus
                value={renameValue}
                onChange={e => setRenameValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter" && renameValue.trim()) renameMutation.mutate({ id: folder.id, name: renameValue.trim() });
                  if (e.key === "Escape") setRenamingId(null);
                }}
                onClick={e => e.stopPropagation()}
                className="flex-1 bg-secondary border border-primary/40 rounded px-1 py-0.5 text-xs text-foreground focus:outline-none"
              />
            ) : (
              <span className="truncate flex-1">{folder.name}</span>
            )}
          </button>

          {/* Count badge */}
          {count > 0 && !isRenaming && (
            <span className="text-[10px] bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded-full flex-shrink-0">{count}</span>
          )}

          {/* Context menu button */}
          {!isRenaming && (
            <div className="relative flex-shrink-0">
              <button
                onClick={e => { e.stopPropagation(); setMenuOpen(isMenuOpen ? null : folder.id); }}
                className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-secondary transition-all"
              >
                <MoreHorizontal className="w-3 h-3" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-5 z-30 bg-card border border-border rounded-xl shadow-xl py-1 min-w-[130px]">
                  <button
                    onClick={e => { e.stopPropagation(); setNewFolderParent(folder.path); setExpanded(ex => ({ ...ex, [folder.path]: true })); setMenuOpen(null); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <FolderPlus className="w-3 h-3" /> Unterordner
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); setRenamingId(folder.id); setRenameValue(folder.name); setMenuOpen(null); }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Pencil className="w-3 h-3" /> Umbenennen
                  </button>
                  {!isConfirmDelete ? (
                    <button
                      onClick={e => { e.stopPropagation(); setConfirmDelete(folder.id); setMenuOpen(null); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Löschen
                    </button>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); deleteMutation.mutate(folder.id); }}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors font-medium"
                    >
                      <Trash2 className="w-3 h-3" /> Wirklich löschen
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* New subfolder input */}
        {newFolderParent === folder.path && (
          <div className="flex items-center gap-1 px-2 py-1" style={{ paddingLeft: `${8 + (depth + 1) * 14 + 16}px` }}>
            <Folder className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <input
              autoFocus
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && newFolderName.trim()) createMutation.mutate({ name: newFolderName.trim(), parent: folder.path });
                if (e.key === "Escape") { setNewFolderParent(null); setNewFolderName(""); }
              }}
              placeholder="Ordnername..."
              className="flex-1 bg-secondary border border-primary/40 rounded px-1.5 py-0.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button onClick={() => { setNewFolderParent(null); setNewFolderName(""); }} className="p-0.5 text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
          </div>
        )}

        {/* Children */}
        {isExpanded && children.map(child => renderFolder(child, depth + 1))}
      </div>
    );
  }

  const unfiledCount = articles.filter(a => !a.folder).length;

  return (
    <div className="w-56 flex-shrink-0 border-r border-border bg-card/40 flex flex-col h-full">
      <div className="p-3 border-b border-border flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ordner</span>
        <button
          onClick={() => setNewFolderParent("")}
          className="p-1 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
          title="Neuer Ordner"
        >
          <FolderPlus className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {/* All articles */}
        <button
          onClick={() => onSelectFolder(null)}
          onDragOver={e => { if (draggingId) { e.preventDefault(); setDragOver("__all__"); } }}
          onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null); }}
          onDrop={e => { e.preventDefault(); if (draggingId) { onDrop(draggingId, null); setDragOver(null); } }}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
            dragOver === "__all__"
              ? "bg-primary/30 border border-primary/60 text-primary"
              : activeFolder === null ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Alle Artikel</span>
          <span className="text-[10px] bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded-full">{articles.length}</span>
        </button>

        {/* Unfiled */}
        {(unfiledCount > 0 || draggingId) && (
          <button
            onClick={() => onSelectFolder("__unfiled__")}
            onDragOver={e => { if (draggingId) { e.preventDefault(); setDragOver("__unfiled__"); } }}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(null); }}
            onDrop={e => { e.preventDefault(); if (draggingId) { onDrop(draggingId, null); setDragOver(null); } }}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
              dragOver === "__unfiled__"
                ? "bg-primary/30 border border-primary/60 text-primary"
                : activeFolder === "__unfiled__" ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Ohne Ordner</span>
            <span className="text-[10px] bg-secondary/80 text-muted-foreground px-1.5 py-0.5 rounded-full">{unfiledCount}</span>
          </button>
        )}

        <div className="border-t border-border/50 my-1" />

        {/* Root new folder input */}
        {newFolderParent === "" && (
          <div className="flex items-center gap-1 px-2 py-1">
            <Folder className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <input
              autoFocus
              value={newFolderName}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && newFolderName.trim()) createMutation.mutate({ name: newFolderName.trim(), parent: "" });
                if (e.key === "Escape") { setNewFolderParent(null); setNewFolderName(""); }
              }}
              placeholder="Ordnername..."
              className="flex-1 bg-secondary border border-primary/40 rounded px-1.5 py-0.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button onClick={() => { setNewFolderParent(null); setNewFolderName(""); }} className="p-0.5 text-muted-foreground"><X className="w-3 h-3" /></button>
          </div>
        )}

        {/* Folder tree */}
        {rootFolders().map(f => renderFolder(f))}

        {folders.length === 0 && newFolderParent !== "" && (
          <p className="text-xs text-muted-foreground px-2 py-2">Noch keine Ordner. Klicke + um einen anzulegen.</p>
        )}
      </div>

      {/* Click outside to close menus */}
      {menuOpen && (
        <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(null)} />
      )}
    </div>
  );
}

// ── Article Editor ────────────────────────────────────────────────────────────
interface EditorProps {
  article?: WikiArticle | null;
  folders: WikiFolder[];
  defaultFolder?: string;
  onClose: () => void;
  onSaved: () => void;
}

function ArticleEditor({ article, folders, defaultFolder, onClose, onSaved }: EditorProps) {
  const isNew = !article;
  const [title, setTitle] = useState(article?.title ?? "");
  const [category, setCategory] = useState(article?.category ?? "Netzwerk");
  const [type, setType] = useState<WikiArticle["type"]>(article?.type ?? "article");
  const [tagsInput, setTagsInput] = useState((article?.tags ?? []).join(", "));
  const [content, setContent] = useState(article?.content ?? "");
  const [folder, setFolder] = useState(article?.folder ?? defaultFolder ?? "");
  const [newFolderMode, setNewFolderMode] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderParent, setNewFolderParent] = useState("");
  const [preview, setPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<WikiArticle>) =>
      isNew ? apiRequest("POST", "/api/wiki", data) : apiRequest("PUT", `/api/wiki/${article!.id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/wiki"] }); onSaved(); },
  });

  const createFolderMutation = useMutation({
    mutationFn: ({ name, parent }: { name: string; parent: string }) =>
      apiRequest("POST", "/api/wiki/folders", { name, parent }),
    onSuccess: async (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/wiki/folders"] });
      const data = await res.json();
      setFolder(data.path);
      setNewFolderMode(false);
      setNewFolderName("");
    },
  });

  function handleSave() {
    if (!title.trim()) return;
    const tags = tagsInput.split(",").map(t => t.trim()).filter(Boolean);
    saveMutation.mutate({ title: title.trim(), category, type, tags, content, folder: folder || "" });
  }

  function insertText(before: string, after = "") {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart, end = el.selectionEnd;
    const selected = content.slice(start, end);
    setContent(content.slice(0, start) + before + selected + after + content.slice(end));
    setTimeout(() => { el.focus(); el.setSelectionRange(start + before.length, start + before.length + selected.length); }, 0);
  }

  const toolbar = [
    { label: "H2",      action: () => insertText("\n## ") },
    { label: "H3",      action: () => insertText("\n### ") },
    { label: "B",       action: () => insertText("**", "**") },
    { label: "•",       action: () => insertText("\n- ") },
    { label: "1.",      action: () => insertText("\n1. ") },
    { label: "`code`",  action: () => insertText("`", "`") },
    { label: "```",     action: () => insertText("\n```\n", "\n```") },
    { label: "🔗",      action: () => insertText("[Text](", ")") },
    { label: "💡 Tipp", action: () => insertText("\n> 💡 **Prüfungstipp:** ") },
    { label: "⚠️",      action: () => insertText("\n> ⚠️ **Wichtig:** ") },
  ];

  // All folder paths for dropdown
  const allFolderPaths = folders.map(f => f.path).sort();

  return (
    <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur flex items-start justify-center overflow-y-auto py-6 px-4">
      <div className="w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col" style={{ minHeight: "80vh" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-bold">{isNew ? "Neuer Artikel" : `Bearbeiten: ${article!.title}`}</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setPreview(p => !p)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${preview ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {preview ? "Editor" : "Vorschau"}
            </button>
            <button onClick={handleSave} disabled={saveMutation.isPending || !title.trim()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors">
              <Save className="w-3.5 h-3.5" />
              {saveMutation.isPending ? "Speichern..." : "Speichern"}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 flex-1">
          {/* Row 1: Typ, Kategorie, Ordner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Typ</label>
              <select value={type} onChange={e => setType(e.target.value as WikiArticle["type"])} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60">
                <option value="article">Artikel</option>
                <option value="cheatsheet">Cheat Sheet</option>
                <option value="howto">How-To</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Kategorie</label>
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60">
                {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Folder className="w-3 h-3" /> Ordner</label>
              {newFolderMode ? (
                <div className="space-y-1">
                  <select value={newFolderParent} onChange={e => setNewFolderParent(e.target.value)} className="w-full bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/60">
                    <option value="">— Hauptordner —</option>
                    {allFolderPaths.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <div className="flex gap-1">
                    <input autoFocus value={newFolderName} onChange={e => setNewFolderName(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" && newFolderName.trim()) createFolderMutation.mutate({ name: newFolderName.trim(), parent: newFolderParent }); if (e.key === "Escape") setNewFolderMode(false); }}
                      placeholder="Ordnername..." className="flex-1 bg-secondary border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary/60" />
                    <button onClick={() => setNewFolderMode(false)} className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground"><X className="w-3 h-3" /></button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-1">
                  <select value={folder} onChange={e => setFolder(e.target.value)} className="flex-1 bg-secondary border border-border rounded-lg px-2.5 py-2 text-sm text-foreground focus:outline-none focus:border-primary/60">
                    <option value="">— Kein Ordner —</option>
                    {allFolderPaths.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <button onClick={() => setNewFolderMode(true)} className="p-2 rounded-lg bg-secondary border border-border text-muted-foreground hover:text-foreground transition-colors" title="Neuer Ordner"><FolderPlus className="w-3.5 h-3.5" /></button>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Titel</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Artikeltitel..." className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block flex items-center gap-1"><Tag className="w-3 h-3" /> Tags (kommagetrennt)</label>
              <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)} placeholder="z.B. OSI, Netzwerk, Schichten" className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60" />
            </div>
          </div>

          {/* Toolbar */}
          {!preview && (
            <div className="flex flex-wrap gap-1.5">
              {toolbar.map(btn => (
                <button key={btn.label} onClick={btn.action} className="px-2 py-1 text-xs bg-secondary hover:bg-secondary/80 border border-border rounded-lg text-muted-foreground hover:text-foreground transition-colors font-mono">
                  {btn.label}
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-h-[300px]">
            {preview ? (
              <div className="h-full bg-secondary/30 border border-border rounded-xl p-4 overflow-y-auto min-h-[300px]">
                {content ? <MarkdownContent content={content} /> : <p className="text-sm text-muted-foreground italic">Noch kein Inhalt...</p>}
              </div>
            ) : (
              <textarea ref={textareaRef} value={content} onChange={e => setContent(e.target.value)}
                placeholder={"# Titel\n\nInhalt in Markdown...\n\n## Abschnitt\n\n```\nCode hier\n```"}
                className="w-full h-full min-h-[300px] bg-secondary/50 border border-border rounded-xl p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 font-mono leading-relaxed resize-y"
              />
            )}
          </div>

          {saveMutation.isError && <p className="text-xs text-red-400">Fehler beim Speichern. Bitte erneut versuchen.</p>}
        </div>
      </div>
    </div>
  );
}

// ── Article Detail ────────────────────────────────────────────────────────────
interface ArticleViewProps {
  article: WikiArticle;
  folders: WikiFolder[];
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ArticleView({ article, folders, onClose, onEdit, onDelete }: ArticleViewProps) {
  const cat = categoryConfig[article.category];
  const typ = typeConfig[article.type];
  const CatIcon = cat?.icon ?? BookOpen;
  const TypIcon = typ.icon;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const folderObj = folders.find(f => f.path === article.folder);

  return (
    <div className="animate-fadeInUp">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onClose} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Zurück
        </button>
        <div className="flex items-center gap-2">
          <button onClick={onEdit} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-secondary hover:bg-secondary/80 text-foreground transition-colors">
            <Pencil className="w-3.5 h-3.5" /> Bearbeiten
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={onDelete} className="px-3 py-1.5 rounded-lg text-xs bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">Wirklich löschen</button>
              <button onClick={() => setConfirmDelete(false)} className="px-2 py-1.5 rounded-lg text-xs bg-secondary text-muted-foreground">Abbrechen</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="p-1.5 rounded-lg bg-secondary hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {folderObj && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
              <Folder className="w-3 h-3" />{folderObj.path}
            </span>
          )}
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${colorBg[cat?.color ?? "blue"]} ${colorBorder[cat?.color ?? "blue"]} ${colorText[cat?.color ?? "blue"]}`}>
            <CatIcon className="w-3 h-3" />{article.category}
          </span>
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${colorBg[typ.color]} ${colorBorder[typ.color]} ${colorText[typ.color]}`}>
            <TypIcon className="w-3 h-3" />{typ.label}
          </span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">{article.title}</h2>
        <div className="flex flex-wrap gap-1.5">
          {article.tags.map(tag => (
            <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">#{tag}</span>
          ))}
        </div>
      </div>

      <MarkdownContent content={article.content} />
    </div>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
function Breadcrumb({ path, onNavigate }: { path: string | null; onNavigate: (p: string | null) => void }) {
  if (!path || path === "__unfiled__") return null;
  const parts = path.split("/");
  return (
    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-4 animate-fadeInUp">
      <button onClick={() => onNavigate(null)} className="hover:text-foreground transition-colors">Alle</button>
      {parts.map((part, i) => {
        const partPath = parts.slice(0, i + 1).join("/");
        return (
          <span key={i} className="flex items-center gap-1">
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => onNavigate(partPath)} className={i === parts.length - 1 ? "text-foreground font-medium" : "hover:text-foreground transition-colors"}>
              {part}
            </button>
          </span>
        );
      })}
    </div>
  );
}

// ── Main Wiki Page ────────────────────────────────────────────────────────────
export default function WikiPage() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("alle");
  const [activeCategory, setActiveCategory] = useState("alle");
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<WikiArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<WikiArticle | null | undefined>(undefined);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const { toast } = useToast();

  const { data: articles = [], isLoading } = useQuery<WikiArticle[]>({ queryKey: ["/api/wiki"] });
  const { data: folders = [] } = useQuery<WikiFolder[]>({ queryKey: ["/api/wiki/folders"] });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/wiki/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/wiki"] }); setSelectedArticle(null); },
  });

  const moveMutation = useMutation({
    mutationFn: ({ id, folder }: { id: string; folder: string | null }) =>
      apiRequest("PUT", `/api/wiki/${id}`, { folder: folder ?? "" }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/wiki"] });
      const targetFolder = variables.folder;
      const article = articles.find(a => a.id === variables.id);
      toast({
        title: "Artikel verschoben",
        description: targetFolder
          ? `„${article?.title ?? "Artikel"}" → ${targetFolder}`
          : `„${article?.title ?? "Artikel"}" aus Ordner entfernt`,
      });
    },
  });

  function handleDrop(articleId: string, folderPath: string | null) {
    setDraggingId(null);
    const article = articles.find(a => a.id === articleId);
    if (!article) return;
    // Skip if already in that folder
    const currentFolder = article.folder || null;
    if (currentFolder === folderPath) return;
    if (!currentFolder && !folderPath) return;
    moveMutation.mutate({ id: articleId, folder: folderPath });
  }

  const categories = useMemo(() => ["alle", ...Array.from(new Set(articles.map(a => a.category))).sort()], [articles]);

  const filtered = useMemo(() => {
    return articles.filter(a => {
      const matchType = activeType === "alle" || a.type === activeType;
      const matchCat = activeCategory === "alle" || a.category === activeCategory;
      const q = search.toLowerCase();
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.tags.some(t => t.toLowerCase().includes(q)) || (a.folder ?? "").toLowerCase().includes(q);
      let matchFolder = true;
      if (activeFolder === "__unfiled__") matchFolder = !a.folder;
      else if (activeFolder !== null) matchFolder = a.folder === activeFolder || (a.folder?.startsWith(activeFolder + "/") ?? false);
      return matchType && matchCat && matchSearch && matchFolder;
    });
  }, [search, activeType, activeCategory, activeFolder, articles]);

  const isEditorOpen = editingArticle !== undefined;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {isEditorOpen && (
        <ArticleEditor
          article={editingArticle}
          folders={folders}
          defaultFolder={activeFolder && activeFolder !== "__unfiled__" ? activeFolder : ""}
          onClose={() => setEditingArticle(undefined)}
          onSaved={() => { setEditingArticle(undefined); setSelectedArticle(null); }}
        />
      )}

      {/* Header */}
      <header className="border-b border-border sticky top-0 z-10 bg-background/95 backdrop-blur flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/">
            <button className="p-1.5 rounded-lg hover:bg-secondary transition-colors"><ArrowLeft className="w-4 h-4" /></button>
          </Link>
          <div className="flex items-center gap-2 flex-1">
            <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-xs">IO</span>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-none">Wiki</h1>
              <p className="text-xs text-muted-foreground">{articles.length} Artikel · Knowledge Base</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarVisible(v => !v)}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            title="Sidebar ein-/ausblenden"
          >
            <Folder className="w-4 h-4" />
          </button>
          <button
            onClick={() => setEditingArticle(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/20 border border-primary/40 text-primary hover:bg-primary/30 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Neuer Artikel
          </button>
        </div>
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Artikel suchen..."
              value={search}
              onChange={e => { setSearch(e.target.value); setSelectedArticle(null); }}
              className="w-full bg-card border border-border rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors"
            />
          </div>
        </div>
      </header>

      {/* Body: sidebar + content */}
      <div className="flex flex-1 max-w-6xl mx-auto w-full">
        {sidebarVisible && !selectedArticle && (
          <FolderSidebar
            folders={folders}
            articles={articles}
            activeFolder={activeFolder}
            onSelectFolder={setActiveFolder}
            onFoldersChanged={() => queryClient.invalidateQueries({ queryKey: ["/api/wiki/folders"] })}
            draggingId={draggingId}
            onDrop={handleDrop}
          />
        )}

        <main className="flex-1 min-w-0 px-4 py-6">
          {selectedArticle ? (
            <ArticleView
              article={selectedArticle}
              folders={folders}
              onClose={() => setSelectedArticle(null)}
              onEdit={() => setEditingArticle(selectedArticle)}
              onDelete={() => deleteMutation.mutate(selectedArticle.id)}
            />
          ) : (
            <>
              <Breadcrumb path={activeFolder} onNavigate={setActiveFolder} />

              {/* Type filter */}
              <div className="flex flex-wrap gap-2 mb-4 animate-fadeInUp">
                {[
                  { id: "alle", label: "Alle", icon: BookOpen },
                  { id: "article", label: "Artikel", icon: FileText },
                  { id: "cheatsheet", label: "Cheat Sheets", icon: ListChecks },
                  { id: "howto", label: "How-Tos", icon: BookMarked },
                ].map(t => {
                  const Icon = t.icon;
                  return (
                    <button key={t.id} onClick={() => setActiveType(t.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${activeType === t.id ? "bg-primary/20 border-primary/50 text-primary" : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                      <Icon className="w-3 h-3" />{t.label}
                    </button>
                  );
                })}
              </div>

              {/* Category filter */}
              <div className="flex flex-wrap gap-1.5 mb-6 animate-fadeInUp" style={{ animationDelay: "0.05s" }}>
                {categories.map(cat => {
                  const cfg = categoryConfig[cat];
                  const CatIcon = cfg?.icon;
                  return (
                    <button key={cat} onClick={() => setActiveCategory(cat)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-all ${activeCategory === cat ? `${colorBg[cfg?.color ?? "blue"]} ${colorBorder[cfg?.color ?? "blue"]} ${colorText[cfg?.color ?? "blue"]}` : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"}`}>
                      {CatIcon && <CatIcon className="w-3 h-3" />}
                      {cat === "alle" ? "Alle Kategorien" : cat}
                    </button>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground mb-4">{filtered.length} Einträge gefunden</p>

              {isLoading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => <div key={i} className="bg-card border border-border rounded-2xl p-4 animate-pulse h-36" />)}
                </div>
              )}

              {!isLoading && filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground text-sm">
                  {search ? `Kein Artikel für „${search}" gefunden` : "Noch keine Artikel in diesem Ordner"}
                  <br />
                  <button onClick={() => setEditingArticle(null)} className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Artikel erstellen
                  </button>
                </div>
              )}

              {!isLoading && filtered.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filtered.map((article, i) => {
                    const cat = categoryConfig[article.category];
                    const typ = typeConfig[article.type];
                    const CatIcon = cat?.icon ?? BookOpen;
                    const TypIcon = typ.icon;
                    const isDraggingThis = draggingId === article.id;
                    return (
                      <div
                        key={article.id}
                        draggable
                        onDragStart={e => { e.dataTransfer.effectAllowed = "move"; setDraggingId(article.id); }}
                        onDragEnd={() => setDraggingId(null)}
                        className={`group text-left bg-card border border-border rounded-2xl p-4 hover:border-primary/40 transition-all hover:scale-[1.02] animate-fadeInUp cursor-grab active:cursor-grabbing ${
                          isDraggingThis ? "opacity-40 scale-95 border-primary/50" : ""
                        }`}
                        style={{ animationDelay: `${i * 0.04}s` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-1.5">
                            <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors flex-shrink-0" />
                            <div className={`p-2 rounded-lg ${colorBg[cat?.color ?? "blue"]}`}>
                              <CatIcon className={`w-4 h-4 ${colorText[cat?.color ?? "blue"]}`} />
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${colorBg[typ.color]} ${colorText[typ.color]}`}>
                              <TypIcon className="w-3 h-3" />{typ.label}
                            </span>
                            <button onClick={e => { e.stopPropagation(); setEditingArticle(article); }}
                              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all text-muted-foreground hover:text-foreground" title="Bearbeiten">
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <button
                          className="w-full text-left"
                          onClick={() => setSelectedArticle(article)}
                        >
                          <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{article.title}</h3>
                          {article.folder && (
                            <p className="text-xs text-muted-foreground/70 mb-0.5 flex items-center gap-1">
                              <Folder className="w-3 h-3" />{article.folder}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mb-3">{article.category}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {article.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs bg-secondary/60 text-muted-foreground px-1.5 py-0.5 rounded">#{tag}</span>
                              ))}
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
