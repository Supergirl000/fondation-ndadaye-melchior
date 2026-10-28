/* Homepage regression checks, using an isolated browser context. */
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const origin = process.env.PREVIEW_URL || 'http://127.0.0.1:5174';
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:process.env.CHROMIUM_PATH || undefined});
  try {
    const page = await browser.newPage({reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    fs.mkdirSync('artifacts/redesign', {recursive:true});
    for (const width of [320,375,768,1024,1440]) {
      await page.setViewportSize({width,height:1000});
      assert.equal((await page.goto(origin)).status(),200);
      await page.locator('.hp-hero').waitFor();
      await page.evaluate(async () => {
        document.querySelectorAll('img').forEach(image => image.loading='eager');
        await Promise.all([...document.images].map(image=>image.decode().catch(()=>{})));
      });
      assert.equal(await page.locator('h1').count(),1);
      assert.equal((await page.locator('h1').innerText()).replace(/\s+/g,' ').trim(), 'Des communautés plus justes, plus fortes et plus durables.');
      if (width >= 1024) {
        const headingLines = await page.locator('h1').evaluate(element => Math.round(element.getBoundingClientRect().height / parseFloat(getComputedStyle(element).lineHeight)));
        assert.equal(headingLines,3,`Three balanced headline lines at ${width}px`);
        assert.ok((await page.locator('.hp-actions').boundingBox()).y + (await page.locator('.hp-actions').boundingBox()).height < 768, 'Primary action visible in a 768px-high desktop viewport');
      }
      assert.equal(await page.locator('main section').count(),7);
      assert.equal(await page.locator('.hp-pillar').count(),3);
      assert.equal(await page.locator('.hp-engagement').count(),4);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      assert.ok(await page.locator('img').evaluateAll(images=>images.every(image=>image.naturalWidth>0)));
      const mainImages = await page.locator('.hp-hero img,.hp-engagement img').evaluateAll(images=>images.map(image=>image.currentSrc));
      assert.ok(mainImages.every(src=>src.includes('/images/fondation/')));
      assert.ok(await page.getByRole('heading',{name:'Distribution de kits scolaires aux élèves'}).count());
      assert.ok(!(await page.locator('.hp-activity img').getAttribute('src')).includes('.webp'));
      await page.screenshot({path:`artifacts/redesign/home-${width}.png`,fullPage:true});
      console.log(`PASS: homepage ${width}px, seven sections, three pillars, four commitments, supplied images, confirmed activity only`);
    }
    await page.setViewportSize({width:375,height:900});
    await page.goto(origin);
    const menu=page.getByRole('button',{name:'Ouvrir le menu'});
    await menu.click();
    await page.getByRole('navigation',{name:'Navigation principale'}).getByRole('link',{name:'Nos actions'}).click();
    await page.waitForURL('**/projets');
    assert.equal(await menu.getAttribute('aria-expanded'),'false');
    await menu.click();
    await page.keyboard.press('Escape');
    assert.equal(await menu.evaluate(el=>el===document.activeElement),true);
    await page.goto(origin);
    const links = await page.locator('main a[href^="/"]').evaluateAll(links=>[...new Set(links.map(link=>link.getAttribute('href')))]);
    for (const link of links) {
      await page.goto(origin+link);
      await page.locator('main h1').waitFor();
      assert.equal(await page.locator('.public-error').count(),0,link);
    }
    await page.route('**/images/fondation/hero-communaute.webp',route=>route.abort());
    await page.goto(origin);
    await page.locator('.hp-hero img[src="/images/fallback.svg"]').waitFor();
    await page.unrouteAll();
    assert.deepEqual(errors,[]);
    console.log('PASS: homepage destinations, mobile menu, Escape focus restoration, image failure fallback, no runtime errors');
  } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
