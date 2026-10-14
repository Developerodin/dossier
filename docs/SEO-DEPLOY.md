# TechDossier indexing deploy

Canonical host is `https://techdossier.org` (non-www). Do not switch canonicals, sitemaps, or `NEXT_PUBLIC_SERVER_URL` to `www`. Google has already selected the non-www host.

This deploy does two things:

1. `www` stops being a second copy of the site (nginx 301, plus an in-app 308 if a request still reaches Next.js).
2. `posts-sitemap.xml` stops emitting `<image:loc>undefined</image:loc>`, which is why Google rejected that sitemap.

`llms.txt`, `llms-full.txt`, and `agents.md` are already generated from the CMS. No content change is required for those.

## 1. Apply the nginx redirect

The live site is nginx on Ubuntu. The app-level redirect in `redirects.ts` is a fallback. nginx must do the redirect first, or Google keeps crawling `www` as a `200`.

Config to add: [`deploy/nginx-techdossier.conf`](../deploy/nginx-techdossier.conf).

```bash
sudo cp deploy/nginx-techdossier.conf /etc/nginx/sites-available/techdossier-www-redirect.conf
sudo ln -sf /etc/nginx/sites-available/techdossier-www-redirect.conf /etc/nginx/sites-enabled/techdossier-www-redirect.conf
```

Before reload:

- Remove `www.techdossier.org` from the existing app `server_name`. That block should only serve `techdossier.org`.
- If port 80 for `techdossier.org` is already redirected to HTTPS, remove `techdossier.org` from the new port-80 `server_name` so the two blocks do not both claim it. Keep `www.techdossier.org` there.
- Point `ssl_certificate` and `ssl_certificate_key` at the certificate the apex server already uses. The cert must include `www.techdossier.org`. If it does not:

```bash
sudo certbot certonly --nginx -d techdossier.org -d www.techdossier.org
```

```bash
sudo nginx -t && sudo systemctl reload nginx
```

## 2. Confirm the production URL

On the server that builds the app, production env must be:

```bash
NEXT_PUBLIC_SERVER_URL=https://techdossier.org
```

No trailing slash. This value feeds canonical tags, Open Graph, JSON-LD, every sitemap, `robots.txt`, `llms.txt`, and `agents.md`.

## 3. Rebuild and restart

The live `posts-sitemap.xml` is still the old build (every image location is the text `undefined`). Pull this commit, rebuild, and restart the Next.js process (pm2, systemd, or whatever the box uses). A reload of nginx alone does not ship the sitemap fix.

After restart, the posts sitemap cache refreshes within an hour (`revalidate: 3600`). To force it immediately, restart the Node process so the in-memory cache is empty, then request the sitemap once.

## 4. Verify before touching Search Console

Redirect (must be 301 to the apex, same path):

```bash
curl -sI https://www.techdossier.org/ | head -n 20
curl -sI https://www.techdossier.org/posts | head -n 15
curl -sI https://www.techdossier.org/contact | head -n 15
curl -sI http://techdossier.org/ | head -n 15
```

Expect `301` (nginx) and `Location: https://techdossier.org/...`. The apex itself stays `200`:

```bash
curl -sI https://techdossier.org/ | head -n 15
```

Sitemap (must not contain the text `undefined`, and image locations must be absolute `https://` URLs):

```bash
curl -s https://techdossier.org/posts-sitemap.xml | head -c 2500
curl -s https://techdossier.org/posts-sitemap.xml | grep -c 'undefined'
curl -s https://techdossier.org/posts-sitemap.xml | grep -o '<image:loc>[^<]*</image:loc>' | head
```

`grep -c undefined` must print `0`.

Canonical host on a www request, after the redirect is followed, and on the apex directly:

```bash
curl -sL https://www.techdossier.org/ | grep -o 'rel="canonical" href="[^"]*"'
curl -s https://techdossier.org/contact | grep -o 'rel="canonical" href="[^"]*"'
curl -s https://techdossier.org/posts/startup-funding-is-back-the-biggest-funding-signals-from-august-2026 | grep -o 'rel="canonical" href="[^"]*"'
```

Each canonical must start with `https://techdossier.org` and must not contain `www`.

## 5. Google Search Console (manual)

Property is the domain property `techdossier.org`. Use non-www URLs only.

1. Sitemaps: open the existing `posts-sitemap.xml` entry. If it still shows an error, remove it and submit `https://techdossier.org/posts-sitemap.xml` again. Also confirm `sitemap.xml`, `pages-sitemap.xml`, `categories-sitemap.xml`, and `news-sitemap.xml` are submitted.
2. URL Inspection: inspect `https://techdossier.org/` and 5 to 10 important non-www article URLs that are in "Discovered - currently not indexed". Confirm Google sees the user-declared canonical as `https://techdossier.org/...`, then use Request indexing.
3. Page indexing: open "Alternate page with proper canonical tag" and "Duplicate without user-selected canonical" and start Validate fix. Those www URLs should disappear after Google recrawls the 301.
4. Leave "Discovered - currently not indexed" to be recrawled. A valid sitemap plus one host is what unblocks it. Full recovery takes days to a couple of weeks; it is not a second code change.

Do not request indexing for `www` URLs, `/api/media/file/`, `/_next/`, or `favicon.ico`. Those are not pages.
