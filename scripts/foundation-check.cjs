const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const origin = process.env.PREVIEW_URL || "http://127.0.0.1:5174";
const mission =
  "Promouvoir les droits humains, la démocratie et le développement durable.";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  try {
    const page = await browser.newPage({ reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    fs.mkdirSync("artifacts/foundation", { recursive: true });
    for (const width of [320, 375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      for (const route of [
        "/",
        "/a-propos",
        "/projets/distribution-kits-scolaires",
        "/galerie",
        "/demo-admin",
      ]) {
        await page.goto(origin + route);
        await page.waitForFunction(() =>
          document.title.includes("Fondation NDADAYE Melchior"),
        );
        await page
          .locator(
            route === "/demo-admin"
              ? ".admin-overview-stats"
              : route === "/"
                ? ".hp-hero"
                : route === "/a-propos"
                  ? ".about-page"
                  : route === "/galerie"
                    ? ".public-gallery-page"
                    : ".project-detail",
          )
          .waitFor();
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
          `${route} ${width}`,
        );
        if (route === "/" || route === "/a-propos")
          assert.ok(await page.getByText(mission, { exact: true }).count());
        if (route === "/" || route === "/demo-admin") {
          const logo = page.locator(
            route === "/" ? ".site-header .brand img" : ".admin-brand img",
          );
          assert.match(await logo.getAttribute("src"), /fondation\/logo.png/);
          assert.equal(
            await logo.evaluate((img) => getComputedStyle(img).objectFit),
            "contain",
          );
        }
        if ([320, 1440].includes(width) && route === "/")
          await page.screenshot({
            path: `artifacts/foundation/home-${width}.png`,
            fullPage: true,
          });
      }
    }
    await page.goto(origin + "/demo-admin");
    await page.locator(".admin-overview-stats").waitFor();
    await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const open = indexedDB.open("association-demo-content", 1);
          open.onsuccess = () => {
            const db = open.result;
            const t = db.transaction("content", "readwrite");
            const store = t.objectStore("content");
            const get = store.get("main");
            get.onsuccess = () => {
              const state = get.result;
              state.projects = state.projects.filter(
                (item) => item.id !== "distribution-kits-scolaires",
              );
              state.articles.push({
                ...state.articles[0],
                id: "user-retained",
                slug: "user-retained",
                title: "Contenu local à conserver",
              });
              store.put(state);
            };
            t.oncomplete = () => {
              db.close();
              resolve();
            };
            t.onabort = () => reject(t.error);
          };
        }),
    );
    await page.reload();
    await page.locator(".admin-overview-stats").waitFor();
    const inspect = () =>
      page.evaluate(
        () =>
          new Promise((resolve) => {
            const open = indexedDB.open("association-demo-content", 1);
            open.onsuccess = () => {
              const db = open.result;
              const t = db.transaction("content");
              const get = t.objectStore("content").get("main");
              t.oncomplete = () => {
                resolve(get.result);
                db.close();
              };
            };
          }),
      );
    let state = await inspect();
    assert.equal(
      state.projects.filter((item) => item.id === "distribution-kits-scolaires")
        .length,
      1,
    );
    assert.ok(state.articles.some((item) => item.id === "user-retained"));
    await page.goto(origin + "/demo-admin?vue=reglages");
    await page
      .getByRole("button", {
        name: "Réinitialiser les contenus de démonstration",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", {
        name: "Réinitialiser les contenus locaux",
        exact: true,
      })
      .click();
    await page.locator("dialog[open]").waitFor({ state: "detached" });
    state = await inspect();
    assert.equal(state.articles.length, 3);
    assert.equal(
      state.projects.filter((item) => item.id === "distribution-kits-scolaires")
        .length,
      1,
    );
    assert.equal(
      state.projects.find((item) => item.id === "distribution-kits-scolaires")
        .gallery.length,
      0,
    );
    assert.deepEqual(errors, []);
    console.log(
      "PASS: official identity/mission/logo at five widths, no overflow, legacy seed merge preserves local article, reset retains confirmed activity, no unapproved activity photos, no runtime errors",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

