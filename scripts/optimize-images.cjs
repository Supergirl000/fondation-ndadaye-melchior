const sharp = require(process.env.SHARP_PATH || "sharp");
const fs = require("node:fs/promises");
const path = require("node:path");
(async () => {
  await fs.mkdir("assets/source-images", { recursive: true });
  for (const name of ["garden", "forest", "growing"]) {
    const source = path.join("assets/source-images", `${name}.jpg`);
    try {
      await fs.access(source);
    } catch {
      await fs.copyFile(path.join("public/images", `${name}.jpg`), source);
    }
    for (const width of [480, 960, 1400]) {
      const output = path.join("public/images", `${name}-${width}.webp`);
      const result = await sharp(source)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 78, effort: 5 })
        .toFile(output);
      console.log(
        `${output}: ${result.width}×${result.height}, ${result.size} bytes`,
      );
    }
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
