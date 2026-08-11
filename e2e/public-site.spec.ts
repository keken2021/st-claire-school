import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const ROUTES = ["/", "/programs", "/programs/piano", "/programs/find", "/faq", "/visit"];

test.describe("public site", () => {
  test("program pages are server rendered and carry Course structured data", async ({
    page,
  }) => {
    const response = await page.goto("/programs/ballet");
    const html = (await response?.text()) ?? "";

    // Rendered on the server, which is the whole point of leaving the SPA behind.
    expect(html).toContain("Ballet");
    expect(html).toContain('"@type":"Course"');
    expect(html).toContain('"@type":"BreadcrumbList"');

    await expect(page.getByRole("heading", { level: 1, name: "Ballet" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Class times" })).toBeVisible();
  });

  test("the FAQ page publishes FAQPage structured data", async ({ page }) => {
    const response = await page.goto("/faq");
    expect((await response?.text()) ?? "").toContain('"@type":"FAQPage"');
  });

  test("the sitemap lists every program", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    const xml = await response.text();

    expect(xml).toContain("/programs/piano");
    expect(xml).toContain("/programs/academic-tutorials");
    expect(xml).toContain("/programs/find");
  });

  test("robots keeps crawlers out of the admin area", async ({ request }) => {
    const body = await (await request.get("/robots.txt")).text();

    expect(body).toContain("Disallow: /admin");
    expect(body).toContain("Sitemap:");
  });

  test("the old contact URL redirects to the visit hub", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveURL(/\/visit$/);
  });

  test("the visit page offers Messenger and a phone fallback, and no form", async ({ page }) => {
    await page.goto("/visit");

    await expect(page.getByRole("link", { name: /Ask on Messenger/ }).first()).toBeVisible();
    await expect(page.locator('a[href^="tel:"]').first()).toBeVisible();
    await expect(page.locator("form")).toHaveCount(0);
  });

  test("/admin redirects an anonymous visitor to sign in", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login/);
  });

  for (const route of ROUTES) {
    test(`${route} has no detectable accessibility violations`, async ({ page }) => {
      await page.goto(route);

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      // Reported per node so a failure names the element to fix, not just the rule.
      const failures = violations.flatMap((violation) =>
        violation.nodes.map(
          (node) =>
            `${violation.id} at ${node.target.join(" ")} — ${node.failureSummary?.replace(/\s+/g, " ")}`
        )
      );

      expect(failures).toEqual([]);
    });
  }
});
