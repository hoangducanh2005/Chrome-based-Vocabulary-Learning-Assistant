import { defineManifest } from '@crxjs/vite-plugin'
import pkg from './package.json'

export default defineManifest({
    manifest_version: 3,
    name: '__MSG_extName__',
    description: '__MSG_extDescription__',
    version: pkg.version,
    default_locale: 'vi',
    icons: {
        32: 'public/dev-icon-32.png',
        128: 'public/dev-icon-128.png',
    },
    action: {
        default_icon: { 32: 'public/dev-icon-32.png' },
        default_popup: 'src/popup/index.html',
    },
    background: {
        service_worker: 'src/background/index.ts',
        type: 'module',
    },
    content_scripts: [{
        js: ['src/content/main.tsx'],
        matches: ['https://*/*'],
    }],
    permissions: [
        'storage',
        'sidePanel',
        'alarms',
    ],
    side_panel: {
        default_path: 'src/sidepanel/index.html',
    },
})
