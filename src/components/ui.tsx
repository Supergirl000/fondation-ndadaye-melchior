import { ArrowUpRight } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent,
} from "react";
import type { Picture } from "../data/home";
import { Link } from "react-router";
import { readDemoAsset } from "../services/demo-db";
import { deliveredPicture } from "../config/images";

/** Keep keyboard traversal inside the active modal, including browser Tab wrapping. */
export function trapDialogFocus(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== "Tab") return;
  const controls = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex="0"]',
    ),
  ).filter((element) => element.getClientRects().length > 0);
  if (!controls.length) {
    event.preventDefault();
    return;
  }
  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first?.focus();
  }
}

export function Arrow({ className = "" }: { className?: string }) {
  return <ArrowUpRight className={className} size={19} aria-hidden="true" />;
}
export function ActionLink({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link className={`action ${secondary ? "action-secondary" : ""}`} to={href}>
      {children}
      <Arrow />
    </Link>
  );
}
export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function Photo({
  picture,
  className = "",
  priority = false,
  sizes,
}: {
  picture: Picture;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [localUrl, setLocalUrl] = useState<string>();
  const delivered = deliveredPicture(picture);
  useEffect(() => {
    let active = true;
    let url: string | undefined;
    setFailed(false);
    setLocalUrl(undefined);
    if (picture.assetId)
      readDemoAsset(picture.assetId)
        .then((blob) => {
          if (!active) return;
          if (blob) {
            url = URL.createObjectURL(blob);
            setLocalUrl(url);
          } else setFailed(true);
        })
        .catch(() => {
          if (active) setFailed(true);
        });
    return () => {
      active = false;
      if (url) URL.revokeObjectURL(url);
    };
  }, [picture.assetId, picture.src]);
  return (
    <img
      className={`photo ${className}`}
      src={failed ? "/images/fallback.svg" : localUrl || delivered.src}
      srcSet={!failed && !picture.assetId ? delivered.srcSet : undefined}
      sizes={
        sizes ||
        (priority
          ? "100vw"
          : "(max-width: 700px) calc(100vw - 40px), (max-width: 1100px) 50vw, 440px")
      }
      width={delivered.width}
      height={delivered.height}
      alt={
        failed
          ? `Illustration végétale de remplacement. ${picture.alt}`
          : picture.alt
      }
      style={{ objectPosition: picture.position }}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
export function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (
      !element ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.classList.add("revealed");
          observer.unobserve(element);
        }
      },
      { threshold: 0.08 },
    );
    element.classList.add("reveal-ready");
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
