# starblast-bots

A Node.js library for creating and controlling bots in [Starblast](https://starblast.io/).

To prevent bots from entering custom games, add this symbol in the game name : 妛

## Installation

Install the package with npm:

```bash
npm install starblast-bots
```

## Basic example

```js
const { StarblastBot } = require("starblast-bots")

// The bot's information
const bot = new StarblastBot({
    mode: "survival",
    create: false,
    name: "senko",
    hue: 31,
    spectate: false,
    ecpKey: "00000-00000",
    gameLink: "https://starblast.io/#1092@51.255.91.80:3017"
})

async function main() {
    // Make the bot join the game
    try {
        await bot.spawnBot()
        console.log("spawned")
    } catch (error) {
        console.log(error)
    }

    // Shoot while strafing left
    bot.control(["shoot", "strafeLeft"], 0)

    // Stop the inputs and look at an angle of 0 degrees
    bot.control(["look"], 0)

    // Leave the game
    bot.leave()
}

main()
```

## Configuration

A bot is created by passing an options object to `StarblastBot`:

```js
const bot = new StarblastBot({
    mode: "survival",
    create: false,
    name: "senko",
    hue: 31,
    spectate: false,
    ecpKey: "00000-00000",
    gameLink: "https://starblast.io/#1092@51.255.91.80:3017"
})
```

### Options

| Option     | Type      | Description                                     |
| ---------- | --------- | ----------------------------------------------- |
| `mode`     | `string`  | The Starblast game mode.                        |
| `create`   | `boolean` | Whether the bot should create a game.           |
| `name`     | `string`  | The name displayed by the bot.                  |
| `hue`      | `number`  | The bot's hue/color value.                      |
| `spectate` | `boolean` | Whether the bot should spectate.                |
| `ecpKey`   | `string`  | ECP key used by the bot.                        |
| `gameLink` | `string`  | Link to the Starblast game the bot should join. |

## Spawning a bot

Use `spawnBot()` to make the bot connect to the configured game:

```js
await bot.spawnBot()
```

Because `spawnBot()` is asynchronous, it should normally be used with `await`:

```js
try {
    await bot.spawnBot()
    console.log("Bot spawned successfully")
} catch (error) {
    console.error(error)
}
```

## Controlling the bot

The `control()` method can be used to send controls to the bot.

### Shooting and strafing

```js
bot.control(["shoot", "strafeLeft"], 0)
```

This makes the bot shoot while strafing left and looking at an angle of `0` degrees.

### Looking

```js
bot.control(["look"], 0)
```

This changes the bot's look angle to `0` degrees while stopping the other controls.

## Leaving the game

Use `leave()` to disconnect the bot from the game:

```js
bot.leave()
```

## Complete example

```js
const { StarblastBot } = require("starblast-bots")

const bot = new StarblastBot({
    mode: "survival",
    create: false,
    name: "senko",
    hue: 31,
    spectate: false,
    ecpKey: "00000-00000",
    gameLink: "https://starblast.io/#1092@51.255.91.80:3017"
})

async function main() {
    try {
        await bot.spawnBot()
        console.log("spawned")
    } catch (error) {
        console.error(error)
        return
    }

    bot.control(["shoot", "strafeLeft"], 0)

    bot.control(["look"], 0)

    bot.leave()
}

main()
```

## Requirements

* Node.js
* npm
* A valid Starblast game link
* An ECP key if required by the game/bot configuration

## Project structure

A minimal project can look like this:

```text
my-starblast-bot/
├── node_modules/
├── package.json
├── package-lock.json
└── index.js
```

Install the package:

```bash
npm install starblast-bots
```

Then put your bot code in `index.js` and run:

```bash
node index.js
```

## API

### `StarblastBot`

Creates a new Starblast bot.

```js
new StarblastBot(options)
```

### `spawnBot()`

Connects the bot to the configured Starblast game.

```js
await bot.spawnBot()
```

### `control(inputs, angle)`

Controls the bot.

```js
bot.control(["shoot"], 0)
```

Multiple inputs can be provided:

```js
bot.control(["shoot", "strafeLeft"], 0)
```

### `leave()`

Disconnects the bot from the game.

```js
bot.leave()
```

## License

Add your project's license information here.
