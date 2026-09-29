import re
with open('rupaantar.html', 'r', encoding='utf-8') as file:
    content = file.read()

content = re.sub(r'file:///C:/Users/HP/[^"]+/images/', 'images/', content)
content = re.sub(r'C:\\\\Users\\\\HP\\\\[^"]+\\\\images\\\\', 'images/', content)
content = re.sub(r'C:/Users/HP/[^"]+/images/', 'images/', content)
content = re.sub(r'C:\\\\Users\\\\HP\\\\[^\\]+\\\\enactusmpstme\\\\images\\\\', 'images/', content)
content = re.sub(r'C:[/\\]Users[/\\]HP[/\\][a-zA-Z0-9_\-\\]+[/\\]images[/\\]', 'images/', content)

with open('rupaantar.html', 'w', encoding='utf-8') as file:
    file.write(content)
