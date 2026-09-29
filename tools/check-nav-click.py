import os
import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1024, 'height': 768})
        page = context.new_page()
        page.goto("http://localhost:8000/history.html", wait_until="networkidle")
        
        # Mimic scroll sequence
        page.evaluate("window.scrollTo(0, document.body.scrollHeight/2)")
        time.sleep(1.0)
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        time.sleep(1.0)
        
        items = ["y2012", "y2015", "y2018", "y2019", "y2020", "y2021", "y2022", "y2025"]
        for i_id in items:
            page.evaluate(f"document.getElementById('{i_id}').scrollIntoView({{block: 'center'}})")
            time.sleep(0.5)
        
        page.evaluate("window.scrollTo(0, 0)")
        time.sleep(0.5)
        
        info = page.evaluate('''() => {
            const item = document.querySelector(".timeline-nav-item[data-target='y2019']");
            if (!item) return "Not found";
            const rect = item.getBoundingClientRect().toJSON();
            const style = window.getComputedStyle(item);
            return {
                rect: rect,
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity
            };
        }''')
        print(info)
        
        try:
            page.click(".timeline-nav-item[data-target='y2019']", timeout=5000)
            print("Click successful!")
        except Exception as e:
            print("Click failed:", e)
            
        browser.close()

if __name__ == '__main__':
    run()
