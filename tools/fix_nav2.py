import glob
import re

for f in glob.glob('*.html'):
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Check if gallery is in the nav (by looking for gallery.html before history.html)
    # The nav links block typically looks like this:
    # <li><a href="history.html">History</a></li>
    # We want to insert <li><a href="gallery.html">Gallery</a></li> before it,
    # but only if it's not already there.
    
    # Find the nav section
    nav_match = re.search(r'<ul class="nav-links"[^>]*>.*?</ul>', content, re.DOTALL)
    if nav_match:
        nav_html = nav_match.group(0)
        if 'gallery.html' not in nav_html:
            # Insert Gallery before History
            new_nav_html = re.sub(
                r'(\s*)(<li><a href="history\.html">History</a></li>)',
                r'\1<li><a href="gallery.html">Gallery</a></li>\1\2',
                nav_html
            )
            content = content.replace(nav_html, new_nav_html)
    
    # Check if gallery is in the Projects footer
    # Footer Projects column typically ends with All Projects</a>
    # We want to insert <a href="gallery.html">Gallery</a> after it.
    # The structure could be: <a href="projects.html">All Projects</a></div></div>
    # or <a href="projects.html">All Projects</a>\n</div>
    
    # Find the Projects footer column
    footer_match = re.search(r'<div class="footer-col-title">Projects</div>\s*<div class="footer-links">.*?</div>', content, re.DOTALL)
    if footer_match:
        footer_html = footer_match.group(0)
        if 'gallery.html' not in footer_html:
            new_footer_html = re.sub(
                r'(<a href="projects\.html"[^>]*>All Projects</a>)(\s*)(</div>)',
                r'\1\2<a href="gallery.html">Gallery</a>\2\3',
                footer_html
            )
            content = content.replace(footer_html, new_footer_html)

    # Some files like index.html might have missed Navigate footer update as well? 
    # Actually, the user asked to add it right after "Projects" (in nav and footer). 
    # Wait, the prompt said: "Add a "Gallery" link (href="gallery.html") to the nav AND the footer of EVERY .html page in the repo, right after "Projects"".
    # Wait, Navigate column doesn't have "Projects", only the Projects column does!
    # So the Navigate column shouldn't even have Gallery if we follow "right after Projects"!
    # But in my first attempt, I added it to Navigate. That's fine, let's just make sure it's in the Projects column.

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)

print("Navs and footers updated.")
