import sys, re
sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Users\1\Downloads\Squared Website\bookshop.html', 'r', encoding='utf-8') as f:
    c = f.read()

# ── 1. ADD SUPABASE CDN before script.js ─────────────────────────────────────
OLD_CDN = '  <script src="script.js"></script>'
NEW_CDN = '  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>\n  <script src="script.js"></script>'
assert OLD_CDN in c, "CDN anchor not found"
c = c.replace(OLD_CDN, NEW_CDN, 1)

# ── 2. ADD SKELETON CSS before </style> ──────────────────────────────────────
SKEL_CSS = (
    '\n    /* \u2500\u2500\u2500 SKELETON BOOKS \u2500\u2500\u2500 */\n'
    '    .bc-skeleton {\n'
    '      background: #1a1a1a !important;\n'
    '      border-radius: 0 !important;\n'
    '      animation: bc-pulse 1.5s ease-in-out infinite;\n'
    '      pointer-events: none;\n'
    '    }\n'
    '    .bc-skeleton img,\n'
    '    .bc-skeleton .bc-book-fallback,\n'
    '    .bc-skeleton .bc-tip { display: none !important; }\n'
    '    @keyframes bc-pulse {\n'
    '      0%, 100% { opacity: 0.35; }\n'
    '      50%       { opacity: 0.75; }\n'
    '    }\n'
    '  </style>'
)
assert '  </style>' in c, "</style> not found"
c = c.replace('  </style>', SKEL_CSS, 1)

# ── 3. ADD SUPABASE CLIENT INIT at top of IIFE ───────────────────────────────
OLD_STRICT = "    'use strict';\n\n    /* \u2500\u2500\u2500 BOOKS DATA \u2500\u2500\u2500 */"
NEW_STRICT = (
    "    'use strict';\n\n"
    "    /* \u2500\u2500\u2500 SUPABASE CLIENT \u2500\u2500\u2500 */\n"
    "    var sbClient = window.supabase.createClient('YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY');\n\n"
    "    /* \u2500\u2500\u2500 BOOKS DATA (fallback) \u2500\u2500\u2500 */"
)
assert OLD_STRICT in c, "STRICT anchor not found"
c = c.replace(OLD_STRICT, NEW_STRICT, 1)

# ── 4. REPLACE RENDER BOOKS + STAGGERED LOAD with new functions ───────────────
RENDER_START = "    /* \u2500\u2500\u2500 RENDER BOOKS \u2500\u2500\u2500 */"
FILTERS_START = "    /* \u2500\u2500\u2500 FILTERS \u2500\u2500\u2500 */"

ri = c.find(RENDER_START)
fi = c.find(FILTERS_START)
assert ri != -1, "RENDER BOOKS not found"
assert fi != -1, "FILTERS not found"

