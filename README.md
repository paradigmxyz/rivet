![cover](https://github.com/paradigmxyz/rivet/assets/1936207/5a8ddb02-c8cd-42ea-8af3-3d6e7201a29a)

<p align="center"><strong>Developer wallet & DevTools for Anvil</strong></p>

<div align="center">
  <a href="https://github.com/paradigmxyz/rivet/actions/workflows/on-push-to-main.yml">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/paradigmxyz/rivet/on-push-to-main.yml">
  </a>
  <a href="https://github.com/paradigmxyz/rivet/blob/main/LICENSE">
    <img alt="GitHub" src="https://img.shields.io/github/license/paradigmxyz/rivet">
  </a>
</div>

## What is Rivet?

Rivet is a developer Wallet & DevTools for Anvil (akin to [Browser DevTools](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/Tools_and_setup/What_are_browser_developer_tools#how_to_open_the_devtools_in_your_browser) or [React DevTools](https://react.dev/learn/react-developer-tools)). It is a browser extension that enables developers to inspect, debug, modify, and manipulate the state of Ethereum: accounts, blocks, contracts & the node itself. Rivet is also compatible with any production dApp, meaning you can simulate any type of action from either an Account attached on the Anvil instance, or by "impersonating" another Account on the network.

By integrating [EIP-6963: Multi Injected Provider Discovery](https://eips.ethereum.org/EIPS/eip-6963), Rivet is designed to be used alongside and with other consumer browser wallets like MetaMask or Rainbow to provide more engrained developer tooling and workflows for Ethereum.

Rivet is currently a **work-in-progress prototype**, and aimed to be **contributor first & friendly**. If you would like to contribute, check out the [Contributing Guide](/.github/CONTRIBUTING.md) and [good first issues](https://github.com/paradigmxyz/rivet/labels/good%20first%20issue).

![screenshots](https://github.com/paradigmxyz/rivet/assets/7336481/7eb57ff3-1f47-486d-b433-6a3346ac3e4b)

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
4. Select the `dist/dev` folder in Rivet's root directory
5. You're good to go! Don't forget to pin the Extension to your browser's toolbar for easy access. 🎉

## Known Issues

Rivet uses the `window.ethereum` interface, which means it has some known conflicts with other wallets which also rely on `window.ethereum`. This is being worked on with the [EIP-6963 proposal](https://eips.ethereum.org/EIPS/eip-6963), but for now it’s an open issue.

For best results it is recommended to run Rivet in it's own Chrome profile, without any other conflicting browser wallets installed.

## Contributing

If you're interested in contributing, please read the [contributing docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Authors

- [@jxom](https://github.com/jxom) (jxom.eth, [Twitter](https://twitter.com/_jxom))
- [@tmm](https://github.com/tmm) (awkweb.eth, [Twitter](https://twitter.com/awkweb))

## License

[MIT](/LICENSE) License
