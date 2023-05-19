import pkg from './package.json'

export const getManifest = ({ dev }: { dev?: boolean }) => ({
  name: `${pkg.extension.name}${dev ? ' (dev)' : ''}`,
  description: pkg.extension.description,
  version: pkg.version,
  manifest_version: 3,
  background: {
    service_worker: 'src/entries/background/index.ts',
  },
  action: {
    // default_icon: {
    //   '16': 'images/icon-16.png',
    //   '19': 'images/icon-19.png',
    //   '32': 'images/icon-16@2x.png',
    //   '38': 'images/icon-19@2x.png',
    //   '64': 'images/icon-16@4x.png',
    //   '128': 'images/icon-16@8x.png',
    //   '512': 'images/icon-16@32x.png',
    // },
    default_title: pkg.extension.name,
    default_popup: 'src/entries/popup/_app.html',
  },
  content_scripts: [
    {
      matches: ['*://*/*'],
      js: ['src/entries/content/index.ts'],
      run_at: 'document_start',
      all_frames: true,
    },
  ],
  permissions: [
    'activeTab',
    'alarms',
    'contextMenus',
    'clipboardWrite',
    'notifications',
    'scripting',
    'storage',
    'tabs',
    'unlimitedStorage',
    'webRequest',
  ],
  host_permissions: ['*://*/*'],
  web_accessible_resources: [
    {
      resources: ['src/entries/inpage/index.ts', '*.woff2'],
      matches: ['<all_urls>'],
    },
  ],
}) satisfies chrome.runtime.Manifest
