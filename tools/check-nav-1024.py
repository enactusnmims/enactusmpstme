import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1024, 'height': 768})
        page = context.new_page()
        page.goto("http://localhost:8000/history.html", wait_until="networkidle")
        
        info = page.evaluate('''() => {
            const nav = document.querySelector('.timeline-nav');
            const body = document.querySelector('.timeline-body');
            const item = document.querySelector('.timeline-item');
            return {
                nav: nav.getBoundingClientRect().toJSON(),
                body: body.getBoundingClientRect().toJSON(),
                item: item.getBoundingClientRect().toJSON(),
                navDisplay: window.getComputedStyle(nav).display
            };
        }''')
        print(info)
        
        page.screenshot(path='tools/out/timeline-1024-nav-test.png')
        browser.close()

if __name__ == '__main__':
    run()
