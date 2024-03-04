# Oblikvo

Esperanto for slash, because our game is a FPS. 'Why slash?', you ask. Can you
slash someone? Nope, but it sounds cool.

Our game is a multiplayer FPS, written using socket.io and p5js because our
teacher sure lóves shitty languages.

## Development

This project uses the amazing [Bun runtime](https://bun.sh) coupled with a `Bakefile`, a easy Bash-based replacement for `Makefile`. To build, run [`bake`](https://git.dupunkto.org/meta/dotfiles/tree/bin/bake):

```shell
bake setup # Installs dependencies
bake
```

The bundled, minified JS + sourcemap for the client will be built into the `dist` folder, along with any static assets.

To start the socket.io backend server, run:

```shell
bake serve
```

Additionally, our `Bakefile` also includes a snippet for starting a live server with code reloading. This automatically builds the frontend and watches for code changes while also running a backend server. This is the preferred mode to use in development.

```shell
bake dev
```

## Design ideas

This game was built as a project for computer science. Our aim was to push
ourselves to see if we could defy all expectations and build a 3D multiplayer
game :)

We tried to build a game that we would like ourselves. That means pixelated
retro graphics, fast pacing and multiplayer fun. It also means that the game
should be simple and easy to understand for new players. The premise is simple:
here's a laser gun, have fun!

We might add multiple game modes later, but for now the only game mode will be
"slash". In this game mode, the goal is to get the most kills ("slashes") within
a set timespan of about three minutes. With one caveat however: every time you
respawn, your stats get bumped a little bit; this way the power imbalance between
new players and experienced players will be a little more fair, and hopefully
it will make the game more fun.

Matches are intentionally short and chaotic by design. Short matches make
people go "let's play another one". It creates a rapid feedback loop, and
most people like rapid feedback loops. This makes the game fun, which is one
of the lenses of game design that we needed to implement in our game. We also
incorporate the lens of surprise, by making the rounds unpredictable and
chaotic.

<details>
  <summary>(Other) ways in which we incorporate the element of surprise</summary>

  <ul>
    <li>
      By making a 3D game without any game engine, using a framework that was
      designed for making interactive/generative art and visualisations.
    </li>
    <li>
      By making the game multiplayer, we might surprise our teacher. Same for
      our exotic build pipeline I guess.
    </li>
    <li>
      By making the matches short and chaotic.
    </li>
    <li>
      The main game mechanic of our primary game mode ("slash") is surprising.
    </li>
    <li>
      The name is weird and goofy?
    </li>
  </ul>
</details>

Another game mode we might consider is "teams", in which players could make teams
themselves beforehand.

We wanted the game to be easy to pickup, but also easy to put away again.
We want to build something that is fun, and brings people together, not
something that nurtures addiction.

The game should be played with at least 5 players. They can join in two ways:

- By playing the game in their web browser. It automatically connects to the
  backend of the server it's running on. Only an invite code is needed.

- By playing the game via desktop client (built with Tauri). Think "Open to
  LAN" functionality. When opening your game to LAN, it presents you your
  local and external IP address as well as an invite code. You can send these
  to your friends and they should be able to join by simply entering them in
  their respective clients.

Oblikvo should support multiple input methods. Most notably, mouse/keyboard,
bluetooth controllers (such as Xbox, Playstation and Joycons) and on-screen
touchscreen controls (because we expect our playerbase to primarily play via
their smartphones). This makes the game accessible to a wide audience :)

One of the important design goals of the game is hackability. You should be
able to create levels yourself easily. We're thinking about encoding levels in
a multidimensional array:

```level
1111111111111111
10000000x1111111
100000000x111111
1000000000x11111
10000000000x1111
100000000000x111
1111111111111111
```

```level
1111111111111111
1111111000000X11
1111111000000X11
1111111000000X11
1111111000000X11
1111111000000X11
1111111111111111
```

Above is an example level layout with two floors. A 0 indicates an empty space,
a 1 a filled space, and an x a launchpad. An X is a launchpad that launched you
two blocks high. One block is a little higher than the height of the player.

The game should aesthetically be similar to a classic retro game, like
Wolfenstein 3D. We're thinking of doing that by adding a shader to the end of
our drawing pipeline that pixelates the video buffer. We also want items and
entities to be 2D planes that are always oriented towards the player, similar
to enemies in retro games and dropped items in Minecraft.

There should be as much feedback on player actions as possible. Think FOV
changes while walking, head bobbing, visual knockback when firing a gun,
red vignette when health is low, camera effects when being hit. This makes the
player feel more in control over the game. It also helps immerse the player in the
game (I think). And it looks cool too.

Another cool idea is that there would be no UI. It would be part of the
environment. Think health bars on your gun, enemy health overlaid in a
gradient over their sprite, ammo stats scrolling over the walls.
(This is surprising too?)

## Project structure

### Shared

All code in the `common` folder is used in both the server and client processes. 
That's currently a bunch of types, and:

- `Block`: data for one block of the level.
- `Level`: a class transforming a `Map` (one of the abovementioned types) 
  into a bunch of `Block`s.

### Interfaces

These are used for defining data sent back and forth between the server and client.

- `CommonWorld`: the world state as pushed to the clients.
- `CommonEntity`: positional and movement data for an entity, contained within 
  the `CommonWorld` object.

### Implementations

These interfaces are implemented on the client and server:

- `World` (server) contains logic for running the game, calculating physics etc.
- `World` (client) contains code for rendering the world and all entities in it.
- `Entity` (server) contains logic for moving an entity.
- `Entity` (client) -- doesn't exist yet, because the client only needs the data 
   for drawing entities, no logic needed. I might create an empty class in the future 
   tho, because it's kinda ugly and inconsistent to not have a client side class for 
   this.

