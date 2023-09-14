import { join } from 'node:path'
import { globby } from 'globby'
;(async () => {
  const rpcUrl = process.argv[2] || 'http://127.0.0.1:8545'
  const privateKey =
    process.argv[3] ||
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80' // anvil private key before you ask

  const contractsPaths = await globby(
    join(__dirname, '../test/contracts/src/**/*.sol'),
  )

  contractsPaths.forEach((contractPath) => {
    const contract = contractPath.split('/')
    const contractName = contract[contract.length - 1].replace('.sol', '')
    console.log('Deploying: ', contractName)
    Bun.spawnSync(
      [
        'forge',
        'create',
        '--rpc-url',
        rpcUrl,
        '--private-key',
        privateKey,
        `${contractPath}:${contractName}`,
      ],
      { stdout: 'inherit' },
    )
  })
  console.log('Deployed contracts.')
})()
