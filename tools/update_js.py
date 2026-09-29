import re

with open('shared.js', 'r', encoding='utf-8') as f:
    js = f.read()

# We want to replace the first line of initTimelineCurve
# From:
# function initTimelineCurve() {
#   const body = document.querySelector('.timeline-body');
#   if (!body) return;
#   body.classList.add('has-curve');
#
# To:
# function initTimelineCurve() {
#   const body = document.querySelector('.timeline-body');
#   if (!body) return;
#   try {
#     body.classList.add('has-curve');
#
# And at the end, replace:
#     entries.forEach(e => {
#       if (e.isIntersecting) {
#         e.target.classList.add('tl-active');
#         e.target.querySelector('.timeline-dot').classList.add('reached');
#         if (e.target.classList.contains('current')) {
#           e.target.querySelector('.timeline-dot').classList.add('pulse-loop');
#         } else {
#           e.target.querySelector('.timeline-dot').classList.add('pulse');
#         }
#       }
#     });
#   }, { threshold: 0.4 });
#   items.forEach(i => obs.observe(i));
# }
#
# To:
# ... same ...
#   }, { threshold: 0.4 });
#   items.forEach(i => obs.observe(i));
#   body.classList.add('tl-ready');
#   } catch (err) {
#     console.error('Timeline error:', err);
#     body.classList.remove('has-curve', 'tl-ready');
#   }
# }

start_target = """function initTimelineCurve() {
  const body = document.querySelector('.timeline-body');
  if (!body) return;
  body.classList.add('has-curve');"""
  
start_replacement = """function initTimelineCurve() {
  const body = document.querySelector('.timeline-body');
  if (!body) return;
  try {
    body.classList.add('has-curve');"""
    
js = js.replace(start_target, start_replacement)

end_target = """  }, { threshold: 0.4 });
  items.forEach(i => obs.observe(i));
}"""

end_replacement = """  }, { threshold: 0.4 });
  items.forEach(i => obs.observe(i));
  body.classList.add('tl-ready');
  } catch(err) {
    console.error('Timeline scrollytelling error:', err);
    body.classList.remove('has-curve', 'tl-ready');
  }
}"""

js = js.replace(end_target, end_replacement)

with open('shared.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated shared.js with try/catch and tl-ready.")
