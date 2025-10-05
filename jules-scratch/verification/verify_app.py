import re
from playwright.sync_api import Page, expect, sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    try:
        # Navigate to the app
        page.goto("http://127.0.0.1:8080/")

        # --- Registration ---
        page.locator("#show-register").click()
        page.locator("input[name='full_name']").fill("Test User")
        page.locator("input[name='email']").fill("test@example.com")
        page.locator("input[name='username']").fill("testuser")
        page.locator("input[name='password']").fill("password123")
        page.locator("form#register-form button[type='submit']").click()

        # --- Login ---
        # The app should automatically move to the login form after registration
        expect(page.locator("h2")).to_have_text("Login")
        page.locator("input[name='username']").fill("testuser")
        page.locator("input[name='password']").fill("password123")
        page.locator("form#login-form button[type='submit']").click()

        # --- Create a Post ---
        expect(page.locator("h1")).to_have_text("Home")
        page.locator("textarea[name='caption']").fill("This is a test post from Playwright!")
        page.locator("input[name='media_url']").fill("https://via.placeholder.com/150")
        page.locator("form#create-post-form button[type='submit']").click()

        # Wait for the post to appear in the feed
        expect(page.locator(".post-caption p").last).to_contain_text("This is a test post from Playwright!")

        # Take a screenshot of the home page
        page.screenshot(path="jules-scratch/verification/verification.png")

        print("Verification script completed successfully.")

    except Exception as e:
        print(f"An error occurred: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)