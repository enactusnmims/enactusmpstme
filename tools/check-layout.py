import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1440, 'height': 900})
        page = context.new_page()
        page.goto("http://localhost:8000/history.html", wait_until="networkidle")
        
        children = page.evaluate('''() => {
            const item = document.getElementById('y2012');
            return Array.from(item.children).map(c => ({
                tag: c.tagName,
                className: c.className,
                rect: c.getBoundingClientRect().toJSON(),
                cssDisplay: window.getComputedStyle(c).display,
                cssPos: window.getComputedStyle(c).position
            }));
        }''')
        for c in children:
            print(c)
        
        body_rect = page.evaluate("document.querySelector('.timeline-body').getBoundingClientRect().toJSON()")
        print("Body Rect:", body_rect)
        
        browser.close()

if __name__ == '__main__':
    run()
