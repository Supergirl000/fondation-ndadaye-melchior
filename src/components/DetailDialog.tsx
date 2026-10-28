import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Picture } from "../data/home";
import { Eyebrow, Photo, trapDialogFocus } from "./ui";
import { Link } from "react-router";

export interface Detail {
  title: string;
  body: string;
  image?: Picture;
  category?: string;
  href?: string;
}
export function DetailDialog({
  detail,
  onClose,
}: {
  detail: Detail | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !detail) return;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      previous?.focus();
    };
  }, [detail]);
  return (
    <dialog
      ref={ref}
      className="detail-dialog"
      onCancel={onClose}
      onKeyDown={trapDialogFocus}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      aria-labelledby="detail-title"
    >
      {detail && (
        <div className="dialog-content">
          <button
            className="dialog-close icon-button"
            onClick={onClose}
            aria-label="Fermer la fenêtre"
          >
            <X />
          </button>
          {detail.image && (
            <Photo picture={detail.image} className="dialog-image" />
          )}
          <div className="dialog-copy">
            <Eyebrow>{detail.category || "CONTENU DE DÉMONSTRATION"}</Eyebrow>
            <h2 id="detail-title">{detail.title}</h2>
            <p>{detail.body}</p>
            {detail.href && (
              <Link
                className="action dialog-action"
                to={detail.href}
                onClick={onClose}
              >
                Découvrir la page complète →
              </Link>
            )}
            <span className="demo-label">
              Site de démonstration
            </span>
          </div>
        </div>
      )}
    </dialog>
  );
}
