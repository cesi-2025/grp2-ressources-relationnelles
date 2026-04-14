import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button'

describe('<Button />', () => {
  it('affiche son label enfant', () => {
    render(<Button>Connexion</Button>)
    expect(screen.getByRole('button', { name: 'Connexion' })).toBeInTheDocument()
  })

  it('applique la classe du variant "primary" par defaut', () => {
    render(<Button>Default</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/bg-primary/)
  })

  it('applique la classe du variant "outline" quand demande', () => {
    render(<Button variant="outline">Outline</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toMatch(/border-primary/)
  })

  it('appelle onClick au clic', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Clique</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('applique la taille "sm" quand demandee', () => {
    render(<Button size="sm">Petit</Button>)
    expect(screen.getByRole('button').className).toMatch(/text-sm/)
  })

  it('applique la taille "lg" quand demandee', () => {
    render(<Button size="lg">Gros</Button>)
    expect(screen.getByRole('button').className).toMatch(/text-lg/)
  })

  it('respecte la prop disabled', () => {
    render(<Button disabled>Inactif</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
