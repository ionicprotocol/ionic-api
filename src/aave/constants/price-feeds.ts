// export const CHAINLINK_PRICE_FEEDS = {
//   base: {
//     WETH: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
//     cbETH: '0xd7818272B9e248357d13057AAb0B417aF31E817d',
//     USDbC: '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B',
//     wstETH: '0xB88BAc61a4Ca37C43a3725912B1f472c9A5bc061',
//     USDC: '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B',
//     weETH: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70',
//     cbBTC: '0x07DA0E54543a844a80ABE69c8A12F22B3aA59f9D',
//     GHO: '0x7e860098F58bBFC8648a4311b374B1D669a2bc6B',
//     ezETH: '0x71041dddad3595F9CEd3DcCFBe3D1F4b0a16Bb70'
//   }
// } as const;

// export const CHAINLINK_FEED_ABI = [
//   {
//     inputs: [],
//     name: 'latestRoundData',
//     outputs: [
//       { name: 'roundId', type: 'uint80' },
//       { name: 'answer', type: 'int256' },
//       { name: 'startedAt', type: 'uint256' },
//       { name: 'updatedAt', type: 'uint256' },
//       { name: 'answeredInRound', type: 'uint80' }
//     ],
//     stateMutability: 'view',
//     type: 'function'
//   }
// ];

export const PRICE_FEED_DECIMALS = {
  base: {
    WETH: 8,
    cbETH: 8,
    USDbC: 8,
    wstETH: 18,
    USDC: 8,
    weETH: 8,
    cbBTC: 8,
    GHO: 8,
    ezETH: 8
  }
} as const;

// Add DEXScreener pair addresses
export const DEXSCREENER_PAIRS = {
  base: {
    WETH: '0x4200000000000000000000000000000000000006',
    cbETH: '0x2Ae3F1Ec7F1F5012CFEab0185bfc7aa3cf0DEc22',
    USDbC: '0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA',
    wstETH: '0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452',
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    weETH: '0x35751007a407ca6FEFfE80b3cB397736D2cf4dbe',
    cbBTC: '0xcbB7C0000aB88B473b1f5aFd9ef808440eed33Bf',
    GHO: '0x6Bb7a212910682DCFdbd5BCBb3e28FB4E8da10Ee',
    ezETH: '0x2416092f143378750bb29b79eD961ab195CcEea5'
  }
} as const; 