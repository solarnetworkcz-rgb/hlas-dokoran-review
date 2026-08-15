# Hlas Dokořán Studio review — povinná pravidla projektu Vývoj

Projekt dědí povinnou `VYVOJ_POLICY.json` a kanonická pravidla z `solarnetworkcz-rgb/solarnetwork`. Tento soubor doplňuje strojovou policy o konkrétní kontrakt statického zákaznického webu publikovaného z `main` přes GitHub Pages.

## Nejvyšší invarianty

1. `main` je publikační zdroj; změna na `main` je proto potenciálně uživatelsky viditelná změna, nikoli jen interní commit.
2. Statický web nesmí obsahovat secrets, lokální cesty, neveřejná zákaznická data ani omylem publikované pracovní soubory.
3. Odkazy, assets a routy musí fungovat z GitHub Pages subpath, ne pouze z lokálního `/` rootu.
4. 404/deep-link chování a relativní cesty jsou součást release kontraktu.
5. Prezentační PDF a web jsou dva distribuované artefakty; změna verze/obsahu jednoho nesmí vytvářet neoznačený rozpor s druhým.

## Nejrizikovější lessons

Povinně zvaž zejména:
- DEV-024/032 — commit/deploy není automaticky result verified,
- DEV-026/031/065 — skutečný repo/branch a publikační ref,
- DEV-030/049 — secrets, pracovní/exportní artefakty a klientská data nepatří do veřejného webu,
- DEV-034 — změna navigace/linků/assets se mění atomicky se všemi konzumenty,
- DEV-042/059/061 — responsive, accessibility, route→render a deep-link coverage,
- DEV-050 — žádné skryté dependency/registry předpoklady,
- DEV-052/057 — reprodukovatelný smoke a uložená failure evidence,
- DEV-064 — nepředpokládat build/deploy mechanismus; tento projekt je statický branch-based Pages web, dokud repo neprokáže jinak.

## Lokální invarianty

1. **Subpath-safe odkazy.** Interní odkazy, obrázky, CSS/JS a PDF odkazy se testují na skutečné Pages cestě `/<repository>/`, ne pouze přes file:// nebo localhost root.
2. **Case sensitivity.** Jména assetů/stránek se ověřují přesně včetně velikosti písmen; Windows lokální PASS nesmí maskovat case-sensitive hosting chybu.
3. **No broken public assets.** Každý odkazovaný lokální asset musí existovat v commitu; orphan/broken URL je release blocker.
4. **Responsive smoke.** Hlavní stránka a všechny stránky v `pages/` se kontrolují minimálně na mobilním a desktop viewportu bez horizontálního overflow, překrytých ovládacích prvků nebo nečitelných textů.
5. **Accessibility minimum.** Obrázky mají smysluplný alt podle role, interaktivní prvky dostupný název, headings logickou strukturu a keyboard focus tam, kde je interaktivita.
6. **404/deep link.** `404.html` se nesmí rozbít při změně navigace; přímý vstup na známé cesty nesmí vytvořit nečekanou slepou stránku.
7. **Publikační diff review.** Před změnou `main` se zkontroluje, zda diff nepřidává do veřejného repa logy, temp, exportní mezisoubory, osobní údaje, API keys nebo neveřejnou pracovní dokumentaci.
8. **PDF version parity.** Pokud web tvrdí konkrétní verzi/stav prezentace, odpovídající PDF musí být skutečně ta verze; starý soubor se nesmí vydávat za nový jen změnou textu odkazu.
9. **Žádný falešný CI stav.** `VYVOJ_POLICY.json` říká, že GitHub Actions nejsou požadované a jsou záměrně vypnuté. To nesmí být zobecněno na jiné projekty a při změně deploy mechanismu se policy musí aktualizovat spolu s realitou.
10. **Publikace se ověřuje po deployi.** Lokální kontrola HTML není důkaz dostupnosti GitHub Pages; release state vyžaduje cílový HTTP/render smoke skutečné veřejné verze, pokud je změna určena k publikaci.

## Definition of Done

- repo/branch `main` ověřeny před zápisem,
- všechny lokální linky/assets existují,
- subpath/case-sensitive kontrola PASS,
- hlavní a `pages/` route smoke PASS,
- mobilní + desktop responsive smoke,
- secret/client-data/publication hygiene scan,
- PDF/web parity při změně prezentace,
- po publikaci cílový Pages smoke a konkrétní SHA/ref.

## Incident loop

Každá chyba: reprodukce → root cause → detection gap → regression/link/render check → nový PASS původního symptomu → lesson. Druhý stejný výskyt zpřísňuje společný gate; třetí je architektonický/publikační incident.