import assert from 'node:assert/strict'
import { test } from 'node:test'
import { issueCaptchaChallenge, verifyCaptchaSubmission } from '../lib/inquiry-captcha.ts'

process.env.NODE_ENV = 'test'
const secret = 'langtian-captcha-test-secret-only-32-characters'
const tenantId = '317a84d7-9b80-4785-bd97-59170f7d2472'
const siteScope = 'langtian-test-site'

function store() {
  const current = new Map()
  const key = (r) => `${r.tenantId}:${r.siteScopeHash}:${r.formScopeHash}`
  return {
    async issue(record) { current.set(key(record), { ...record, consumed: false }) },
    async consume(record) {
      const old = current.get(key(record))
      if (!old || old.consumed || old.challengeHash !== record.challengeHash ||
        old.tokenHash !== record.tokenHash || old.expiresAt < (record.now ?? Date.now())) return false
      old.consumed = true
      return true
    },
  }
}

test('wrong answer consumes a challenge; replay and pre-refresh tokens fail', async () => {
  const challengeStore = store()
  const base = { secret, tenantId, siteScope, scope: 'contact-form-test-001', store: challengeStore }
  const first = await issueCaptchaChallenge(base)
  assert.equal(first.testAnswer?.length, 4)
  assert.equal(first.svg.includes(first.testAnswer), false)
  const wrong = await verifyCaptchaSubmission({ ...base, token: first.token, answer: '0000' })
  assert.equal(wrong.ok, false)
  const retry = await verifyCaptchaSubmission({ ...base, token: first.token, answer: first.testAnswer })
  assert.equal(retry.ok, false)
  const second = await issueCaptchaChallenge(base)
  const third = await issueCaptchaChallenge(base)
  assert.equal((await verifyCaptchaSubmission({ ...base, token: second.token, answer: second.testAnswer })).ok, false)
  assert.equal((await verifyCaptchaSubmission({ ...base, token: third.token, answer: third.testAnswer })).ok, true)
})

test('concurrent submissions have only one winner and scopes are independent', async () => {
  const challengeStore = store()
  const a = { secret, tenantId, siteScope, scope: 'product-form-test-001', store: challengeStore }
  const b = { ...a, scope: 'product-form-test-002' }
  const first = await issueCaptchaChallenge(a)
  const other = await issueCaptchaChallenge(b)
  const attempts = await Promise.all([1, 2].map(() => verifyCaptchaSubmission({ ...a, token: first.token, answer: first.testAnswer })))
  assert.deepEqual(attempts.map((r) => r.ok).sort(), [false, true])
  assert.equal((await verifyCaptchaSubmission({ ...b, token: other.token, answer: other.testAnswer })).ok, true)
})
