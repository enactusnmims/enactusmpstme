import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1024, 'height': 768})
        page = context.new_page()
        page.goto("http://localhost:8000/history.html", wait_until="networkidle")
        
        info = page.evaluate('''() => {
            const item = document.querySelector(".timeline-nav-item[data-target='y2019']");
            if (!item) return "Not found";
            const rect = item.getBoundingClientRect().toJSON();
            const style = window.getComputedStyle(item);
            return {
                rect: rect,
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                pointerEvents: style.pointerEvents,
                html: item.outerHTML
            };
        }''')
        print(info)
        
        browser.close()

if __name__ == '__main__':
    run()
