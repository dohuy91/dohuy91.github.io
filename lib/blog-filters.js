function normalizeLanguage(language) {
  return language === 'vi' ? 'vi' : 'en'
}

export function filterPosts(posts, { language = 'all', searchValue = '' } = {}) {
  const normalizedSearch = searchValue.trim().toLowerCase()

  return posts.filter((post) => {
    const postLanguage = normalizeLanguage(post.language)
    const matchesLanguage = language === 'all' || postLanguage === language
    if (!matchesLanguage) {
      return false
    }

    if (!normalizedSearch) {
      return true
    }

    const searchContent = [post.title, post.summary, ...(post.tags || [])].join(' ').toLowerCase()
    return searchContent.includes(normalizedSearch)
  })
}

export function getLanguageCounts(posts) {
  const counts = {
    all: posts.length,
    en: 0,
    vi: 0,
  }

  posts.forEach((post) => {
    counts[normalizeLanguage(post.language)] += 1
  })

  return counts
}
