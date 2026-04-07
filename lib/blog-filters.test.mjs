import test from 'node:test'
import assert from 'node:assert/strict'

import { filterPosts, getLanguageCounts } from './blog-filters.js'

const posts = [
  {
    title: 'English Architecture Notes',
    summary: 'Notes on software design',
    tags: ['architecture'],
    language: 'en',
  },
  {
    title: 'Tieng Viet ve DX',
    summary: 'Cong cu va quy trinh',
    tags: ['dx'],
    language: 'vi',
  },
  {
    title: 'Missing Language Defaults',
    summary: 'Should be treated as English',
    tags: ['default'],
  },
]

test('filterPosts keeps all posts when language is all and search is empty', () => {
  assert.equal(filterPosts(posts, { language: 'all', searchValue: '' }).length, 3)
})

test('filterPosts keeps only vietnamese posts when language is vi', () => {
  const filtered = filterPosts(posts, { language: 'vi', searchValue: '' })

  assert.deepEqual(
    filtered.map((post) => post.title),
    ['Tieng Viet ve DX']
  )
})

test('filterPosts applies search after language filtering', () => {
  const filtered = filterPosts(posts, { language: 'en', searchValue: 'default' })

  assert.deepEqual(
    filtered.map((post) => post.title),
    ['Missing Language Defaults']
  )
})

test('getLanguageCounts counts posts by normalized language', () => {
  assert.deepEqual(getLanguageCounts(posts), {
    all: 3,
    en: 2,
    vi: 1,
  })
})
