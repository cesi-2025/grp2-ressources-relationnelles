import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from './Card'

describe('<Card />', () => {
  it('affiche ses enfants', () => {
    render(
      <Card>
        <p>Contenu de la carte</p>
      </Card>
    )
    expect(screen.getByText('Contenu de la carte')).toBeInTheDocument()
  })

  it('applique le padding "md" par defaut', () => {
    const { container } = render(<Card>Default</Card>)
    const card = container.firstElementChild!
    expect(card.className).toMatch(/p-6/)
  })

  it('applique le padding "sm" quand demande', () => {
    const { container } = render(<Card padding="sm">Small</Card>)
    const card = container.firstElementChild!
    expect(card.className).toMatch(/p-4/)
  })

  it('active les styles hover quand hover={true}', () => {
    const { container } = render(<Card hover>Hover</Card>)
    const card = container.firstElementChild!
    expect(card.className).toMatch(/hover:shadow-lg/)
  })
})
