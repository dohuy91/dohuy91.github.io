/** @type {import("pliny/config").PlinyConfig } */
const siteMetadata = {
  title: "Huy's Blog",
  author: 'Do Quang Huy',
  headerTitle: 'dohuy91',
  description: 'Technical writings on software engineering, productivity, and dev tools.',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://dohuy91.github.io',
  siteRepo: 'https://github.com/dohuy91/dohuy91.github.io',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/twitter-card.png`,
  email: '',
  github: 'https://github.com/dohuy91',
  linkedin: 'https://www.linkedin.com/in/dohuy91',
  locale: 'en-US',
  stickyNav: false,
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: '',
    },
  },
  newsletter: {
    provider: 'buttondown',
  },
  comments: {
    provider: 'giscus',
    giscusConfig: {
      repo: 'dohuy91/dohuy91.github.io',
      repositoryId: 'R_kgDOGG_XCQ',
      category: 'Announcements',
      categoryId: 'DIC_kwDOGG_XCc4C6S8v',
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      theme: 'light',
      darkTheme: 'transparent_dark',
      themeURL: '',
      lang: 'en',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}

module.exports = siteMetadata
