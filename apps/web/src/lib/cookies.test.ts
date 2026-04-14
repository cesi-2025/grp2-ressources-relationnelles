import { describe, it, expect, beforeEach } from 'vitest'
import { authCookies } from './cookies'

describe('authCookies', () => {
  beforeEach(() => {
    // Reset cookies between tests
    document.cookie = 'sanctum_token=; path=/; max-age=0'
    document.cookie = 'user_role=; path=/; max-age=0'
  })

  it('set() ecrit les cookies sanctum_token et user_role', () => {
    authCookies.set('tok-abc', 'citizen')
    expect(document.cookie).toContain('sanctum_token=tok-abc')
    expect(document.cookie).toContain('user_role=citizen')
  })

  it('remove() supprime les cookies auth', () => {
    authCookies.set('tok-xyz', 'admin')
    authCookies.remove()
    expect(document.cookie).not.toContain('tok-xyz')
    expect(document.cookie).not.toContain('user_role=admin')
  })
})
