# Rivet

## Overview

Rivet is a developer Wallet & DevTools for Anvil. It is a Browser Extension that enables developers to inspect, debug, modify, and manipulate the state of Ethereum (accounts, blocks, contracts & the node itself). Rivet is also compatible with any production Dapp, meaning you can simulate any type of action from either an Account attached on the Anvil instance, or by "impersonating" another Account on the network.

## Features

- **Anvil Node**
  - Configure fork settings (block number, RPC URL, chain ID, etc)
  - Configure block config (base fee, gas limit, timestamp interval, etc)
  - Automatic sync with Anvil instance
- **Accounts**
  - List Anvil-attached and impersonated accounts
  - View balances, nonces, and other account details
  - Inspect, connect, and manage accounts
  - Impersonate accounts
  - Set balances & nonces
- **Block**
  - Infinite scroll through previous blocks
  - View block details & transactions
  - Toggle between "click-to-mine", interval mining, and auto-mining
  - Time-travelling (rewind & replay)
- **Contract**
  - Read & write interactions with intuitive UI to represent ABI data structures
  - Inspect & set storage slots
  - Inspect & set bytecode
- **Transaction**
  - Infinite scroll through previous & pending transactions
  - Filter transactions by block, account, and status
- **Dapp Connections**
  - Connect to Dapps with your Anvil (and impersonated) account(s)
  - Account authorization & "Instant Connect" mode
  - Send transactions, sign messages & typed data, etc

## Getting Started

Head to the [Contributing Guide](/.github/CONTRIBUTING.md#getting-started) to get started.

## Contributing

If you're interested in contributing, please read the [contributing docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Authors

- [@jxom](https://github.com/jxom) (jxom.eth, [Twitter](https://twitter.com/jakemoxey))
- [@tmm](https://github.com/tmm) (awkweb.eth, [Twitter](https://twitter.com/awkweb))

## License

[MIT](/LICENSE) License
