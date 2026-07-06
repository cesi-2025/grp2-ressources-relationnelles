import { describe, it, expect, beforeEach } from 'vitest'
import { ApiRequestError, setToken, removeToken } from './api'

describe('ApiRequestError', () => {
  it('expose status, message et errors', () => {
    const err = new ApiRequestError({
      message: 'Validation failed',
      status: 422,
      errors: { email: ['Format invalide'] },
    })

    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('Validation failed')
    expect(err.status).toBe(422)
    expect(err.errors?.email?.[0]).toBe('Format invalide')
  })
})

describe('token storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('setToken stocke le token dans localStorage', () => {
    setToken('abc123')
    expect(localStorage.getItem('auth_token')).toBe('abc123')
  })

  it('removeToken supprime le token de localStorage', () => {
    localStorage.setItem('auth_token', 'abc123')
    removeToken()
    expect(localStorage.getItem('auth_token')).toBeNull()
  })
})
