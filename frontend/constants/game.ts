// export const WS_PROVIDER = 'ws://127.0.0.1:9944';
// export const CONTRACT_ADDRESS = '5EwukzsZPjbCpw4axB3jKBeAczw4bNeB7Xm9tdLhMRqjHQuV';

export const ABI = {
  source: {
    hash: '0x9b4ea2cbf7196de9a0e01fb31ebfdd36e04be356019123e43344d83374416194',
    language: 'ink! 4.0.0-alpha.3',
    compiler: 'rustc 1.64.0',
  },
  contract: {
    name: 'squink_splash',
    version: '0.1.0',
    authors: ['Parity Technologies <admin@parity.io>'],
  },
  spec: {
    constructors: [
      {
        args: [
          {
            label: 'dimensions',
            type: {
              displayName: [],
              type: 9,
            },
          },
          {
            label: 'buy_in',
            type: {
              displayName: ['Balance'],
              type: 8,
            },
          },
          {
            label: 'forming_rounds',
            type: {
              displayName: ['u32'],
              type: 0,
            },
          },
          {
            label: 'rounds',
            type: {
              displayName: ['u32'],
              type: 0,
            },
          },
        ],
        docs: [
          'Create a new game.',
          '',
          '- `dimensions`: (width,height) Of the board',
          '- `buy_in`: The amount of balance each player needs to submit in order to play.',
          '- `forming_rounds`: Number of blocks that needs to pass until anyone can start the game.',
          '- `rounds`: The number of blocks a game can be played for.',
        ],
        label: 'new',
        payable: false,
        selector: '0x9bae9d5e',
      },
    ],
    docs: [],
    events: [
      {
        args: [
          {
            docs: [' The player that attempted the turn.'],
            indexed: false,
            label: 'player',
            type: {
              displayName: ['AccountId'],
              type: 1,
            },
          },
          {
            docs: [
              ' The field that was painted by the player.',
              '',
              " This is `None` if the turn failed. This will happen if the player's contract",
              ' fails to return a proper turn. Either because the contract panics, returns garbage',
              ' or paints outside of the board.',
            ],
            indexed: false,
            label: 'turn',
            type: {
              displayName: ['Option'],
              type: 15,
            },
          },
        ],
        docs: [' A player attempted to make a turn.'],
        label: 'TurnTaken',
      },
    ],
    messages: [
      {
        args: [],
        docs: ['When the game is in finished the contract can be deleted by the winner.'],
        label: 'destroy',
        mutates: true,
        payable: false,
        returnType: null,
        selector: '0xc7e248e4',
      },
      {
        args: [],
        docs: ['Anyone can start the game when `earliest_start` is reached.'],
        label: 'start_game',
        mutates: true,
        payable: false,
        returnType: null,
        selector: '0x0dad731d',
      },
      {
        args: [],
        docs: [
          'When enough time has passed no new turns can be submitted.',
          'Then everybody can call this to end the game and trigger the payout to',
          'the winner.',
        ],
        label: 'end_game',
        mutates: true,
        payable: false,
        returnType: null,
        selector: '0xc76d285a',
      },
      {
        args: [
          {
            label: 'id',
            type: {
              displayName: ['AccountId'],
              type: 1,
            },
          },
          {
            label: 'name',
            type: {
              displayName: ['String'],
              type: 6,
            },
          },
        ],
        docs: ['Add a new player to the game. Only allowed while the game has not started.'],
        label: 'register_player',
        mutates: true,
        payable: true,
        returnType: null,
        selector: '0x44c9d826',
      },
      {
        args: [
          {
            label: 'id',
            type: {
              displayName: ['AccountId'],
              type: 1,
            },
          },
        ],
        docs: [
          'Each block every player can submit their turn.',
          '',
          'Each player can only make one turn per block. If the contract panics or fails',
          'to return the proper result the turn of forfeited and the gas usage is still recorded.',
        ],
        label: 'submit_turn',
        mutates: true,
        payable: false,
        returnType: null,
        selector: '0xd73c7bba',
      },
      {
        args: [],
        docs: ['The buy in amount to register a player'],
        label: 'buy_in_amount',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['Balance'],
          type: 8,
        },
        selector: '0x3bd6cf8d',
      },
      {
        args: [],
        docs: ['The current game state.'],
        label: 'state',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['State'],
          type: 10,
        },
        selector: '0x0ced162a',
      },
      {
        args: [],
        docs: ['List of all players sorted by id.'],
        label: 'players',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['Vec'],
          type: 4,
        },
        selector: '0x4c3724ad',
      },
      {
        args: [],
        docs: ['List of of all players (sorted by id) and their current scores.'],
        label: 'player_scores',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['Vec'],
          type: 11,
        },
        selector: '0x2ec966dd',
      },
      {
        args: [],
        docs: ['Returns the dimensions of the board.'],
        label: 'dimensions',
        mutates: false,
        payable: false,
        returnType: {
          displayName: [],
          type: 9,
        },
        selector: '0xf10dee95',
      },
      {
        args: [
          {
            label: 'x',
            type: {
              displayName: ['u32'],
              type: 0,
            },
          },
          {
            label: 'y',
            type: {
              displayName: ['u32'],
              type: 0,
            },
          },
        ],
        docs: ['Returns the value (owner) of the supplied field.'],
        label: 'field',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['Option'],
          type: 13,
        },
        selector: '0x4abe8f1b',
      },
      {
        args: [],
        docs: ['Returns the complete board.', '', 'The index into the vector is calculated as `x + y * width`.'],
        label: 'board',
        mutates: false,
        payable: false,
        returnType: {
          displayName: ['Vec'],
          type: 14,
        },
        selector: '0x276086cb',
      },
    ],
  },
  storage: {
    root: {
      layout: {
        struct: {
          fields: [
            {
              layout: {
                enum: {
                  dispatchKey: '0x00000000',
                  name: 'State',
                  variants: {
                    '0': {
                      fields: [
                        {
                          layout: {
                            leaf: {
                              key: '0x00000000',
                              ty: 0,
                            },
                          },
                          name: 'earliest_start',
                        },
                      ],
                      name: 'Forming',
                    },
                    '1': {
                      fields: [
                        {
                          layout: {
                            leaf: {
                              key: '0x00000000',
                              ty: 0,
                            },
                          },
                          name: 'start_block',
                        },
                        {
                          layout: {
                            leaf: {
                              key: '0x00000000',
                              ty: 0,
                            },
                          },
                          name: 'end_block',
                        },
                      ],
                      name: 'Running',
                    },
                    '2': {
                      fields: [
                        {
                          layout: {
                            leaf: {
                              key: '0x00000000',
                              ty: 1,
                            },
                          },
                          name: 'winner',
                        },
                      ],
                      name: 'Finished',
                    },
                  },
                },
              },
              name: 'state',
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: '0xb93a8c6e',
                      ty: 1,
                    },
                  },
                  root_key: '0xb93a8c6e',
                },
              },
              name: 'board',
            },
            {
              layout: {
                struct: {
                  fields: [
                    {
                      layout: {
                        leaf: {
                          key: '0x00000000',
                          ty: 0,
                        },
                      },
                      name: '0',
                    },
                    {
                      layout: {
                        leaf: {
                          key: '0x00000000',
                          ty: 0,
                        },
                      },
                      name: '1',
                    },
                  ],
                  name: '(A, B)',
                },
              },
              name: 'dimensions',
            },
            {
              layout: {
                root: {
                  layout: {
                    leaf: {
                      key: '0x900fc968',
                      ty: 4,
                    },
                  },
                  root_key: '0x900fc968',
                },
              },
              name: 'players',
            },
            {
              layout: {
                leaf: {
                  key: '0x00000000',
                  ty: 8,
                },
              },
              name: 'buy_in',
            },
            {
              layout: {
                leaf: {
                  key: '0x00000000',
                  ty: 0,
                },
              },
              name: 'rounds',
            },
          ],
          name: 'SquinkSplash',
        },
      },
      root_key: '0x00000000',
    },
  },
  types: [
    {
      id: 0,
      type: {
        def: {
          primitive: 'u32',
        },
      },
    },
    {
      id: 1,
      type: {
        def: {
          composite: {
            fields: [
              {
                type: 2,
                typeName: '[u8; 32]',
              },
            ],
          },
        },
        path: ['ink_primitives', 'types', 'AccountId'],
      },
    },
    {
      id: 2,
      type: {
        def: {
          array: {
            len: 32,
            type: 3,
          },
        },
      },
    },
    {
      id: 3,
      type: {
        def: {
          primitive: 'u8',
        },
      },
    },
    {
      id: 4,
      type: {
        def: {
          sequence: {
            type: 5,
          },
        },
      },
    },
    {
      id: 5,
      type: {
        def: {
          composite: {
            fields: [
              {
                name: 'id',
                type: 1,
                typeName: 'AccountId',
              },
              {
                name: 'name',
                type: 6,
                typeName: 'String',
              },
              {
                name: 'gas_used',
                type: 7,
                typeName: 'u64',
              },
              {
                name: 'last_turn',
                type: 0,
                typeName: 'u32',
              },
            ],
          },
        },
        path: ['game', 'squink_splash', 'Player'],
      },
    },
    {
      id: 6,
      type: {
        def: {
          primitive: 'str',
        },
      },
    },
    {
      id: 7,
      type: {
        def: {
          primitive: 'u64',
        },
      },
    },
    {
      id: 8,
      type: {
        def: {
          primitive: 'u128',
        },
      },
    },
    {
      id: 9,
      type: {
        def: {
          tuple: [0, 0],
        },
      },
    },
    {
      id: 10,
      type: {
        def: {
          variant: {
            variants: [
              {
                fields: [
                  {
                    name: 'earliest_start',
                    type: 0,
                    typeName: 'u32',
                  },
                ],
                index: 0,
                name: 'Forming',
              },
              {
                fields: [
                  {
                    name: 'start_block',
                    type: 0,
                    typeName: 'u32',
                  },
                  {
                    name: 'end_block',
                    type: 0,
                    typeName: 'u32',
                  },
                ],
                index: 1,
                name: 'Running',
              },
              {
                fields: [
                  {
                    name: 'winner',
                    type: 1,
                    typeName: 'AccountId',
                  },
                ],
                index: 2,
                name: 'Finished',
              },
            ],
          },
        },
        path: ['game', 'squink_splash', 'State'],
      },
    },
    {
      id: 11,
      type: {
        def: {
          sequence: {
            type: 12,
          },
        },
      },
    },
    {
      id: 12,
      type: {
        def: {
          tuple: [5, 7],
        },
      },
    },
    {
      id: 13,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 1,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 1,
          },
        ],
        path: ['Option'],
      },
    },
    {
      id: 14,
      type: {
        def: {
          sequence: {
            type: 13,
          },
        },
      },
    },
    {
      id: 15,
      type: {
        def: {
          variant: {
            variants: [
              {
                index: 0,
                name: 'None',
              },
              {
                fields: [
                  {
                    type: 9,
                  },
                ],
                index: 1,
                name: 'Some',
              },
            ],
          },
        },
        params: [
          {
            name: 'T',
            type: 9,
          },
        ],
        path: ['Option'],
      },
    },
  ],
  version: '4',
};
