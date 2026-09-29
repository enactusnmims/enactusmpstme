import glob
import re

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    nav_match = re.search(r'<ul class="nav-links"[^>]*>.*?</ul>', content, re.DOTALL)
    if nav_match:
        nav_html = nav_match.group(0)
        if 'gallery.html' not in nav_html:
            # We want to insert after the Projects dropdown li ends
            # So find the </li> that comes after <div class="dropdown">...All Projects</a></div>
            # The structure is: <a href="projects.html"[^>]*>All Projects</a></div>\s*</li>
            # We want to replace it with: (same thing) \n        <li><a href="gallery.html">Gallery</a></li>
            
            new_nav_html = re.sub(
                r'(<a href="projects\.html"[^>]*>All Projects</a></div>\s*</li>)',
                r'\1\n      <li><a href="gallery.html">Gallery</a></li>',
                nav_html
            )
            content = content.replace(nav_html, new_nav_html)
            
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Navs updated.")
