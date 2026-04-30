"use client";

import { useRef, useState } from "react";

type ImagePathFieldProps = {
  name: string;
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  hint?: string;
};

export function ImagePathField({
  name,
  defaultValue = "",
  placeholder = "/boutique/photo.jpg",
  className = "",
  inputClassName = "",
  hint,
}: ImagePathFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (fileName: string) => {
    if (!fileName) return;
    setValue(`/boutique/${fileName}`);
  };

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <input
          name={name}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className={inputClassName}
        />
        <button
          type="button"
          onClick={openPicker}
          className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-orange-50"
        >
          Parcourir
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) =>
            handleFileSelected(event.currentTarget.files?.[0]?.name ?? "")
          }
        />
      </div>
      <p className="mt-1 text-xs text-stone-500">
        {hint ??
          "Sélectionnez un fichier puis copiez-le dans public/boutique/. Le chemin sera rempli automatiquement."}
      </p>
    </div>
  );
}
