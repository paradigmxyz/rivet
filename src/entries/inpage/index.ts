// Note: The entrypoint of the inpage script needs to be an IIFE. Manifest v3 doesn't seem to work well with
// injected scripts that include static `import`s.

;(async () => {
  const [{ injectWallet }, { injectProvider }] = await Promise.all([
    import('./wallet'),
    import('./provider'),
  ])
  injectWallet()
  injectProvider()
})()
