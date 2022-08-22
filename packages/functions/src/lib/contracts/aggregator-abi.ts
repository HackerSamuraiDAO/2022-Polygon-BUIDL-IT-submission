export const AGGREGATOR_ABI = [
  {
    inputs: [
      {
        internalType: "contract Rakugaki",
        name: "rakugaki_",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "get",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "tokenId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "holder",
            type: "address",
          },
          {
            components: [
              {
                internalType: "uint256",
                name: "lat",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "latDecimalLength",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "lng",
                type: "uint256",
              },
              {
                internalType: "uint256",
                name: "lngDecimalLength",
                type: "uint256",
              },
            ],
            internalType: "struct Rakugaki.Location",
            name: "location",
            type: "tuple",
          },
          {
            internalType: "string",
            name: "imageURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "modelURI",
            type: "string",
          },
          {
            internalType: "string",
            name: "tokenURI",
            type: "string",
          },
        ],
        internalType: "struct Aggregator.Data",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "rakugaki",
    outputs: [
      {
        internalType: "contract Rakugaki",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
