import { expect, test } from "playwright/test";

const criticalRoutes = [
  { path: "/", heading: /DevDocs/ },
  { path: "/git", heading: /Aprenda Git/ },
  { path: "/shell", heading: /Domine o Shell/ },
  { path: "/commands", heading: /Comandos Git/ },
];

test.describe("critical routes", () => {
  for (const route of criticalRoutes) {
    test(`${route.path} renders without a blank screen`, async ({ page }) => {
      await page.goto(route.path);

      await expect(page.locator("#root")).toBeVisible();
      await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible();
      await expect(page.getByText("404")).toHaveCount(0);

      const bodyTextLength = await page.locator("body").evaluate((body) => body.innerText.trim().length);
      expect(bodyTextLength).toBeGreaterThan(80);
    });
  }

  test("navigates between Hub, GitDoc, and ShellDoc", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /GitDoc/ }).first().click();
    await expect(page).toHaveURL(/\/git$/);
    await expect(page.getByRole("heading", { name: /Aprenda Git/ })).toBeVisible();

    await page.getByRole("link", { name: /DevDocs/ }).first().click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("heading", { name: /DevDocs/ })).toBeVisible();

    await page.getByRole("link", { name: /ShellDoc/ }).first().click();
    await expect(page).toHaveURL(/\/shell$/);
    await expect(page.getByRole("heading", { name: /Domine o Shell/ })).toBeVisible();
  });
});
