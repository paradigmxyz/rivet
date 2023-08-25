# Rivet

> Developer Wallet & DevTools for Anvil

## What is Rivet?

Rivet is a developer Wallet & DevTools for Anvil. It is a Browser Extension that enables developers to inspect, debug, modify, and manipulate the state of Ethereum (accounts, blocks, contracts & the node itself). Rivet is also compatible with any production Dapp, meaning you can simulate any type of action from either an Account attached on the Anvil instance, or by "impersonating" another Account on the network.

Rivet is currently a **work-in-progress prototype**, and aimed to be **contributor first & friendly**. If you would like to contribute, check out the [Contributing Guide](/.github/CONTRIBUTING.md) and [good first issues](https://github.com/paradigmxyz/rivet/labels/good%20first%20issue).

## Features

- **Onboarding**
  - Set up local Anvil instance
  - Configure & deploy Anvil instance (fork block number, fork rpc url, base fee, gas limit, etc)
- **Anvil Node/Chain**
  - Configure fork settings (block number, RPC URL, chain ID, etc)
  - Configure block config (base fee, gas limit, timestamp interval, etc)
  - Automatic sync with Anvil instance
  - Reset instance*
  - Deploy a new instance*
  - Switch between instances*
- **Accounts**
  - List Anvil-attached and impersonated accounts
  - View balances, nonces, and other account details
  - Inspect, connect, and manage accounts
  - Impersonate accounts
  - Set balances & nonces
  - View & set ERC20/721/1155 balances*
  - Import Private Key/HD accounts*
- **Block**
  - Infinite scroll through previous blocks
  - View block details & transactions
  - Toggle between "click-to-mine", interval mining, and auto-mining
  - Time-travelling (rewind & replay)*
- **Contract**
  - Read & write interactions with intuitive UI to represent ABI data structures*
  - Inspect & set storage slots*
  - Inspect & set bytecode*
  - Deployment details (compiler version, optimization + runs)*
  - Inspect contract source code*
- **Transaction**
  - Infinite scroll through previous & pending transactions
  - View transaction details (including decoded calldata*, logs*, state*, and tracing*)
  - Filter transactions by block, account, and status*
  - Update transactions in Anvil mempool*
- **Dapp Connections**
  - Connect to Dapps with your Anvil (and impersonated) account(s)
  - Send transactions, sign messages & typed data, etc
  - Account authorization & "Instant Connect" mode*
  - Transaction request modifiers (fees, nonce, etc)*
- **Other**
  - EIP-6963: Multiple Injected Provider Discovery
  - Light & Dark Mode
  - Keyboard shortcuts*

\* = Planned feature

## Getting Started

### 1. Clone the repository

Clone the repo to your local machine using git:

```bash
git clone https://github.com/paradigmxyz/rivet.git
```

### 2. Install Node.js and pnpm

You need to install **Node.js v18 or higher** and **pnpm v8 or higher**.

You can run the following commands in your terminal to check your local Node.js and pnpm versions:

```bash
node -v
pnpm -v
```

If the versions are not correct or you don't have Node.js or pnpm installed, download and follow their setup instructions:

- Install Node.js using [fnm](https://github.com/Schniz/fnm) or from the [official website](https://nodejs.org)
- Install [pnpm](https://pnpm.io/installation)

### 3. Install dependencies

Once in the project's root directory, run the following command to install the project's dependencies:

```bash
pnpm install
```

### 4. Run the dev server

After you have installed dependencies, you are ready to run the dev server for the Extension. To do so, run the following:

```bash
pnpm dev 
```

This will run a script that will build the Web Extension and start a dev server for the Test Dapp, it will also open the Test Dapp in a new browser tab.

### 5. Installing the Web Extension

Once you have your dev server running, you can install the Web Extension in your browser. To do so, follow these steps:

1. Open your browser's Extensions page
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" in the top left corner
4. Select the `dist/dev` folder in the Dev Wallet's root directory
5. You're good to go! Don't forget to pin the Extension to your browser's toolbar for easy access. 🎉

## Contributing

If you're interested in contributing, please read the [contributing docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Authors

- [@jxom](https://github.com/jxom) (jxom.eth, [Twitter](https://twitter.com/jakemoxey))
- [@tmm](https://github.com/tmm) (awkweb.eth, [Twitter](https://twitter.com/awkweb))

## License

[MIT](/LICENSE) License
