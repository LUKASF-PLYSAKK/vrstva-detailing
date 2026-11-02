# VRSTVA detailing – Prémiový prodejní web pro auto-detailingové studio

Reprezentativní, responzivní a konverzně optimalizovaná jednostránková webová prezentace (landing page) navržená pro špičkové auto-detailingové studio. Vytvořeno v syrovém, prémiovém automotive & editoriálním stylu inspirovaném značkami jako Porsche, Gyeon a moderními architektonickými ateliéry.

---

## 🏎️ Klíčové vlastnosti a Anti-AI estetika

- **Žádné generické AI šablony:** Žádné neonové fialovo-modré přechody, žádné ilustrace ani přehnané glow efekty.
- **Barevná paleta:** Matná uhlově černá (`#0F0F0F`), tmavě šedá (`#1A1A1A`), čistě bílá typografie a technický akcent v odstínu brzdové žluté (`#F2C200`).
- **Typografie a grid:** Technický bezpatkový font **Space Grotesk** pro nadpisy v kombinaci s čistým čitelným fontem **Inter** pro texty. Asymetrický layout, ostré rohy (`border-radius: 2px`) a tenké precizní dělící linky (`1px solid rgba(255, 255, 255, 0.08)`).
- **Věcný a řemeslný copywriting:** Žádné klišé fráze („Vítejte ve světě dokonalosti“). Důraz na fakta: měření tloušťky laku na každém dílu, světlo 6 500 K, kamerový systém, pojištění do 5 mil. Kč a certifikace chemie (Gyeon, Koch Chemie, Rupes).

---

## 🛠️ Funkce a interaktivní sekce

### 1. Interaktivní „Před a Po“ srovnávače (Before/After Sliders)
- Dva samostatné posuvníky:
  - **Interiér Škoda Octavia III** (mokré tepování, pára, ozon, impregnace)
  - **Exteriér Škoda Octavia III** (dekontaminace, dvoukroková korekce laku, sealant)
- Plynulé ovládání tažením myši i prstu na dotykovém displeji s podporou zachování vertikálního scrollu stránky (`touch-action: pan-y`).
- Plná přístupnost – ovládání klávesnicí (šipky, Home, End) přes nativní `<input type="range">` s dynamickým `aria-valuetext`.
- Jemná nápovědná animace při prvním najetí do zorného pole (IntersectionObserver, respektuje `prefers-reduced-motion`).

### 2. Bento Grid přehled služeb
- Asymetrický přehled 4 klíčových pilířů:
  1. *Hloubkové čištění interiéru*
  2. *Vícekroková korekce laku*
  3. *Aplikace keramické ochrany*
  4. *Předprodejní příprava*
- U každé služby je uveden reálný přínos, položkový rozpis a časová náročnost.

### 3. Transparentní kalkulátor a ceník
- Interaktivní přepínač velikosti vozu (**Hatchback** / **Sedan & Kombi** / **SUV & MPV**) s okamžitou aktualizací cen bez reloadu stránky.
- Přímá provazba z tlačítek „Poptat…“ na předvybrání dané služby ve formuláři.

### 4. 4-krokový průběh zakázky & garance
- Faktický proces: *Inspekce pod světly* ➔ *Bezpečné převzetí* ➔ *Samotný proces* ➔ *Předání a instruktáž*.
- Konkrétní záruky: pojištění dílny na 5 000 000 Kč, 6 kamer se záznamem na 14 dní, napojení na PCO.

### 5. Konverzní poptávkový formulář & rychlý kontakt
- Přímé tlačítko pro **odeslání fotek přes WhatsApp**.
- Formulář s výběrem služby (radio chipy), validací na `blur` (neobtěžuje při psaní), drag-and-drop nahráváním až 5 fotografií s živými náhledy a ochranou proti spamu (honeypot).
- Tmavě stylovaná mapa s přesnou adresou a navigační kartou.
- **Sticky mobilní lišta** (Zavolat / WhatsApp / Ceník) aktivující se po odscrollování hero sekce.

---

## 💻 Technický stack

- **HTML5:** Sémantický kód, validní ARIA atributy, optimalizovaná priorita načítání (`fetchpriority="high"`, `loading="lazy"`).
- **CSS3:** Moderní CSS proměnné, flexbox & grid rozvržení, fluidní typografie přes `clamp()`, podpora RTL/logických vlastností a `prefers-reduced-motion`.
- **Vanilla JavaScript:** Čistý ES6+ kód bez jakýchkoliv externích knihoven nebo frameworků (nulová závislost, bleskové načtení).

---

## 🚀 Spuštění projektu

Projekt nevyžaduje žádný buildovací krok. Stačí otevřít soubor `index.html` v libovolném moderním webovém prohlížeči nebo nasadit na libovolný webhosting či GitHub Pages.
