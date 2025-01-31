export const flywheelLensRouterAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_fpd',
        type: 'address',
        internalType: 'contract PoolDirectory',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimAllRewardTokens',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: '',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimRewardsForMarket',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'market',
        type: 'address',
        internalType: 'contract ERC20',
      },
      {
        name: 'flywheels',
        type: 'address[]',
        internalType: 'contract IonicFlywheelCore[]',
      },
      {
        name: 'accrue',
        type: 'bool[]',
        internalType: 'bool[]',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'contract IonicFlywheelCore[]',
      },
      {
        name: 'rewardTokens',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: 'rewards',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimRewardsForMarkets',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'markets',
        type: 'address[]',
        internalType: 'contract ERC20[]',
      },
      {
        name: 'flywheels',
        type: 'address[]',
        internalType: 'contract IonicFlywheelCore[]',
      },
      {
        name: 'accrue',
        type: 'bool[]',
        internalType: 'bool[]',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'contract IonicFlywheelCore[]',
      },
      {
        name: 'rewardTokens',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: 'rewards',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimRewardsForPool',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'comptroller',
        type: 'address',
        internalType: 'contract IonicComptroller',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address[]',
        internalType: 'contract IonicFlywheelCore[]',
      },
      {
        name: '',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: '',
        type: 'uint256[]',
        internalType: 'uint256[]',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimRewardsOfRewardToken',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'rewardToken',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: 'rewardsClaimed',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'fpd',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'contract PoolDirectory',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAdjustedUserNetApr',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'blocksPerYear',
        type: 'int256',
        internalType: 'int256',
      },
      {
        name: 'offchainRewardsAprMarkets',
        type: 'address[]',
        internalType: 'address[]',
      },
      {
        name: 'offchainRewardsAprs',
        type: 'int256[]',
        internalType: 'int256[]',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'int256',
        internalType: 'int256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getAllRewardTokens',
    inputs: [],
    outputs: [
      {
        name: 'uniqueRewardTokens',
        type: 'address[]',
        internalType: 'address[]',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getMarketRewardsInfo',
    inputs: [
      {
        name: 'markets',
        type: 'address[]',
        internalType: 'contract ICErc20[]',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct IonicFlywheelLensRouter.MarketRewardsInfo[]',
        components: [
          {
            name: 'underlyingPrice',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'market',
            type: 'address',
            internalType: 'contract ICErc20',
          },
          {
            name: 'rewardsInfo',
            type: 'tuple[]',
            internalType: 'struct IonicFlywheelLensRouter.RewardsInfo[]',
            components: [
              {
                name: 'rewardSpeedPerSecondPerToken',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'rewardTokenPrice',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'formattedAPR',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'flywheel',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'rewardToken',
                type: 'address',
                internalType: 'address',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getPoolMarketRewardsInfo',
    inputs: [
      {
        name: 'comptroller',
        type: 'address',
        internalType: 'contract IonicComptroller',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        internalType: 'struct IonicFlywheelLensRouter.MarketRewardsInfo[]',
        components: [
          {
            name: 'underlyingPrice',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'market',
            type: 'address',
            internalType: 'contract ICErc20',
          },
          {
            name: 'rewardsInfo',
            type: 'tuple[]',
            internalType: 'struct IonicFlywheelLensRouter.RewardsInfo[]',
            components: [
              {
                name: 'rewardSpeedPerSecondPerToken',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'rewardTokenPrice',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'formattedAPR',
                type: 'uint256',
                internalType: 'uint256',
              },
              {
                name: 'flywheel',
                type: 'address',
                internalType: 'address',
              },
              {
                name: 'rewardToken',
                type: 'address',
                internalType: 'address',
              },
            ],
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getUserNetApr',
    inputs: [
      {
        name: 'user',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'blocksPerYear',
        type: 'int256',
        internalType: 'int256',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'int256',
        internalType: 'int256',
      },
    ],
    stateMutability: 'nonpayable',
  },
] as const;
