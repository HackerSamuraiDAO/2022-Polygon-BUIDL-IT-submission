# Rakugaki

## Architecture

![architecture](./docs/architecture.png)

## Tested Environment

- Devices

  - Chrome on Mac OS
  - Metamask Mobile on iOS

- Disclaimer
  - Other devices are not tested, please use above devices if possible.
  - Please turn on the location tracking

## Development

### Frontend

```
cd packages/frontend
yarn
yarn dev
```

### Contracts

```
cd packages/contracts
yarn
yarn test
```

### Functions

```
cd packages/functions
yarn
yarn build // this generates zip file to deploy AWS lambda
```

## Contribution

- Contribution is always welcome! Please add/update package!
