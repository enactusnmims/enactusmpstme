import glob
import re

html_files = glob.glob('*.html')

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Add Gallery after Projects
    content = re.sub(
        r'(All Projects</a></div></li>)(\s*)(<li><a href="history.html">History</a></li>)',
        r'\1\2<li><a href="gallery.html">Gallery</a></li>\2\3',
        content
    )
    
    # Footer replacement
    content = re.sub(
        r'(All Projects</a>)(</div></div>)',
        r'\1<a href="gallery.html">Gallery</a>\2',
        content
    )
    
    if f == 'gallery.html':
        content = content.replace('<a href="gallery.html">Gallery</a></li>', '<a href="gallery.html" class="active">Gallery</a></li>')
        
    with open(f, 'w', encoding='utf-8') as file:
        file.write(content)
