#### Note:
Added as submodule in cdp-ui

# Client Usage

Install:

```
npm i -g yarn
yarn
```

Develop:

```
yarn dev
```

Build:

- Generate static HTML in `dist/`

```
yarn build
```

Local Serve:

```
yarn preview
```

Deploy ([surge.sh](https://surge.sh)):

- Use `cp dist/index.html dist/200.html` before deploy, to render SPA on `/*`

```
npm i -g surge
surge dist
```
