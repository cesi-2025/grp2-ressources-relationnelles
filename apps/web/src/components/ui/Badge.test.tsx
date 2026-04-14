import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from './Badge'

describe('<Badge />', () => {
  it('affiche son contenu textuel', () => {
    render(<Badge>En attente</Badge>)
    expect(screen.getByText('En attente')).toBeInTheDocument()
  })

  it('applique le variant "primary" par defaut', () => {
    render(<Badge>Default</Badge>)
    const el = screen.getByText('Default')
    expect(el.className).toMatch(/bg-primary-light/)
  })

  it('applique le variant "success" quand demande', () => {
    render(<Badge variant="success">Valide</Badge>)
    const el = screen.getByText('Valide')
    expect(el.className).toMatch(/bg-green-100/)
  })

  it('applique le variant "error" quand demande', () => {
    render(<Badge variant="error">Refuse</Badge>)
    const el = screen.getByText('Refuse')
    expect(el.className).toMatch(/bg-red-100/)
  })

  it('applique la taille "sm" quand demandee', () => {
    render(<Badge size="sm">Petit</Badge>)
    const el = screen.getByText('Petit')
    expect(el.className).toMatch(/text-xs/)
  })
})
