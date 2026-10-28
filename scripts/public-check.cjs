/* Optional QA tooling; no test runtime is shipped to website visitors. */
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");

const origin = process.env.PREVIEW_URL || "http://127.0.0.1:5174";
const paths = [
  "/",
  "/a-propos",
  "/projets",
  "/projets/jardins",
  "/projets/savoirs",
  "/projets/vivant",
  "/actualites",
  "/actualites/premiers-pas",
  "/actualites/idees",
  "/actualites/nature",
  "/galerie",
  "/contact",
];
const primary = [
  "/",
  "/a-propos",
  "/projets",
  "/actualites",
  "/galerie",
  "/contact",
];
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    const internalLinks = new Set();
    page.on("pageerror", (error) => errors.push(error.message));
    fs.mkdirSync("artifacts/public", { recursive: true });
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 950 });
      for (const path of paths) {
        const response = await page.goto(origin + path);
        assert.equal(response.status(), 200);
        await page.locator("main h1").waitFor();
        await page.waitForFunction(() =>
          document.title.includes("Démonstration"),
        );
        assert.equal(await page.locator("h1").count(), 1, `${path}: one h1`);
        assert.equal(await page.locator("header.site-header").count(), 1);
        assert.equal(await page.locator("footer.site-footer").count(), 1);
        assert.match(
          await page.locator('meta[name="robots"]').getAttribute("content"),
          /noindex/,
        );
        await page.evaluate(async () => {
          document
            .querySelectorAll("img")
            .forEach((image) => (image.loading = "eager"));
          await Promise.all(
            [...document.images].map((image) => image.decode().catch(() => {})),
          );
        });
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        );
        if (overflow)
          console.log(
            await page.locator("body *").evaluateAll((elements) =>
              elements
                .filter(
                  (el) => el.getBoundingClientRect().right > innerWidth + 0.5,
                )
                .map((el) => ({
                  tag: el.tagName,
                  class: el.className,
                  right: el.getBoundingClientRect().right,
                })),
            ),
          );
        assert.equal(overflow, false, `${path}: no overflow at ${width}`);
        assert.ok(
          await page
            .locator("img")
            .evaluateAll((images) =>
              images.every((image) => image.naturalWidth > 0),
            ),
          `${path}: images loaded`,
        );
        if (width === 1440) {
          for (const href of await page
            .locator("a[href]")
            .evaluateAll((links) =>
              links.map((link) => link.getAttribute("href")),
            )) {
            if (href.startsWith("#")) {
              assert.ok(
                await page.locator(`[id="${href.slice(1)}"]`).count(),
                `${path}: anchor ${href}`,
              );
            } else if (href.startsWith("/")) internalLinks.add(href);
          }
        }
        if ([1440, 390].includes(width) && primary.includes(path))
          await page.screenshot({
            path: `artifacts/public/${path.slice(1) || "accueil"}-${width}.png`,
            fullPage: true,
          });
      }
      console.log(
        `PASS: all 12 routes at ${width}px, headings, images, metadata, no overflow`,
      );
    }
    for (const href of internalLinks) {
      await page.goto(origin + href);
      assert.equal(
        await page.locator(".public-error").count(),
        0,
        `Working link ${href}`,
      );
    }
    console.log(
      `PASS: ${internalLinks.size} internal link destinations and all page anchors`,
    );

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(origin + "/");
    await page.getByRole("button", { name: "Ouvrir le menu" }).click();
    await page
      .getByRole("navigation", { name: "Navigation principale" })
      .getByRole("link", { name: "Nos actions" })
      .click();
    await page.waitForURL("**/projets");
    await page.waitForFunction(
      () => document.activeElement === document.querySelector("main h1"),
    );
    assert.equal(
      await page
        .getByRole("button", { name: "Ouvrir le menu" })
        .getAttribute("aria-expanded"),
      "false",
    );
    assert.equal(
      await page
        .locator("main h1")
        .evaluate((el) => document.activeElement === el),
      true,
    );
    await page
      .getByRole("button", { name: "ENVIRONNEMENT", exact: true })
      .click();
    assert.equal(await page.locator(".public-project-card").count(), 1);
    await page
      .getByRole("searchbox", { name: "Rechercher un projet" })
      .fill("aucun-projet-impossible");
    await page.locator(".empty-state").waitFor();
    await page
      .getByRole("button", { name: "Réinitialiser les filtres" })
      .click();
    assert.equal(await page.locator(".public-project-card").count(), 4);
    await page
      .locator('.public-project-card a[href="/projets/jardins"]')
      .click();
    await page.waitForURL("**/projets/jardins");
    await page.locator(".collection-item button").first().click();
    await page.locator("dialog[open]").waitFor();
    await page.keyboard.press("ArrowRight");
    assert.equal(
      await page.locator(".lightbox-caption>span").textContent(),
      "2 / 2",
    );
    await page.keyboard.press("Escape");
    assert.equal(
      await page
        .locator(".collection-item button")
        .first()
        .evaluate((el) => document.activeElement === el),
      true,
    );
    console.log(
      "PASS: mobile navigation, route focus, project filters, empty/reset, project details and gallery",
    );

    await page.goto(origin + "/actualites");
    await page
      .getByRole("searchbox", { name: "Rechercher un article" })
      .fill("NATURE");
    assert.equal(await page.locator(".journal-card").count(), 1);
    await page.locator(".journal-card a").click();
    await page.waitForURL("**/actualites/nature");
    await page
      .getByRole("navigation", { name: "Sommaire de l’article" })
      .getByRole("link")
      .first()
      .click();
    assert.ok(new URL(page.url()).hash.startsWith("#chapitre-"));
    assert.ok(await page.locator("time[datetime]").count());

    await page.goto(origin + "/galerie");
    await page.getByRole("button", { name: "Le vivant", exact: true }).click();
    assert.equal(await page.locator(".collection-item").count(), 2);
    await page.getByRole("button", { name: "Tout", exact: true }).click();
    const trigger = page.locator(".collection-item button").first();
    await trigger.click();
    await page.locator("dialog[open]").waitFor();
    await page.keyboard.press("ArrowLeft");
    assert.equal(
      await page.locator(".lightbox-caption>span").textContent(),
      "6 / 6",
    );
    await page.getByRole("button", { name: "Image suivante" }).click();
    assert.equal(
      await page.locator(".lightbox-caption>span").textContent(),
      "1 / 6",
    );
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press("Tab");
      assert.equal(
        await page.evaluate(() =>
          Boolean(document.activeElement.closest("dialog")),
        ),
        true,
      );
    }
    await page.screenshot({ path: "artifacts/public/lightbox-mobile.png" });
    await page.getByRole("button", { name: "Fermer la galerie" }).click();
    assert.equal(
      await trigger.evaluate((el) => document.activeElement === el),
      true,
    );
    await page
      .getByRole("searchbox", { name: "Rechercher une image" })
      .fill("sans-resultat");
    await page.locator(".empty-state").waitFor();
    console.log(
      "PASS: news search, article date/contents, gallery filters, lightbox keyboard/wrap/focus, gallery empty state",
    );

    await page.goto(origin + "/contact");
    assert.equal(await page.locator("form").count(), 0);
    assert.equal(await page.locator('a[href^="mailto:"]').count(), 0);
    await page.getByText("Adresse e-mail à renseigner").waitFor();
    for (const path of ["/absente", "/projets/absent", "/actualites/absente"]) {
      await page.goto(origin + path);
      await page.locator(".public-error").waitFor();
      assert.match(await page.title(), /Page introuvable/);
      await page.getByRole("link", { name: "Revenir à l’accueil" }).click();
      await page.locator(".hp-hero").waitFor();
    }
    assert.deepEqual(errors, []);
    console.log(
      "PASS: contact placeholders/no fake form, 404 pages/recovery, no JavaScript errors",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

