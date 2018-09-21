# @ngfx

[![Join the chat at https://gitter.im/ngfx-dev/Lobby](https://badges.gitter.im/ngfx-dev/Lobby.svg)](https://gitter.im/ngfx-dev/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

#### Angular Component Library

This repository is a development environment for the `@ngfx` Component library. This project includes patterns for UI development that keep popping up in the course of developing creative applications using Angular.

## Packages

| Package | Description                                          |
| ------- | :--------------------------------------------------- |
| rtc     | A service for connecting p2p over WebRTC DataChannel |
| ui      | UI component library for gaming and creative apps    |

## NgFxControl

![Example of UI Contoller built with @ngfx/ui](assets/ui-controls.png)

NEW in 1.0.0-beta.3!

Sliders, joysticks, and buttons transmit messages over WebRTC DataChannel with `@ngfx/rtc`.

## Install

`@ngfx` is distributed as a scoped package on `npm`. All packages are provided under this namespace.

`npm i @ngfx/rtc @ngfx/ui`
`yarn add @ngfx/rtc @ngfx/ui`

## Wiki

For more information about the ngfx library [visit the wiki](https://github.com/steveblue/ngfx/wiki/@ngfx).

## Contributing

If you are interested in contributing, fork the repository and submit pull requests targeting the develop branch.

## Support

Get help in the [ngfx Gitter](https://gitter.im/ngfx-dev/Lobby?utm_source=share-link&utm_medium=link&utm_campaign=share-link)

## Roadmap

| Package | Description                                             |
| ------- | :------------------------------------------------------ |
| canvas  | Supports working with `<canvas>` and `<svg>`            |
| gl      | Bridges the gap between Angular and WebGL               |
| audio   | Supports working with `<audio>` tag and Web Audio API   |
| video   | Supports building a video player with the `<video>` tag |

This project is built with [angular-rollup](https://github.com/steveblue/angular2-rollup#readme).
