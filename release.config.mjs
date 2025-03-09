export default {
  branches: [
    'main',
		{ name: 'rc', prerelease: true },
  ],
	preset: 'conventionalcommits',
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/github',
      {
        'assets': [
          { 'path': 'extension/chrome.zip', 'label': 'Chrome' },
          { 'path': 'extension/firefox.xpi', 'label': 'Firefox' },
          { 'path': 'extension/opera.crx', 'label': 'Opera' },
        ],
      },
    ],
    [
      '@semantic-release/npm',
      {
        npmPublish: false,
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: [
          'package.json',
          'pnpm-lock.yaml',
          'CHANGELOG.md',
        ],
        message: 'chore(release): ${nextRelease.version} [skip ci]',
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: 'pnpm run build',
      },
    ],
  ],
};
