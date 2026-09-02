import os

img_dir = 'C:/agente_threadwell/NetLab_Game/img'

router_svg = """<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M10,35 v40 a40,15 0 0,0 80,0 v-40" fill="#005073" stroke="#fff" stroke-width="2"/>
  <ellipse cx="50" cy="35" rx="40" ry="15" fill="#0073a5" stroke="#fff" stroke-width="2"/>
  <!-- Arrows -->
  <path d="M50,25 l-10,10 h8 v15 h4 v-15 h8 z" fill="#fff"/>
  <path d="M50,45 l10,-10 h-8 v-15 h-4 v15 h-8 z" fill="#fff"/>
  <path d="M25,35 l10,-10 v8 h15 v4 h-15 v8 z" fill="#fff"/>
  <path d="M75,35 l-10,10 v-8 h-15 v-4 h15 v-8 z" fill="#fff"/>
</svg>"""

switch_svg = """<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="40" width="80" height="30" fill="#005073" stroke="#fff" stroke-width="2"/>
  <polygon points="10,40 30,25 90,25 70,40" fill="#0073a5" stroke="#fff" stroke-width="2"/>
  <polygon points="90,25 90,55 70,70 70,40" fill="#003b54" stroke="#fff" stroke-width="2"/>
  <!-- Double arrows -->
  <path d="M25,36 h40 l-5,-5 v3 l15,7 l-15,7 v-3 h-40 z" fill="#fff"/>
  <path d="M75,47 h-40 l5,5 v-3 l-15,-7 l15,-7 v3 h40 z" fill="#fff"/>
</svg>"""

firewall_svg = """<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="15" y="20" width="70" height="60" rx="10" fill="#d11241" stroke="#fff" stroke-width="2"/>
  <line x1="15" y1="40" x2="85" y2="40" stroke="#fff" stroke-width="3"/>
  <line x1="15" y1="60" x2="85" y2="60" stroke="#fff" stroke-width="3"/>
  <line x1="40" y1="20" x2="40" y2="40" stroke="#fff" stroke-width="3"/>
  <line x1="65" y1="40" x2="65" y2="60" stroke="#fff" stroke-width="3"/>
  <line x1="35" y1="60" x2="35" y2="80" stroke="#fff" stroke-width="3"/>
</svg>"""

rack_svg = """<svg viewBox="0 0 100 200" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="80" height="180" rx="5" fill="#111" stroke="#444" stroke-width="4"/>
  <rect x="15" y="15" width="10" height="170" fill="#222"/>
  <rect x="75" y="15" width="10" height="170" fill="#222"/>
  <g fill="#555">"""
for y in range(20, 180, 8):
    rack_svg += f'<rect x="18" y="{y}" width="4" height="2"/><rect x="78" y="{y}" width="4" height="2"/>'
rack_svg += """  </g>
</svg>"""

with open(os.path.join(img_dir, 'router.svg'), 'w') as f: f.write(router_svg)
with open(os.path.join(img_dir, 'switch.svg'), 'w') as f: f.write(switch_svg)
with open(os.path.join(img_dir, 'firewall.svg'), 'w') as f: f.write(firewall_svg)
with open(os.path.join(img_dir, 'rack.svg'), 'w') as f: f.write(rack_svg)
