const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const origin = process.env.PREVIEW_URL || "http://127.0.0.1:5174";
const routes = [
  "/",
  "/a-propos",
  "/projets",
  "/projets/jardins",
  "/projets/distribution-kits-scolaires",
  "/projets/savoirs",
  "/projets/vivant",
  "/actualites",
  "/actualites/premiers-pas",
  "/actualites/idees",
  "/actualites/nature",
  "/galerie",
  "/contact",
  "/demo-admin",
  "/demo-admin?vue=actualites",
  "/demo-admin?vue=galerie",
  "/demo-admin?vue=reglages",
];
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  const violations = [];
  const errors = [];
  const incomplete = [];
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    fs.mkdirSync("artifacts/quality", { recursive: true });
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of routes) {
        await page.goto(origin + route);
        await page.waitForFunction(() =>
          document.title.includes("Démonstration"),
        );
        await page
          .locator(route.includes("demo-admin") ? ".admin-main" : "main h1")
          .waitFor();
        if (route.includes("demo-admin"))
          await page
            .locator(
              ".admin-overview-stats,.admin-news-list,.admin-gallery-grid,.admin-settings",
            )
            .first()
            .waitFor();
        await page.evaluate(async () => {
          document
            .querySelectorAll("img")
            .forEach((img) => (img.loading = "eager"));
          await Promise.all(
            [...document.images].map((img) => img.decode().catch(() => {})),
          );
        });
        assert.equal(await page.locator("h1").count(), 1, `${route} h1`);
        assert.equal(await page.getByText("Illustration générée par IA", { exact: true }).count(), 0, `${route} has no AI photo badge`);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `${route} overflow ${width}`,
        );
        assert.ok(
          await page
            .locator("img")
            .evaluateAll((images) =>
              images.every((img) => img.naturalWidth > 0),
            ),
          `${route} broken image`,
        );
        if ([375, 1440].includes(width)) {
          await page.addScriptTag({
            path: require.resolve("axe-core/axe.min.js"),
          });
          const result = await page.evaluate(async () =>
            window.axe.run(document, {
              runOnly: {
                type: "tag",
                values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
              },
            }),
          );
          for (const v of result.violations)
            violations.push({
              route,
              width,
              id: v.id,
              impact: v.impact,
              nodes: v.nodes.map((n) => ({
                target: n.target,
                summary: n.failureSummary,
              })),
            });
          if (result.incomplete.length)
            incomplete.push({
              route,
              width,
              rules: result.incomplete.map((v) => v.id),
            });
          if (
            [
              "/",
              "/a-propos",
              "/projets",
              "/actualites",
              "/galerie",
              "/contact",
              "/demo-admin",
            ].includes(route)
          )
            await page.screenshot({
              path: `artifacts/quality/${route.slice(1) || "accueil"}-${width}.png`,
              fullPage: true,
            });
        }
      }
      console.log(
        `PASS: ${routes.length} views at ${width}px, direct route reload, no overflow, images and headings`,
      );
    }
    await page.setViewportSize({ width: 375, height: 900 });
    await page.goto(origin + "/");
    await page.locator(".hp-hero").waitFor();
    await page.keyboard.press("Tab");
    assert.equal(
      await page
        .locator(".skip-link")
        .evaluate((el) => document.activeElement === el),
      true,
    );
    await page.keyboard.press("Enter");
    assert.equal(
      await page
        .locator("main")
        .evaluate((el) => document.activeElement === el),
      true,
    );
    assert.equal(
      await page.evaluate(
        () => getComputedStyle(document.documentElement).scrollBehavior,
      ),
      "auto",
    );
    const heroDelivery = await page
      .locator(".hp-hero-background")
      .evaluate(async (element) => {
        const source = getComputedStyle(element).backgroundImage.slice(5,-2);
        const image = new Image(); image.src = source; await image.decode();
        return { source, width: image.naturalWidth };
      });
    assert.ok(
      heroDelivery.source.includes("hero-communaute.webp"),
      "Hero uses the supplied lightweight WebP illustration",
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(origin + "/");
    await page.locator(".hp-hero").waitFor();
    await page.locator("#mission").scrollIntoViewIfNeeded();
    await page.locator("#mission .revealed").first().waitFor();
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(origin + "/galerie");
    await page.locator(".collection-item button").first().click();
    await page.locator("dialog[open]").waitFor();
    for (const button of [
      "Image précédente",
      "Image suivante",
      "Fermer la galerie",
    ]) {
      const bounds = await page
        .getByRole("button", { name: button, exact: true })
        .boundingBox();
      assert.ok(
        bounds.width >= 44 && bounds.height >= 44,
        `44px touch target: ${button}`,
      );
    }
    const auditState = async (route) => {
      await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
      const result = await page.evaluate(() =>
        window.axe.run(document, {
          runOnly: {
            type: "tag",
            values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
          },
        }),
      );
      for (const v of result.violations)
        violations.push({
          route,
          width: 375,
          id: v.id,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        });
    };
    await auditState("/galerie#lightbox");
    await page.getByRole("button", { name: "Fermer la galerie" }).click();
    await page.goto(origin + "/demo-admin?vue=actualites");
    await page.getByRole("button", { name: "Créer un article" }).click();
    await page
      .getByRole("button", { name: "Enregistrer dans ce navigateur" })
      .click();
    await page.locator('[aria-invalid="true"]').first().waitFor();
    await auditState("/demo-admin#form-errors");
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      "Editor fits 375px",
    );
    await page.getByRole("button", { name: "Retour à la liste" }).click();
    await page
      .getByRole("button", { name: /Supprimer.*Les premiers pas/ })
      .click();
    await page.locator("dialog[open]").waitFor();
    await auditState("/demo-admin#confirmation");
    await page.getByRole("button", { name: "Annuler", exact: true }).click();
    // Compatibility with a previous browser-local demo version: do not clear user edits.
    await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const open = indexedDB.open("association-demo-content", 1);
          open.onsuccess = () => {
            const db = open.result;
            const tx = db.transaction("content", "readwrite");
            const store = tx.objectStore("content");
            const get = store.get("main");
            get.onsuccess = () => {
              const state = get.result;
              state.gallery[0].image = {
                src: "/images/forest.jpg",
                alt: "Illustration : forêt, ancien contenu local",
              };
              store.put(state);
            };
            tx.oncomplete = () => {
              db.close();
              resolve();
            };
            tx.onabort = () => reject(tx.error);
          };
        }),
    );
    await page.goto(origin + "/galerie");
    await page.locator(".collection-item img").first().waitFor();
    await page.waitForFunction(() =>
      document
        .querySelector(".collection-item img")
        ?.currentSrc.includes(".webp"),
    );
    console.log(
      "PASS: skip link, focus, reduced motion, scroll reveal, mobile responsive source, touch targets, modal/form axe checks and legacy local images",
    );
    fs.writeFileSync(
      "artifacts/quality/performance.json",
      JSON.stringify({ heroDelivery }, null, 2),
    );
    fs.writeFileSync(
      "artifacts/quality/accessibility.json",
      JSON.stringify({ violations, incomplete, errors }, null, 2),
    );
    console.log(
      JSON.stringify(
        violations.map((v) => ({
          route: v.route,
          width: v.width,
          id: v.id,
          nodes: v.nodes.length,
        })),
        null,
        2,
      ),
    );
    assert.deepEqual(errors, [], "No visible console or runtime errors");
    assert.equal(
      violations.length,
      0,
      "Automated accessibility violations; see artifacts/quality/accessibility.json",
    );
    console.log(
      "PASS: axe WCAG A/AA checks at 375 and 1440px, no console errors. Manual checks remain necessary.",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


