import { expect, test } from "@playwright/test";

/**
 * The finder is the site's conversion path, so this walks it end to end and
 * asserts the two things that actually matter commercially: the answers survive
 * in the URL, and the Messenger link carries the right program.
 */
test.describe("program finder", () => {
  test("answers accumulate in the URL and produce a Messenger handoff", async ({ page }) => {
    await page.goto("/programs/find");

    await expect(page.getByRole("heading", { name: "How old is your child?" })).toBeVisible();
    await page.getByRole("button", { name: "6", exact: true }).click();
    await expect(page).toHaveURL(/age=6/);

    await expect(page.getByRole("heading", { name: "What are they drawn to?" })).toBeVisible();
    await page.getByText("Dance & Movement").click();
    await expect(page).toHaveURL(/interest=movement/);

    await page.getByText("Complete beginner").click();
    await expect(page).toHaveURL(/exp=none/);

    await page.getByText("Weekends", { exact: true }).click();
    await expect(page).toHaveURL(/when=weekend/);

    // Results
    const results = page.getByRole("listitem").filter({ has: page.getByRole("heading") });
    await expect(results.first()).toBeVisible();
    await expect(page.getByText("Best match")).toBeVisible();

    const messengerLink = page.getByRole("link", { name: /^Ask about / }).first();
    const href = await messengerLink.getAttribute("href");

    expect(href).toContain("https://m.me/");
    expect(href).toContain("ref=");
    // Attribution says the click came from a finder result.
    expect(decodeURIComponent(href ?? "")).toContain("s-finder_result");
  });

  test("a shared result URL renders the same recommendations directly", async ({ page }) => {
    await page.goto("/programs/find?age=6&interest=movement&exp=none&when=weekend");

    await expect(page.locator("main").getByRole("heading", { level: 2 })).toContainText(/match/i);
    await expect(page.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "4");
  });

  test("a child below every minimum age still gets a useful answer", async ({ page }) => {
    await page.goto("/programs/find?age=3&interest=music&exp=none&when=either");

    await expect(page.getByRole("heading", { name: /Almost ready for us/i })).toBeVisible();
    await expect(page.getByText(/Our earliest programs start at age/)).toBeVisible();
    await expect(page.getByRole("link", { name: /waitlist/i }).first()).toBeVisible();
  });

  test("Back removes the most recent answer", async ({ page }) => {
    await page.goto("/programs/find?age=6&interest=music");

    await page.getByRole("button", { name: "Back" }).click();

    await expect(page).not.toHaveURL(/interest=/);
    await expect(page.getByRole("heading", { name: "What are they drawn to?" })).toBeVisible();
  });
});
