# Oblikvo

Esperanto for slash, because our game is a FPS. 'Why slash?', you ask. Can you
slash someone? Nope, but it sounds cool.

Our game is a multiplayer FPS, written using socket.io and p5js because our
teacher sure lóves shitty languages.

## Development

This project uses [Bake](https://git.dupunkto.org/meta/dotfiles/tree/bin/bake). To build the project, simply run it:

```shell
bake
```

The `dist` folder will contain the bundled, minified JS + sourcemap to put on your server :)
(We have a sourcemap because I like it if people can read the code)

Additionally, our `Bakefile` also includes a snippet for starting a live server with code reloading:

```shell
bake serve
```

## Design ideas

The goal is to get the most kills ("slashes") within a set timespan of about three
minutes. With one caveat however: every time you respawn, your stats get bumped
a little bit; this way the power imbalance between new players and experienced
players will be a little more fair, and hopefully it will make the game more fun.

Matches are intentionally short and chaotic by design. Short matches make
people go "let's play another one". It creates a rapid feedback loop, and
most people like rapid feedback loops. This makes the game fun, which is one
of the lenses of game design that we needed to implement in our game. We also
incorporate the lens of surprise, by making the rounds unpredictable and
chaotic.

The game should be played with at least 5 players. They can join in two ways:

- By playing the game in their webbrowser. It automatically connects to the
  backend of the server it's running on. Only an invite code is needed.

- By playing the game via desktop client (built with Tauri). Think "Open to
  LAN" functionality. When opening your game to LAN, it presents you your
  local and external IP address as well as an invite code. You can send these
  to your friends and they should be able to join by simply entering them in
  their respective clients.

Oblikvo should support multiple input methods. Most notably, mouse/keyboard,
bluetooth controllers (such as Xbox, Playstation and Joycons) and on-screen
touchscreen controls.

One of the important design goals of the game is hackability. You should be
able to create levels yourself easily. We're thinking about encoding levels in
a multi-dimensional array:

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
a 1 a filled space and an x a launchpad. An X is a launchpad that launched you
two blocks high. One block is a little higher than the height of the player.

The game should aesthetically be similar to a classic retro game, like
Wolfenstein 3D. We're thinking of doing that by adding a shader to the end of
our drawing pipeline that pixelates the video buffer. We also want items and
entities to be 2D planes that are always oriented towards the player, similar
to enemies in retro games and dropped items in Minecraft.

Another cool idea is that there would be no UI. It would be part of the
environment. Think healthbars on your gun, enemy health overlayed in a
gradient over their sprite, ammo stats scrolling over the walls.
