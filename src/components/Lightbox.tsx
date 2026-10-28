import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, Plus } from "lucide-react";
import type { GalleryItem } from "../data/models";
import { Photo, trapDialogFocus } from "./ui";
import { EmptyState } from "./PublicUI";

export function Lightbox({
  items,
  index,
  onChange,
  onClose,
}: {
  items: GalleryItem[];
  index: number;
  onChange: (index: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const item = items[index];
  useEffect(() => {
    const dialog = ref.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  const move = (step: number) =>
    onChange((index + step + items.length) % items.length);
  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-labelledby="lightbox-title"
      aria-describedby="lightbox-description"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      onKeyDown={(event) => {
        trapDialogFocus(event);
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <div className="lightbox-top">
        <span>PHOTOGRAPHIE D’ILLUSTRATION</span>
        <button
          className="icon-button"
          autoFocus
          onClick={onClose}
          aria-label="Fermer la galerie"
        >
          <X />
        </button>
      </div>
      <div className="lightbox-stage">
        {items.length > 1 && (
          <button
            className="lightbox-prev icon-button"
            onClick={() => move(-1)}
            aria-label="Image précédente"
          >
            <ArrowLeft />
          </button>
        )}
        <Photo key={item.id} picture={item.image} priority />
        {items.length > 1 && (
          <button
            className="lightbox-next icon-button"
            onClick={() => move(1)}
            aria-label="Image suivante"
          >
            <ArrowRight />
          </button>
        )}
      </div>
      <div className="lightbox-caption" aria-live="polite" aria-atomic="true">
        <div>
          <h2 id="lightbox-title">{item.title}</h2>
          <p id="lightbox-description">{item.caption}</p>
        </div>
        <span>
          {index + 1} / {items.length}
        </span>
      </div>
      <p className="lightbox-help">← → pour parcourir · Échap pour fermer</p>
    </dialog>
  );
}

export function PhotoCollection({
  items,
  compact = false,
}: {
  items: GalleryItem[];
  compact?: boolean;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = items.findIndex((item) => item.id === selectedId);
  if (!items.length)
    return <EmptyState title="Les premières images viendront ici." />;
  return (
    <>
      <div className={`photo-collection ${compact ? "is-compact" : ""}`}>
        {items.map((item, index) => (
          <figure
            key={item.id}
            className={`collection-item collection-${index % 6}`}
          >
            <button
              aria-label={`Agrandir : ${item.title}`}
              onClick={() => setSelectedId(item.id)}
            >
              <Photo picture={item.image} />
              <span className="collection-overlay">
                <span>0{index + 1}</span>
                <Plus size={23} aria-hidden="true" />
              </span>
            </button>
            <figcaption>
              <span>{item.title}</span>
              <small>{item.category} · Illustration</small>
            </figcaption>
          </figure>
        ))}
      </div>
      {selected >= 0 && (
        <Lightbox
          items={items}
          index={selected}
          onChange={(index) => setSelectedId(items[index].id)}
          onClose={() => setSelectedId(null)}
        />
      )}
    </>
  );
}
