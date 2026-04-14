import { describe, it, expect } from 'vitest'
import { STAT_CARDS, STAT_MOD_CARDS, Stats } from './admonStats'

// Clés attendues côté API Laravel (AdminController::statistics)
const API_KEYS: (keyof Stats)[] = [
  'consultations',
  'recherches',
  'exploitations',
  'creations',
  'favoris',
  'commentaires',
  'resources_pending',
  'resources_published',
]

describe('STAT_CARDS (admin dashboard)', () => {
  it('contient exactement 6 cartes', () => {
    expect(STAT_CARDS).toHaveLength(6)
  })

  it("toutes les cles correspondent a celles retournees par l'API Laravel", () => {
    // Regression du bug : le front utilisait 'created' / 'exploite' / 'favorite'
    // qui ne matchaient pas l'API => tout s'affichait a 0.
    for (const card of STAT_CARDS) {
      expect(API_KEYS).toContain(card.key as keyof Stats)
    }
  })

  it('les cles sont uniques (pas de doublon)', () => {
    const keys = STAT_CARDS.map((c) => c.key)
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('chaque carte a un label non vide', () => {
    for (const card of STAT_CARDS) {
      expect(card.label.trim()).not.toBe('')
    }
  })
})

describe('STAT_MOD_CARDS (moderator dashboard)', () => {
  it('est un sous-ensemble de STAT_CARDS', () => {
    const adminKeys = STAT_CARDS.map((c) => c.key)
    for (const card of STAT_MOD_CARDS) {
      expect(adminKeys).toContain(card.key)
    }
  })
})
