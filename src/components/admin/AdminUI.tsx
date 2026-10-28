import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { trapDialogFocus } from "../ui";

export function BlobPreview({ blob, alt }: { blob: Blob; alt: string }) {
  const [url, setUrl] = useState<string>();
  useEffect(() => {
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url ? (
    <img src={url} alt={alt} />
  ) : (
    <span>Préparation de l’aperçu…</span>
  );
}
export function AdminAlert({
  children,
  error = false,
}: {
  children: ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className={`admin-alert ${error ? "is-error" : ""}`}
      role={error ? "alert" : "status"}
    >
      {children}
    </div>
  );
}
export function ConfirmDialog({
  title,
  children,
  action,
  busy,
  error,
  onConfirm,
  onClose,
}: {
  title: string;
  children: ReactNode;
  action: string;
  busy: boolean;
  error?: string;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const dialog = ref.current;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      className="admin-confirm"
      ref={ref}
      aria-labelledby="confirmation-title"
      onKeyDown={trapDialogFocus}
      onCancel={(event) => {
        if (busy) event.preventDefault();
        else onClose();
      }}
    >
      <button
        className="icon-button admin-confirm-close"
        onClick={onClose}
        disabled={busy}
        aria-label="Fermer la confirmation"
      >
        <X />
      </button>
      <p className="eyebrow">DÉMONSTRATION LOCALE</p>
      <h2 id="confirmation-title">{title}</h2>
      <div className="admin-confirm-copy">{children}</div>
      {error && <AdminAlert error>{error}</AdminAlert>}
      <div className="admin-form-actions">
        <button
          className="admin-button secondary"
          autoFocus
          onClick={onClose}
          disabled={busy}
        >
          Annuler
        </button>
        <button
          className="admin-button danger"
          onClick={onConfirm}
          disabled={busy}
        >
          {busy ? "Enregistrement…" : action}
        </button>
      </div>
    </dialog>
  );
}
export function FieldError({ message, id }: { message?: string; id: string }) {
  return message ? (
    <span id={id} className="field-error">
      {message}
    </span>
  ) : null;
}
export const bytesLabel = (value: number) =>
  value < 1024 * 1024
    ? `${Math.round(value / 1024)} Ko`
    : `${(value / 1024 / 1024).toFixed(1)} Mo`;
