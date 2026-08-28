/**
 * Extra admin CRUD coverage beyond e2e/admin.spec.ts.
 */
import { expect, test } from "@playwright/test";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const configured = Boolean(process.env.DATABASE_URL && process.env.AUTH_SECRET && email && password);

test.describe("admin crud coverage", () => {
  test.skip(!configured, "Requires DATABASE_URL, AUTH_SECRET, and admin credentials.");

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel("Password").fill(password!);
    await page.getByRole("button", { name: /Sign in/i }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test("overview shows live database content", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Welcome" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Manage programs/i })).toBeVisible();
  });

  test("programs list shows seeded Piano row", async ({ page }) => {
    await page.goto("/admin/programs");
    await expect(page.getByRole("link", { name: /Piano/i }).first()).toBeVisible();
  });

  test("testimonial save persists", async ({ page }) => {
    await page.goto("/admin/testimonials");
    const quote = page.getByLabel("What they said").first();
    const original = await quote.inputValue();
    const marker = `Admin CRUD check ${Date.now()}.`;
    const nextValue = `${marker} ${original}`.slice(0, 600);

    await quote.fill(nextValue);
    await page.getByRole("button", { name: "Save review" }).first().click();
    await expect(page.getByText("Testimonial saved.")).toBeVisible();

    await page.reload();
    await expect(quote).toHaveValue(nextValue);

    await quote.fill(original);
    await page.getByRole("button", { name: "Save review" }).first().click();
    await expect(page.getByText("Testimonial saved.")).toBeVisible();
  });

  test("gallery page explains file-based photos", async ({ page }) => {
    await page.goto("/admin/gallery");
    await expect(page.getByRole("heading", { name: "Photo Gallery" })).toBeVisible();
    await expect(page.getByText(/gallery folder/i)).toBeVisible();
  });

  test("class time can be added", async ({ page }) => {
    await page.goto("/admin/programs/piano");

    const addForm = page
      .locator("form")
      .filter({ has: page.getByRole("button", { name: "Add class time" }) });
    await addForm.getByLabel("Day of the week").selectOption("5");
    await addForm.getByLabel("Class starts at").fill("22:45");
    await addForm.getByLabel("Class length").selectOption("60");
    await addForm.getByLabel("Maximum students").fill("4");
    await addForm.getByRole("button", { name: "Add class time" }).click();
    await expect(page.getByText("Class time added.")).toBeVisible();
    await expect(page.locator('input[name="startTime"][value="22:45"]').last()).toBeVisible();
  });
});
