# 🦑 ink! 4.0 Workshop

This repository contains an interactive ink! workshop. 
We created it as a way of gamifying the experience of learning ink!.

The workshop is a game, in which students write a smart contract
that plays on their behalf – an agent.
The score function of the game was chosen in a way that it favors
contracts that are using as little as gas possible to play the game.
This can be done using smart contract best practices.

This repository contains:

* `game/`: A smart contract that runs the game. Workshop participants
  have to register their player with the game contract.
* `basic-player`: Example of a player contract.
* `frontend/`: The Game UI, which the workshop instructor can put
  on a big screen, so that participants can see live how their agents
  are doing.

The idea is that anyone who wants can give this workshop can use the slides and
instructions which will be provided here.
 We'll add slides on how to conduct the workshop soon!

There are two other relevant repositories:

* [paritytech/squink-splash-beginner](https://github.com/paritytech/squink-splash-beginner):
  Contains setup instructions for the workshop participants and a
  basic player to participate in the game.
* [paritytech/squink-splash-advanced](https://github.com/paritytech/squink-splash-advanced):
  Contains pointers to advanced ideas for playing the game.