import re

with open('projects.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace title
content = content.replace('<title>All Projects - Enactus MPSTME</title>', '<title>Gallery - Enactus MPSTME</title>')

hero_pattern = r'<section class=\"page-hero\">.*?</section>'
new_hero = '''<section class="page-hero">
    <div class="container page-hero-inner">
      <div class="page-hero-eyebrow reveal">Visuals</div>
      <h1 class="page-hero-title reveal">Our <em>Gallery</em></h1>
      <p class="page-hero-sub reveal">A collection of moments from our events, people, and projects.</p>
    </div>
  </section>'''
content = re.sub(hero_pattern, new_hero, content, flags=re.DOTALL)

body_pattern = r'</section>.*?(?=<div class=\"cta-banner\">|<footer>)'
new_body = '''</section>

  <section class="g-wrap"><div class="g-inner"><div id="gSections"></div></div></section>

  '''
content = re.sub(body_pattern, new_body, content, flags=re.DOTALL)

content = re.sub(r'<div class=\"cta-banner\">.*?</div></div></div>\n*', '', content, flags=re.DOTALL)

content = content.replace('<script src="shared.js"></script>', '<script src="gallery-data.js"></script>\n<script src="gallery.js"></script>\n<script src="shared.js"></script>')

# Remove active class from All Projects
content = content.replace('<a href="projects.html" class="active">All Projects</a>', '<a href="projects.html">All Projects</a>')

with open('gallery.html', 'w', encoding='utf-8') as f:
    f.write(content)
