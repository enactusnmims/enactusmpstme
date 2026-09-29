import glob
import re

html_files = glob.glob('*.html')

for f in html_files:
    if f in ['gallery-preview.html', 'gallery.html']:
        continue
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Nav replacement
    content = re.sub(r'(All Projects</a></div></li>\s*)(<li><a href="history.html">History</a></li>)', r'\1<li><a href="gallery.html">Gallery</a></li>\2', content)
    
    # Or sometimes they are on the same line:
    content = re.sub(r'(All Projects</a></div></li>)(<li><a href="history.html">History</a></li>)', r'\1<li><a href="gallery.html">Gallery</a></li>\2', content)
    
    # Footer replacement
    content = re.sub(r'(Alumni</a>)(\s*)(<a href="history.html">History</a>)', r'\1\2<a href="gallery.html">Gallery</a>\3', content)

    # Rupaantar bug fix
    if f == 'rupaantar.html':
        content = re.sub(r'file:///C:/Users/HP/[^"]+/images/', 'images/', content)
        content = re.sub(r'C:\\\\Users\\\\HP\\\\[^"]+\\\\images\\\\', 'images/', content)
        content = re.sub(r'C:/Users/HP/[^"]+/images/', 'images/', content)
        # Also fix any paths in js array like 'C:\\Users\\HP\\Downloads\\enactusmpstme\\images\\rupa-product-1.jpeg'
        content = re.sub(r'C:\\\\Users\\\\HP\\\\[^\\]+\\\\enactusmpstme\\\\images\\\\', 'images/', content)
        content = re.sub(r'C:[/\\]Users[/\\]HP[/\\][a-zA-Z0-9_\-\\]+[/\\]images[/\\]', 'images/', content)

    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
