import type { Picture } from "../data/models";

/** Also resolves original URLs saved by earlier demo versions, without clearing local edits. */
export function deliveredPicture(picture: Picture): Picture {
  if (picture.assetId) return picture;
  const name = picture.src.match(
    /^\/images\/(garden|forest|growing)(?:\.jpg|-1400\.webp)$/,
  )?.[1];
  if (!name) return picture;
  return {
    ...picture,
    src: `/images/${name}-1400.webp`,
    srcSet: `/images/${name}-480.webp 480w, /images/${name}-960.webp 960w, /images/${name}-1400.webp 1400w`,
    width: 1400,
    height: name === "growing" ? 934 : 933,
  };
}
