# TODOS

- [x] Add different keys
- [x] Start balls at the top
- [x] Calculate velocity for realignment
- [x] Start from contact point again, to make them realign there.

## Ideas

- [ ] Increase number of balls each hit
- [ ] Put all the balls inside eachother with different low opacities.(faster=smaller)
- [ ] Try horizontal movement

## Remotion video with Tailwind

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.gif">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npm start
```

**Render video**

```console
npm run build
```

**Upgrade Remotion**

```console
npm run upgrade
```

## Using server-side rendering

This template uses a [custom Webpack override](https://www.remotion.dev/docs/webpack). If you are using server-side rendering, you need to import the override function from `./src/webpack-override.ts` and pass it to [`bundle()`](https://www.remotion.dev/docs/bundle) (if using SSR) and [`deploySite()`](https://www.remotion.dev/docs/lambda/deploysite) (if using Lambda).

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

Get started with Tailwind by reading the ["Utility first" page](https://tailwindcss.com/docs/utility-first)

## Help

We provide help [on our Discord server](https://remotion.dev/discord).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/remotion-dev/remotion/issues/new).

## License

Note that for some entities a company license is needed. Read [the terms here](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md).
