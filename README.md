# Epen GTPS v8.7 — Server GTPS Directory

Added a new **Server GTPS** button on the home action list and a new `servers.html` page.

## Configure servers in `settings.js`
Edit `EPEN_CONFIG.site.servers`:

```js
servers: [
  {
    id: 'my-server',
    name: 'Nama Server',
    logo: 'https://...',
    status: 'Online',
    description: 'Deskripsi singkat server.',
    whatsapp: 'https://wa.me/...',
    discord: 'https://discord.gg/...',
    host: 'https://...'
  }
]
```

The page includes:
- Search server GTPS
- Responsive server list
- Glass popup on server click
- Server logo, status, description
- WhatsApp, Discord, and Host Server links
- Shared theme and global footer
