export const fulfillAvailableAdvancedOrdersAbiItem = {
  outputs: [
    {
      internalType: 'bool[]',
      name: '',
      type: 'bool[]',
    },
    {
      components: [
        {
          components: [
            {
              internalType: 'enum ItemType',
              name: 'itemType',
              type: 'uint8',
            },
            {
              internalType: 'address',
              name: 'token',
              type: 'address',
            },
            {
              internalType: 'uint256',
              name: 'identifier',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
            },
            {
              internalType: 'address payable',
              name: 'recipient',
              type: 'address',
            },
          ],
          internalType: 'struct ReceivedItem',
          name: 'item',
          type: 'tuple',
        },
        {
          internalType: 'address',
          name: 'offerer',
          type: 'address',
        },
        {
          internalType: 'bytes32',
          name: 'conduitKey',
          type: 'bytes32',
        },
      ],
      internalType: 'struct Execution[]',
      name: '',
      type: 'tuple[]',
    },
  ],
  inputs: [
    {
      components: [
        {
          components: [
            {
              internalType: 'address',
              name: 'offerer',
              type: 'address',
            },
            {
              internalType: 'address',
              name: 'zone',
              type: 'address',
            },
            {
              components: [
                {
                  internalType: 'enum ItemType',
                  name: 'itemType',
                  type: 'uint8',
                },
                {
                  internalType: 'address',
                  name: 'token',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'identifierOrCriteria',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'startAmount',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'endAmount',
                  type: 'uint256',
                },
              ],
              internalType: 'struct OfferItem[]',
              name: 'offer',
              type: 'tuple[]',
            },
            {
              components: [
                {
                  internalType: 'enum ItemType',
                  name: 'itemType',
                  type: 'uint8',
                },
                {
                  internalType: 'address',
                  name: 'token',
                  type: 'address',
                },
                {
                  internalType: 'uint256',
                  name: 'identifierOrCriteria',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'startAmount',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'endAmount',
                  type: 'uint256',
                },
                {
                  internalType: 'address payable',
                  name: 'recipient',
                  type: 'address',
                },
              ],
              internalType: 'struct ConsiderationItem[]',
              name: 'consideration',
              type: 'tuple[]',
            },
            {
              internalType: 'enum OrderType',
              name: 'orderType',
              type: 'uint8',
            },
            {
              internalType: 'uint256',
              name: 'startTime',
              type: 'uint256',
            },
            {
              internalType: 'uint256',
              name: 'endTime',
              type: 'uint256',
            },
            {
              internalType: 'bytes32',
              name: 'zoneHash',
              type: 'bytes32',
            },
            {
              internalType: 'uint256',
              name: 'salt',
              type: 'uint256',
            },
            {
              internalType: 'bytes32',
              name: 'conduitKey',
              type: 'bytes32',
            },
            {
              internalType: 'uint256',
              name: 'totalOriginalConsiderationItems',
              type: 'uint256',
            },
          ],
          internalType: 'struct OrderParameters',
          name: 'parameters',
          type: 'tuple',
        },
        {
          internalType: 'uint120',
          name: 'numerator',
          type: 'uint120',
        },
        {
          internalType: 'uint120',
          name: 'denominator',
          type: 'uint120',
        },
        {
          internalType: 'bytes',
          name: 'signature',
          type: 'bytes',
        },
        {
          internalType: 'bytes',
          name: 'extraData',
          type: 'bytes',
        },
      ],
      internalType: 'struct AdvancedOrder[]',
      name: '',
      type: 'tuple[]',
    },
    {
      components: [
        {
          internalType: 'uint256',
          name: 'orderIndex',
          type: 'uint256',
        },
        {
          internalType: 'enum Side',
          name: 'side',
          type: 'uint8',
        },
        {
          internalType: 'uint256',
          name: 'index',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'identifier',
          type: 'uint256',
        },
        {
          internalType: 'bytes32[]',
          name: 'criteriaProof',
          type: 'bytes32[]',
        },
      ],
      internalType: 'struct CriteriaResolver[]',
      name: '',
      type: 'tuple[]',
    },
    {
      components: [
        {
          internalType: 'uint256',
          name: 'orderIndex',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'itemIndex',
          type: 'uint256',
        },
      ],
      internalType: 'struct FulfillmentComponent[][]',
      name: '',
      type: 'tuple[][]',
    },
    {
      components: [
        {
          internalType: 'uint256',
          name: 'orderIndex',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'itemIndex',
          type: 'uint256',
        },
      ],
      internalType: 'struct FulfillmentComponent[][]',
      name: '',
      type: 'tuple[][]',
    },
    {
      internalType: 'bytes32',
      name: 'fulfillerConduitKey',
      type: 'bytes32',
    },
    {
      internalType: 'address',
      name: 'recipient',
      type: 'address',
    },
    {
      internalType: 'uint256',
      name: 'maximumFulfilled',
      type: 'uint256',
    },
  ],
  name: 'fulfillAvailableAdvancedOrders',
  stateMutability: 'payable',
  type: 'function',
} as const