NEW_RENDER_BLOCK = (
    "    /* \u2500\u2500\u2500 STATE: allBooks \u2500\u2500\u2500 */\n"
    "    var allBooks = [];\n\n"
    "    /* \u2500\u2500\u2500 SUPABASE \u2192 BOOK MAPPING \u2500\u2500\u2500 */\n"
    "    var ACCENT_COLORS = ['#F67A3E','#99B8F1','#FCCA59','#EF97BF','#74A68B'];\n"
    "    var CAT_ROWS = {\n"
    "      'Self-Help': 0, 'Business': 1,\n"
    "      'Philosophy': 2, 'Fiction': 2, 'Nigerian Authors': 3\n"
    "    };\n"
    "    var CAT_ROW_COLORS = {\n"
    "      0: ['#F67A3E','#99B8F1','#FCCA59','#EF97BF','#74A68B'],\n"
    "      1: ['#99B8F1','#F67A3E','#FCCA59','#EF97BF','#74A68B'],\n"
    "      2: ['#FCCA59','#99B8F1','#EF97BF','#F67A3E','#74A68B'],\n"
    "      3: ['#F67A3E','#FCCA59','#EF97BF','#99B8F1','#74A68B']\n"
    "    };\n\n"
    "    function mapSupabaseBooks(data) {\n"
    "      var catIdx = {};\n"
    "      return data.map(function (b) {\n"
    "        var row    = CAT_ROWS[b.category] !== undefined ? CAT_ROWS[b.category] : 0;\n"
    "        var ci     = catIdx[b.category] !== undefined ? catIdx[b.category] : 0;\n"
    "        catIdx[b.category] = ci + 1;\n"
    "        var colors = CAT_ROW_COLORS[row] || ACCENT_COLORS;\n"
    "        var color  = colors[ci % colors.length];\n"
    "        var kobo   = b.price || 0;\n"
    "        var naira  = Math.round(kobo / 100);\n"
    "        var price  = '\u20a6' + naira.toString().replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');\n"
    "        return {\n"
    "          title:       b.title,\n"
    "          author:      b.author,\n"
    "          isbn:        b.isbn || '',\n"
    "          cat:         b.category,\n"
    "          color:       color,\n"
    "          price:       price,\n"
    "          row:         row,\n"
    "          cover_url:   b.cover_url || null,\n"
    "          description: b.description || ''\n"
    "        };\n"
    "      });\n"
    "    }\n\n"
    "    /* \u2500\u2500\u2500 SKELETON LOADING STATE \u2500\u2500\u2500 */\n"
    "    function showSkeletons() {\n"
    "      for (var r = 0; r < 4; r++) {\n"
    "        var track = document.getElementById('bcTrack' + r);\n"
    "        if (!track) continue;\n"
    "        track.innerHTML = '';\n"
    "        for (var s = 0; s < 5; s++) {\n"
    "          var skel = document.createElement('div');\n"
    "          skel.className = 'bc-book bc-skeleton';\n"
    "          track.appendChild(skel);\n"
    "        }\n"
    "      }\n"
    "    }\n\n"
    "    /* \u2500\u2500\u2500 BUILD SHELF \u2500\u2500\u2500 */\n"
    "    function buildShelf(booksData) {\n"
    "      for (var r = 0; r < 4; r++) {\n"
    "        var track = document.getElementById('bcTrack' + r);\n"
    "        if (track) track.innerHTML = '';\n"
    "      }\n\n"
    "      booksData.forEach(function (book, idx) {\n"
    "        var track = document.getElementById('bcTrack' + book.row);\n"
    "        if (!track) return;\n"
    "        var el = document.createElement('div');\n"
    "        el.className = 'bc-book';\n"
    "        el.dataset.idx = idx;\n"
    "        el.dataset.cat = book.cat;\n"
    "        el.dataset.q   = (book.title + ' ' + book.author).toLowerCase();\n"
    "        el.style.setProperty('--glow', book.color);\n\n"
    "        var img = document.createElement('img');\n"
    "        img.className = 'bc-book-img';\n"
    "        img.src   = book.cover_url || ('https://covers.openlibrary.org/b/isbn/' + book.isbn + '-L.jpg');\n"
    "        img.alt   = book.title;\n"
    "        img.loading = 'lazy';\n"
    "        img.onerror = function () {\n"
    "          el.classList.add('bc-no-img');\n"
    "          el.style.background = book.color;\n"
    "        };\n\n"
    "        var fb = document.createElement('div');\n"
    "        fb.className = 'bc-book-fallback';\n"
    "        fb.textContent = book.title;\n\n"
    "        var tip = document.createElement('div');\n"
    "        tip.className = 'bc-tip';\n"
    "        tip.innerHTML =\n"
    "          '<div class=\"bc-tip-title\">' + book.title + '</div>' +\n"
    "          '<div class=\"bc-tip-author\">' + book.author + '</div>' +\n"
    "          '<div class=\"bc-tip-price\">' + book.price + '</div>';\n\n"
    "        el.appendChild(img);\n"
    "        el.appendChild(fb);\n"
    "        el.appendChild(tip);\n\n"
    "        el.addEventListener('click', function () { openModal(book); });\n"
    "        el.addEventListener('mouseenter', function () {\n"
    "          cursor.classList.add('book-hover');\n"
    "          if (!isMobile) setPlatformRow(book.row);\n"
    "        });\n"
    "        el.addEventListener('mouseleave', function () {\n"
    "          cursor.classList.remove('book-hover');\n"
    "        });\n\n"
    "        track.appendChild(el);\n"
    "      });\n\n"
    "      allBooks = document.querySelectorAll('.bc-book');\n\n"
    "      allBooks.forEach(function (b, i) {\n"
    "        setTimeout(function () {\n"
    "          b.classList.add('bc-loaded');\n"
    "          b.style.transition = 'opacity 0.5s ease ' + (i * 30) + 'ms, transform 0.5s ease ' + (i * 30) + 'ms';\n"
    "        }, 80 + i * 30);\n"
    "      });\n"
    "    }\n\n"
    "    /* \u2500\u2500\u2500 LOAD BOOKS FROM SUPABASE \u2500\u2500\u2500 */\n"
    "    function loadBooks() {\n"
    "      showSkeletons();\n"
    "      sbClient\n"
    "        .from('books')\n"
    "        .select('*')\n"
    "        .eq('in_stock', true)\n"
    "        .order('created_at', { ascending: true })\n"
    "        .then(function (result) {\n"
    "          if (result.error) { throw result.error; }\n"
    "          buildShelf(mapSupabaseBooks(result.data));\n"
    "        })\n"
    "        .catch(function (err) {\n"
    "          console.warn('Supabase fetch failed \u2014 using local fallback:', err.message || err);\n"
    "          buildShelf(BOOKS);\n"
    "        });\n"
    "    }\n\n"
)

c = c[:ri] + NEW_RENDER_BLOCK + c[fi:]

# ── 5. ADD loadBooks() CALL before INITIAL PLATFORM POSITION ─────────────────
OLD_INIT = "    /* \u2500\u2500\u2500 INITIAL PLATFORM POSITION \u2500\u2500\u2500 */"
NEW_INIT = (
    "    /* \u2500\u2500\u2500 INITIAL LOAD \u2500\u2500\u2500 */\n"
    "    loadBooks();\n\n"
    "    /* \u2500\u2500\u2500 INITIAL PLATFORM POSITION \u2500\u2500\u2500 */"
)
assert OLD_INIT in c, "INIT PLATFORM anchor not found"
c = c.replace(OLD_INIT, NEW_INIT, 1)

with open(r'C:\Users\1\Downloads\Squared Website\bookshop.html', 'w', encoding='utf-8') as f:
    f.write(c)

print("All 5 changes applied successfully.")
