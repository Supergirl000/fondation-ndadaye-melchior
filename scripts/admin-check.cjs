/* Browser-local integration tests in an isolated context. No user's stored data is touched. */
const { chromium } = require(process.env.PLAYWRIGHT_PATH || "playwright");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const origin = process.env.PREVIEW_URL || "http://127.0.0.1:5174";
const title = "Une histoire locale de démonstration";
const revised = "Une histoire locale, maintenant modifiée";
(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
  try {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    await context.addInitScript(() => {
      window.__objectUrls = new Set();
      const create = URL.createObjectURL.bind(URL),
        revoke = URL.revokeObjectURL.bind(URL);
      URL.createObjectURL = (value) => {
        const url = create(value);
        window.__objectUrls.add(url);
        return url;
      };
      URL.revokeObjectURL = (url) => {
        window.__objectUrls.delete(url);
        revoke(url);
      };
    });
    const page = await context.newPage();
    const publicPage = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    publicPage.on("pageerror", (e) => errors.push(e.message));
    fs.mkdirSync("artifacts/admin", { recursive: true });
    await page.goto(origin + "/demo-admin");
    await page
      .getByRole("heading", { name: "Faisons vivre le collectif." })
      .waitFor();
    await page.locator(".admin-overview-stats strong").first().waitFor();
    assert.equal(
      await page.locator(".admin-overview-stats strong").first().textContent(),
      "3",
    );
    await page
      .getByText(
        "Administration de démonstration — les modifications sont enregistrées uniquement dans ce navigateur.",
      )
      .waitFor();
    for (const width of [1440, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 950 });
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
        `admin overflow ${width}`,
      );
      await page.screenshot({
        path: `artifacts/admin/overview-${width}.png`,
        fullPage: true,
      });
    }
    await page.setViewportSize({ width: 1440, height: 1000 });
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 950 });
      for (const view of ['actualites', 'galerie', 'reglages']) {
        await page.goto(`${origin}/demo-admin?vue=${view}`);
        await page.locator(view === 'reglages' ? '.admin-settings' : '.admin-section-top').waitFor();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${view} overflow ${width}`);
      }
    }
    await page.goto(origin + '/demo-admin');
    await page.locator('.admin-overview-stats').waitFor();
    console.log('PASS: all administrative sections responsive at 320, 768 and 1440px');
    await publicPage.goto(origin + "/actualites");
    await page
      .getByRole("navigation", { name: "Navigation de l’administration" })
      .getByRole("link", { name: "Actualités" })
      .click();
    await page.getByRole("button", { name: "Créer un article" }).click();
    await page
      .getByRole("button", { name: "Enregistrer dans ce navigateur" })
      .click();
    await page.getByText("Indiquez un titre de 5 à 140 caractères.").waitFor();
    await page.getByLabel("Titre de l’article").fill(title);
    await page
      .getByRole("textbox", { name: /^Description/ })
      .fill(
        "Une description locale suffisamment précise pour ce récit de démonstration.",
      );
    await page.getByLabel("Date de publication fictive").fill("2026-10-28");
    await page
      .getByLabel("Texte de l’article")
      .fill(
        "Ce texte est une démonstration enregistrée dans ce navigateur.\n\nUn second paragraphe pour tester la lecture.",
      );
    await page
      .locator("input[type=file]")
      .setInputFiles("assets/source-images/garden.jpg");
    await page.getByRole("button", { name: "Voir l’aperçu" }).click();
    await page.locator(".admin-article-preview").waitFor();
    await page.locator('.preview-cover img[src^="blob:"]').waitFor();
    await page.evaluate(() => {
      document.activeElement?.blur();
      window.scrollTo(0, 0);
    });
    await page.screenshot({
      path: "artifacts/admin/news-preview.png",
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Enregistrer dans ce navigateur" })
      .click();
    await page
      .locator(".admin-news-copy h3")
      .filter({ hasText: title })
      .waitFor();
    await publicPage.bringToFront();
    await publicPage
      .locator(".journal-card h2")
      .filter({ hasText: title })
      .waitFor();
    const link = publicPage
      .locator(".journal-card")
      .filter({ hasText: title })
      .locator("a");
    const articlePath = await link.getAttribute("href");
    await link.click();
    await publicPage.locator('.article-cover img[src^="blob:"]').waitFor();
    await publicPage.reload();
    await publicPage
      .getByRole("heading", { name: title, exact: true })
      .waitFor();
    console.log(
      "PASS: required fields, JPEG attach/compression/preview, article create, public tab refresh and reload persistence",
    );
    await publicPage.goto(origin + '/');
    await publicPage.locator('.hp-news-card h3').filter({hasText:title}).waitFor();
    await publicPage.goto(origin + articlePath);
    await publicPage.getByRole('heading', {name:title,exact:true}).waitFor();
    await page.bringToFront();
    await page
      .getByRole("button", { name: new RegExp("Modifier.*" + title) })
      .click();
    await page.getByLabel("Titre de l’article").fill(revised);
    await page
      .getByRole("button", { name: "Enregistrer dans ce navigateur" })
      .click();
    await page
      .locator(".admin-news-copy h3")
      .filter({ hasText: revised })
      .waitFor();
    await publicPage.bringToFront();
    await publicPage
      .getByRole("heading", { name: revised, exact: true })
      .waitFor();
    await page.bringToFront();
    await page
      .getByRole("button", { name: new RegExp("Supprimer.*" + revised) })
      .click();
    await page.getByRole("button", { name: "Annuler", exact: true }).click();
    assert.ok(
      await page
        .locator(".admin-news-copy h3")
        .filter({ hasText: revised })
        .count(),
    );
    await page
      .getByRole("button", { name: new RegExp("Supprimer.*" + revised) })
      .click();
    await page
      .getByRole("button", { name: "Supprimer de ce navigateur", exact: true })
      .click();
    await page.locator("dialog[open]").waitFor({ state: "detached" });
    await publicPage.bringToFront();
    await publicPage.locator(".public-error").waitFor();
    console.log(
      "PASS: article edit, same-browser detail update, cancellation, confirmed deletion and public 404",
    );
    await page.bringToFront();
    await page
      .getByRole("navigation", { name: "Navigation de l’administration" })
      .getByRole("link", { name: "Photothèque" })
      .click();
    const fileInput = page.getByLabel("Choisir des images");
    await fileInput.setInputFiles({
      name: "interdit.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from("<svg/>"),
    });
    await page
      .getByRole("alert")
      .filter({ hasText: "JPEG, PNG ou WebP" })
      .waitFor();
    await fileInput.setInputFiles({
      name: "trop-lourd.jpg",
      mimeType: "image/jpeg",
      buffer: Buffer.alloc(5 * 1024 * 1024 + 1),
    });
    await page.getByRole("alert").filter({ hasText: "maximum 5 Mo" }).waitFor();
    await fileInput.setInputFiles({
      name: "corrompu.png",
      mimeType: "image/png",
      buffer: Buffer.from("image invalide"),
    });
    await page
      .getByRole("alert")
      .filter({ hasText: "format d’image annoncé" })
      .waitFor();
    const pictures = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 2300;
      canvas.height = 1500;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#c66b4e";
      ctx.fillRect(0, 0, 2300, 1500);
      return ["image/png", "image/webp"].map((type) => ({
        type,
        data: canvas.toDataURL(type).split(",")[1],
      }));
    });
    await fileInput.setInputFiles(
      pictures.map((file, index) => ({
        name: `demo-${index}.${index ? "webp" : "png"}`,
        mimeType: file.type,
        buffer: Buffer.from(file.data, "base64"),
      })),
    );
    await page
      .getByLabel("Titre de l’image 1", { exact: true })
      .fill("Image locale orange");
    await page
      .getByLabel("Description de l’image 1", { exact: true })
      .fill("Une surface terracotta créée pour vérifier les images locales.");
    await page
      .getByLabel("Titre de l’image 2", { exact: true })
      .fill("Seconde image locale");
    await page
      .getByLabel("Description de l’image 2", { exact: true })
      .fill("Une deuxième illustration de test au format WebP.");
    await page
      .getByRole("button", {
        name: "Enregistrer les images dans ce navigateur",
      })
      .click();
    await page
      .locator(".admin-photo-card")
      .filter({ hasText: "Image locale orange" })
      .waitFor();
    await publicPage.goto(origin + "/galerie");
    await publicPage
      .getByRole("button", {
        name: "Agrandir : Image locale orange",
        exact: true,
      })
      .click();
    const imported = publicPage.locator(".lightbox-stage img");
    await publicPage.waitForFunction(() => {
      const image = document.querySelector(".lightbox-stage img");
      return image?.naturalWidth === 1600;
    });
    assert.ok((await imported.getAttribute("src")).startsWith("blob:"));
    await publicPage.getByRole("button", { name: "Fermer la galerie" }).click();
    console.log(
      "PASS: SVG/oversize/corrupt rejection, PNG and WebP batch imports, 1600px resize, public gallery/lightbox",
    );
    await page.bringToFront();
    await page
      .getByRole("button", {
        name: "Modifier Image locale orange",
        exact: true,
      })
      .click();
    await page
      .getByRole("textbox", { name: "Description de l’image", exact: true })
      .fill("Description révisée de cette illustration locale terracotta.");
    await page
      .getByRole("button", { name: "Enregistrer", exact: true })
      .click();
    await page
      .locator(".admin-photo-card")
      .filter({ hasText: "Description révisée" })
      .waitFor();
    await page.reload();
    await page
      .locator(".admin-photo-card")
      .filter({ hasText: "Description révisée" })
      .waitFor();
    await page
      .getByRole("button", { name: "Retirer Image locale orange", exact: true })
      .click();
    await page
      .getByRole("button", {
        name: "Retirer de la galerie locale",
        exact: true,
      })
      .click();
    await page.locator("dialog[open]").waitFor({ state: "detached" });
    await publicPage.bringToFront();
    await publicPage
      .getByRole("button", {
        name: "Agrandir : Image locale orange",
        exact: true,
      })
      .waitFor({ state: "detached" });
    console.log(
      "PASS: image description edit, persistence and confirmed removal reflected in public gallery",
    );

    await page.bringToFront();
    // Fault injection: emulate the browser rejecting an IndexedDB write.
    await page.evaluate(() => {
      window.__originalPut = IDBObjectStore.prototype.put;
      IDBObjectStore.prototype.put = function () {
        throw new DOMException("Test de quota", "QuotaExceededError");
      };
    });
    await page
      .getByRole("button", {
        name: "Retirer Seconde image locale",
        exact: true,
      })
      .click();
    await page
      .getByRole("button", {
        name: "Retirer de la galerie locale",
        exact: true,
      })
      .click();
    await page
      .getByRole("alert")
      .filter({ hasText: "espace de stockage est insuffisant" })
      .waitFor();
    await page.evaluate(() => {
      IDBObjectStore.prototype.put = window.__originalPut;
    });
    await page.getByRole("button", { name: "Annuler", exact: true }).click();
    await page.reload();
    await page
      .locator(".admin-photo-card")
      .filter({ hasText: "Seconde image locale" })
      .waitFor();
    await page
      .getByRole("navigation", { name: "Navigation de l’administration" })
      .getByRole("link", { name: "Réglages démo" })
      .click();
    await page.waitForFunction(() => window.__objectUrls.size === 0);
    assert.equal(await page.evaluate(() => localStorage.length), 0);
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
    await publicPage.goto(origin + "/galerie");
    await publicPage.locator(".collection-item").first().waitFor();
    assert.equal(await publicPage.locator(".collection-item").count(), 6);
    await publicPage.goto(origin + articlePath);
    await publicPage.locator(".public-error").waitFor();
    const assetCount = await page.evaluate(
      () =>
        new Promise((resolve, reject) => {
          const open = indexedDB.open("association-demo-content", 1);
          open.onsuccess = () => {
            const db = open.result;
            const t = db.transaction("assets");
            const request = t.objectStore("assets").count();
            t.oncomplete = () => {
              resolve(request.result);
              db.close();
            };
          };
          open.onerror = () => reject(open.error);
        }),
    );
    assert.equal(assetCount, 0);
    assert.deepEqual(errors, []);
    console.log(
      "PASS: quota failure rollback, object URL cleanup, no localStorage images, reset restores seed and clears blobs, no runtime errors",
    );
    await context.close();
    const unavailable = await browser.newContext();
    await unavailable.addInitScript(() =>
      Object.defineProperty(window, "indexedDB", { value: undefined }),
    );
    const failurePage = await unavailable.newPage();
    await failurePage.goto(origin + "/demo-admin");
    await failurePage
      .getByRole("alert")
      .filter({ hasText: "stockage de ce navigateur est indisponible" })
      .waitFor();
    await failurePage.goto(origin + "/actualites");
    await failurePage.locator(".public-storage-notice").waitFor();
    assert.equal(await failurePage.locator(".journal-card").count(), 3);
    await unavailable.close();
    console.log(
      "PASS: unavailable IndexedDB error and explicit public seed fallback",
    );
  } finally {
    await browser.close();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

