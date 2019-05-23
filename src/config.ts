if (
  !process.env.CLIENT_ID ||
  !process.env.CLIENT_SECRET ||
  !process.env.OAUTH_URL ||
  !process.env.API_URL
)
  throw new Error('Application can not be booted.')

const COMMIT =
  // netlify
  process.env.COMMIT_REF

export default {
  app: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET
  },
  oauth: process.env.OAUTH_URL,
  api: process.env.API_URL,
  source: {
    repository:
      process.env.SOURCE_REPOSITORY_URL || 'https://github.com/otofune/mozuku',
    commit: COMMIT ? COMMIT.substr(0, 7) : undefined
  }
}
