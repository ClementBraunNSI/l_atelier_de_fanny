#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Petit outil de bureau pour gérer src/data/products.json (boutique Next.js).
Dépendances : Python 3.10+ uniquement (tkinter inclus avec Python sur macOS / Windows).

Lancement en développement :
  python3 tools/boutique-admin/main.py
(requis : racine du dépôt contenant src/data/products.json.)

Build exécutable (PyInstaller) : scripts/build-macos.sh ou scripts/build-windows.ps1
dans ce dossier — placer l’app / le dossier dist à la racine du dépôt ou utiliser
BOUTIQUE_ADMIN_PROJECT_ROOT.
"""

from __future__ import annotations

import json
import os
import re
import sys
import tkinter as tk
from pathlib import Path
from tkinter import messagebox, ttk
from typing import Any
from uuid import uuid4


def _project_search_bases() -> list[Path]:
    """Répertoires à tester pour trouver …/src/data/products.json."""
    bases: list[Path] = []
    env_root = os.environ.get("BOUTIQUE_ADMIN_PROJECT_ROOT", "").strip()
    if env_root:
        bases.append(Path(env_root).expanduser().resolve())
    if getattr(sys, "frozen", False):
        # PyInstaller : l’exécutable est dans le bundle (.app/Contents/MacOS/ ou dist/…/)
        exe = Path(sys.executable).resolve()
        bases.append(exe.parent)
        bases.extend(exe.parents)
        try:
            bases.append(Path.cwd().resolve())
        except (OSError, FileNotFoundError):
            pass
    else:
        here = Path(__file__).resolve().parent
        bases.append(here)
        bases.extend(here.parents)
    out: list[Path] = []
    seen: set[Path] = set()
    for b in bases:
        if b in seen:
            continue
        seen.add(b)
        out.append(b)
    return out


def find_products_json() -> Path:
    for base in _project_search_bases():
        candidate = base / "src" / "data" / "products.json"
        if candidate.is_file():
            return candidate
    raise FileNotFoundError(
        "Impossible de trouver src/data/products.json.\n"
        "— En mode script : lancez depuis la racine du dépôt (dossier qui contient src/).\n"
        "— En application packagée : placez BoutiqueAdmin.app (ou le dossier BoutiqueAdmin/) "
        "à la racine du dépôt, à côté de src/, ou définissez BOUTIQUE_ADMIN_PROJECT_ROOT "
        "avec le chemin absolu de cette racine."
    )


def slugify(text: str) -> str:
    s = text.strip().lower()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[-\s]+", "-", s).strip("-")
    return s or "produit"


def load_products(path: Path) -> list[dict[str, Any]]:
    raw = path.read_text(encoding="utf-8")
    data = json.loads(raw)
    if not isinstance(data, list):
        return []
    out: list[dict[str, Any]] = []
    for item in data:
        if isinstance(item, dict):
            out.append(dict(item))
    return out


def save_products(path: Path, products: list[dict[str, Any]]) -> None:
    text = json.dumps(products, ensure_ascii=False, indent=2) + "\n"
    path.write_text(text, encoding="utf-8")


def normalize_image_public_url(raw: str) -> str:
    """Convertit ../public/boutique/x ou public/boutique/x en /boutique/x pour Next.js."""
    s = raw.strip()
    if not s or re.match(r"^https?://", s, re.I):
        return s
    s = re.sub(r"^(\.\./)+public/", "/", s, flags=re.I)
    s = re.sub(r"^\./public/", "/", s, flags=re.I)
    s = re.sub(r"^public/", "/", s, flags=re.I)
    if not s.startswith("/"):
        s = "/" + s
    return re.sub(r"/{2,}", "/", s)


def normalize_product(p: dict[str, Any]) -> dict[str, Any]:
    published = p.get("published", True)
    if not isinstance(published, bool):
        published = True
    price = p.get("priceEuro", 0)
    try:
        price_f = float(price)
    except (TypeError, ValueError):
        price_f = 0.0
    image = p.get("image")
    image_s = (
        normalize_image_public_url(str(image).strip())
        if image is not None and str(image).strip()
        else ""
    )
    return {
        "id": str(p.get("id", "")).strip() or str(uuid4())[:8],
        "name": str(p.get("name", "")).strip(),
        "description": str(p.get("description", "")).strip(),
        "priceEuro": price_f,
        **({"image": image_s} if image_s else {}),
        **({} if published else {"published": False}),
    }


class BoutiqueAdminApp(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("Boutique — L’Atelier de Fanny")
        self.minsize(720, 520)
        self.geometry("880x600")

        self.path = find_products_json()
        self.products: list[dict[str, Any]] = []
        self.current_index: int | None = None

        self._build_ui()
        self.reload_from_disk()

    def _build_ui(self) -> None:
        info = ttk.Label(
            self,
            text=f"Fichier : {self.path}",
            wraplength=840,
            justify=tk.LEFT,
        )
        info.pack(fill=tk.X, padx=12, pady=(10, 4))

        main = ttk.Panedwindow(self, orient=tk.HORIZONTAL)
        main.pack(fill=tk.BOTH, expand=True, padx=8, pady=4)

        left = ttk.Frame(main, padding=4)
        main.add(left, weight=1)

        ttk.Label(left, text="Produits").pack(anchor=tk.W)
        self.listbox = tk.Listbox(left, exportselection=False, height=18)
        self.listbox.pack(fill=tk.BOTH, expand=True)
        self.listbox.bind("<<ListboxSelect>>", self._on_select)

        btns = ttk.Frame(left)
        btns.pack(fill=tk.X, pady=6)
        ttk.Button(btns, text="Nouveau", command=self.new_product).pack(
            side=tk.LEFT, padx=(0, 6)
        )
        ttk.Button(btns, text="Supprimer", command=self.delete_selected).pack(
            side=tk.LEFT, padx=(0, 6)
        )
        ttk.Button(btns, text="Recharger", command=self.reload_from_disk).pack(
            side=tk.LEFT
        )

        right = ttk.Frame(main, padding=8)
        main.add(right, weight=2)

        self.var_id = tk.StringVar()
        self.var_name = tk.StringVar()
        self.var_description = tk.StringVar()
        self.var_price = tk.StringVar()
        self.var_image = tk.StringVar()
        self.var_published = tk.BooleanVar(value=True)

        row = 0
        for label, var, widget in (
            ("Identifiant (slug, unique)", self.var_id, "entry"),
            ("Nom", self.var_name, "entry"),
            ("Description", self.var_description, "entry"),
            ("Prix (euros, ex. 12 ou 12,50)", self.var_price, "entry"),
            ("Image (optionnel), ex. /boutique/photo.webp", self.var_image, "entry"),
        ):
            ttk.Label(right, text=label).grid(row=row, column=0, sticky=tk.W, pady=2)
            if widget == "entry":
                e = ttk.Entry(right, textvariable=var, width=52)
                e.grid(row=row + 1, column=0, sticky=tk.EW, pady=(0, 8))
            row += 2

        pub = ttk.Checkbutton(
            right,
            text="Publié (visible sur le site)",
            variable=self.var_published,
        )
        pub.grid(row=row, column=0, sticky=tk.W, pady=(4, 12))

        save_row = ttk.Frame(right)
        save_row.grid(row=row + 1, column=0, sticky=tk.EW)
        ttk.Button(save_row, text="Appliquer au produit sélectionné", command=self.apply_form).pack(
            side=tk.LEFT, padx=(0, 8)
        )
        ttk.Button(save_row, text="Enregistrer le fichier", command=self.save_file).pack(
            side=tk.LEFT
        )

        right.columnconfigure(0, weight=1)

        bottom = ttk.Frame(self, padding=(12, 4, 12, 10))
        bottom.pack(fill=tk.X)
        ttk.Label(
            bottom,
            text="Astuce : fichiers dans public/boutique/ — indiquez l’URL du site : /boutique/nom.jpg (pas ../public/…).",
            wraplength=820,
        ).pack(anchor=tk.W)

    def _refresh_list(self) -> None:
        self.listbox.delete(0, tk.END)
        for p in self.products:
            name = str(p.get("name", "(sans nom)"))
            pub = "✓" if p.get("published", True) is not False else "—"
            self.listbox.insert(tk.END, f"{pub}  {name}")

    def _on_select(self, _event: tk.Event | None = None) -> None:
        sel = self.listbox.curselection()
        if not sel:
            return
        idx = int(sel[0])
        self.current_index = idx
        p = self.products[idx]
        self.var_id.set(str(p.get("id", "")))
        self.var_name.set(str(p.get("name", "")))
        self.var_description.set(str(p.get("description", "")))
        price = p.get("priceEuro", 0)
        self.var_price.set(str(price).replace(".", ",") if isinstance(price, float) else str(price))
        self.var_image.set(str(p.get("image", "")))
        self.var_published.set(p.get("published", True) is not False)

    def new_product(self) -> None:
        base_name = "Nouveau produit"
        new_id = slugify(base_name)
        suffix = 2
        ids = {str(x.get("id", "")) for x in self.products}
        while new_id in ids:
            new_id = f"{slugify(base_name)}-{suffix}"
            suffix += 1
        self.products.append(
            normalize_product(
                {
                    "id": new_id,
                    "name": base_name,
                    "description": "",
                    "priceEuro": 0,
                    "published": False,
                }
            )
        )
        self._refresh_list()
        self.listbox.selection_clear(0, tk.END)
        self.listbox.selection_set(len(self.products) - 1)
        self.listbox.see(len(self.products) - 1)
        self._on_select()

    def delete_selected(self) -> None:
        sel = self.listbox.curselection()
        if not sel:
            messagebox.showinfo("Supprimer", "Sélectionnez un produit dans la liste.")
            return
        idx = int(sel[0])
        if not messagebox.askyesno("Supprimer", "Supprimer ce produit de la liste ?"):
            return
        del self.products[idx]
        self.current_index = None
        self._refresh_list()
        self._clear_form()

    def _clear_form(self) -> None:
        self.var_id.set("")
        self.var_name.set("")
        self.var_description.set("")
        self.var_price.set("")
        self.var_image.set("")
        self.var_published.set(True)

    def apply_form(self) -> None:
        sel = self.listbox.curselection()
        if not sel:
            messagebox.showinfo("Appliquer", "Sélectionnez un produit ou créez-en un avec « Nouveau ».")
            return
        idx = int(sel[0])
        price_s = self.var_price.get().strip().replace(",", ".")
        try:
            price = float(price_s) if price_s else 0.0
        except ValueError:
            messagebox.showerror("Prix", "Prix invalide. Utilisez un nombre, ex. 12 ou 12.5")
            return
        new_id = self.var_id.get().strip() or slugify(self.var_name.get())
        for i, other in enumerate(self.products):
            if i != idx and str(other.get("id", "")) == new_id:
                messagebox.showerror("Identifiant", "Cet identifiant est déjà utilisé par un autre produit.")
                return
        self.products[idx] = normalize_product(
            {
                "id": new_id,
                "name": self.var_name.get(),
                "description": self.var_description.get(),
                "priceEuro": price,
                "image": self.var_image.get().strip() or None,
                "published": self.var_published.get(),
            }
        )
        self._refresh_list()
        self.listbox.selection_set(idx)
        self._on_select()
        messagebox.showinfo("Appliquer", "Modifications prises en compte dans la liste. Pensez à « Enregistrer le fichier ».")

    def save_file(self) -> None:
        normalized = [normalize_product(p) for p in self.products]
        ids = [p["id"] for p in normalized]
        if len(set(ids)) != len(ids):
            messagebox.showerror("Enregistrer", "Des identifiants en double : corrigez avant d’enregistrer.")
            return
        for p in normalized:
            if not p.get("name"):
                messagebox.showerror("Enregistrer", "Chaque produit doit avoir un nom.")
                return
        try:
            save_products(self.path, normalized)
        except OSError as e:
            messagebox.showerror("Enregistrer", str(e))
            return
        self.products = normalized
        self._refresh_list()
        messagebox.showinfo("Enregistrer", f"Fichier enregistré :\n{self.path}")

    def reload_from_disk(self) -> None:
        try:
            self.products = [normalize_product(p) for p in load_products(self.path)]
        except (OSError, json.JSONDecodeError) as e:
            messagebox.showerror("Recharger", str(e))
            self.products = []
        self._refresh_list()
        self._clear_form()
        self.listbox.selection_clear(0, tk.END)


def main() -> None:
    try:
        find_products_json()
    except FileNotFoundError as e:
        if getattr(sys, "frozen", False):
            root = tk.Tk()
            root.withdraw()
            messagebox.showerror("Dépôt introuvable", str(e))
            root.destroy()
        else:
            print(e, file=sys.stderr)
        sys.exit(1)
    app = BoutiqueAdminApp()
    app.mainloop()


if __name__ == "__main__":
    main()
