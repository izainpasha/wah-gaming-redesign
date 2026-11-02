# Wah Gaming Store � homepage concept

A responsive, static homepage mock for wahgamingstore.pk. Includes a procedural Three.js / WebGL keyboard, GSAP entrances and scroll reveals, product filters, mobile navigation, CSS setup illustrations, and reduced-motion support. No build or backend required.

## Preview

Serve this directory over HTTP (ES modules require a server):

```sh
npx --yes serve .
```

## GitHub Pages

Upload **the contents of this folder** to a new GitHub repository, with `index.html` at the repository root. In **Settings ? Pages ? Build and deployment**, choose **Deploy from a branch**, then `main` and `/ (root)`. Save; GitHub will display the published URL after deployment.

All application, image and animation library paths are relative, so repository subpaths work. GSAP and Three.js are vendored locally. Fonts are bundled locally, with system font fallbacks. `.nojekyll` disables unnecessary Jekyll processing.

This is an independent design concept, not a live checkout. Product cards open searches on the original store. Images, product names and sample prices were sourced from the store during this task; prices and availability may change. The 3D keyboard is an original illustrative model, not an exact product representation. No customer data is collected.

## Files

- `index.html` � content and navigation
- `style.css` � responsive design and CSS illustrations
- `app.js` � GSAP, filters, mobile menu, Three.js scene
- `assets/` � product imagery from wahgamingstore.pk
- `vendor/` � GSAP 3.12.5, ScrollTrigger 3.12.5, Three.js 0.160.0 (upstream license notices retained)

The existing Hassan Tech project in the parent directory is unchanged.

