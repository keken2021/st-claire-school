import { expect, test } from "@playwright/test";

/**
 * Admin CRUD needs a real database, so these skip themselves when one is not
 * configured. CI provides Postgres as a service container; locally they run once
 * DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL, and ADMIN_PASSWORD are set.
 */
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const configured = Boolean(process.env.DATABASE_URL && process.env.AUTH_SECRET && email && password);

test.describe("admin", () => {
  test.skip(!configured, "Requires DATABASE_URL, AUTH_SECRET, and admin credentials.");

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("rejects the wrong password without revealing whether the account exists", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill("definitely-not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByRole("alert")).toContainText("did not match an account");
    await expect(page).toHaveURL(/\/login/);
  });

  test("an edited description reaches the public program page", async ({ page }) => {
    const marker = `Updated in an end-to-end test at ${Date.now()}.`;

    await page.goto("/admin/programs");
    await page.getByRole("link", { name: /Piano/ }).first().click();

    const description = page.getByLabel("Short description");
    const original = await description.inputValue();

    await description.fill(`${marker} ${original}`);
    await page.getByRole("button", { name: "Save program" }).click();
    await expect(page.getByText("Program saved.")).toBeVisible();

    // The public page is statically generated, so this only passes if the
    // revalidation triggered by the server action actually worked.
    await page.goto("/programs/piano");
    await expect(page.getByText(marker)).toBeVisible();

    // Leave the fixture as we found it.
    await page.goto("/admin/programs/piano");
    await page.getByLabel("Short description").fill(original);
    await page.getByRole("button", { name: "Save program" }).click();
    await expect(page.getByText("Program saved.")).toBeVisible();
  });

  test("refuses to enrol more students than a class has seats", async ({ page }) => {
    await page.goto("/admin/programs/piano");

    const capacity = page.getByLabel("Capacity").first();
    await capacity.fill("2");

    const enrolled = page.locator('input[name="enrolledCount"]').first();
    await enrolled.evaluate((node: HTMLInputElement) => {
      node.value = "40";
    });

    await page.getByRole("button", { name: "Save time" }).first().click();

    await expect(page.getByText("Enrolled cannot exceed capacity.")).toBeVisible();
  });

  test("the insights dashboard loads without any recorded events", async ({ page }) => {
    await page.goto("/admin/insights");

    await expect(page.getByRole("heading", { name: "Inquiry Insights" })).toBeVisible();
    await expect(page.getByText(/no names, no contact details/i)).toBeVisible();
  });
});
