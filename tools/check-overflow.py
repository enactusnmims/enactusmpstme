import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 390, 'height': 844})
        page = context.new_page()
        page.goto("http://localhost:8000/history.html", wait_until="networkidle")
        
        info = page.evaluate('''() => {
            const bad = [];
            const all = document.querySelectorAll('*');
            for (let el of all) {
                const rect = el.getBoundingClientRect();
                if (rect.right > 390) {
                    bad.push({tag: el.tagName, class: el.className, id: el.id, right: rect.right, width: rect.width});
                }
            }
            return bad;
        }''')
        for i in info:
            print(i)
        browser.close()

if __name__ == '__main__':
    run()
