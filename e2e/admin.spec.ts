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

  test("rejects the wrong password without revealing whether the account exists", async ({
    page,
  }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill("definitely-not-the-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Those details did not match an account.")).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test.describe("authenticated", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("/login");
      await page.getByLabel("Email").fill(email!);
      await page.getByLabel("Password").fill(password!);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/admin$/);
    });

    test("an edited description reaches the public program page", async ({ page }) => {
      const marker = `Updated in an end-to-end test at ${Date.now()}.`;

      await page.goto("/admin/programs");
      await page.getByRole("link", { name: /Piano/ }).first().click();

      const description = page.getByLabel("Short description");
      const original = await description.inputValue();

      await description.fill(`${marker} ${original}`.slice(0, 400));
      await page.getByRole("button", { name: "Save program" }).click();
      await expect(page.getByText("Program saved.")).toBeVisible();

      // Prove the write hit the database (admin is force-dynamic).
      await page.reload();
      await expect(page.getByLabel("Short description")).toHaveValue(
        new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      );

      // Public pages are statically generated; revalidatePath should refresh them.
      await page.goto("/programs/piano");
      await page.reload();
      await expect(page.getByText(marker)).toBeVisible({ timeout: 15_000 });

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
});
