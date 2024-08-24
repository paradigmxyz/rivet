![cover](https://github.com/paradigmxyz/rivet/assets/1936207/5a8ddb02-c8cd-42ea-8af3-3d6e7201a29a)

<p align="center"><strong>Developer wallet & DevTools for Anvil</strong></p>

<div align="center">
  <a href="https://chrome.google.com/webstore/detail/rivet/mobmnpcacgadhkjfelhpemphmmnggnod">
    <img alt="Chrome Web Store Version" src="https://img.shields.io/chrome-web-store/v/mobmnpcacgadhkjfelhpemphmmnggnod">
  </a>
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

Rivet is aimed to be **contributor first & friendly**. If you would like to contribute, check out the [Contributing Guide](/.github/CONTRIBUTING.md) and [good first issues](https://github.com/paradigmxyz/rivet/labels/good%20first%20issue).

![screenshots](https://github.com/paradigmxyz/rivet/assets/7336481/7eb57ff3-1f47-486d-b433-6a3346ac3e4b)

## Download

- **Chromium (Chrome, Brave, Arc, etc)**: [Chrome Web Store](https://chrome.google.com/webstore/detail/rivet/mobmnpcacgadhkjfelhpemphmmnggnod)
- **Firefox**: coming soon
- **Safari**: coming soon

### Nightly Release

Rivet is currently in active development. If you would like to try out the latest features, you can download the latest nightly build below:

- **Chromium (Chrome, Brave, Arc, etc)**: [Download](https://github.com/paradigmxyz/rivet/releases/latest)

<details>
  <summary>Setup Instructions</summary>
  <ol>
    <li>Download the asset `extension.zip` from the link above</li>
    <li>Unzip the downloaded file</li>
    <li>Open your chromium browser and navigate to <code>chrome://extensions</code></li>
    <li>Enable <code>Developer Mode</code> in the top right corner</li>
    <li>Click <code>Load Unpacked</code> in the top left corner</li>
    <li>Select the unzipped folder</li>
    <li>Done! You should now see the Rivet extension in your browser</li>
  <ol>
</details>

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

### 2. Install Bun

Rivet uses [Bun](https://bun.sh). You need to install **Bun v1 or higher**.

You can run the following commands in your terminal to check your local Bun version:

```bash
bun -v
```

If the versions are not correct or you don't have Bun installed, download and follow their setup instructions:

- Install [Bun](https://bun.sh/docs/installation)

### 3. Install dependencies

Once in the project's root directory, run the following command to install the project's dependencies:

```bash
bun i
```

### 4. Run the dev server

After you have installed dependencies, you are ready to run the dev server for the Extension. To do so, run the following:

```bash
bun run dev 
```

This will run a script that will build the Web Extension, start a dev server for the Test Dapp, and automatically open Chrome with a fresh profile and the extension installed.

## Known Issues

Rivet uses the `window.ethereum` interface, which means it has some known conflicts with other wallets which also rely on `window.ethereum`. Once Dapps start to integrate [EIP-6963](https://eips.ethereum.org/EIPS/eip-6963) to handle multiple injected wallets, this should not be a problem anymore.

For best results it is recommended to run Rivet in it's own Chrome profile, without any other conflicting browser wallets installed.

Helpful note: A fresh Chrome profile gets instantiated when running the dev script: `bun run dev`.

## Contributing

If you're interested in contributing, please read the [contributing docs](/.github/CONTRIBUTING.md) **before submitting a pull request**.

## Authors

- [@jxom](https://github.com/jxom) (jxom.eth, X [(Twitter)](https://x.com/_jxom))
- [@tmm](https://github.com/tmm) (awkweb.eth, X [(Twitter)](https://x.com/awkweb))

## License

[MIT](/LICENSE) License
