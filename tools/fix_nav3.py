import glob
import re

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Check if gallery is in the Projects footer
    footer_match = re.search(r'<div class="footer-col-title">Projects</div>\s*<div class="footer-links">.*?</div>', content, re.DOTALL)
    if footer_match:
        footer_html = footer_match.group(0)
        if 'gallery.html' not in footer_html:
            new_footer_html = re.sub(
                r'(<a href="projects\.html"[^>]*>All Projects</a>)(\s*)(</div>)',
                r'\1\2  <a href="gallery.html">Gallery</a>\n\3',
                footer_html
            )
            content = content.replace(footer_html, new_footer_html)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
