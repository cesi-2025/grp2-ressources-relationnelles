import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from './Input'

describe('<Input />', () => {
  it('affiche le label quand il est fourni', () => {
    render(<Input label="Email" />)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })

  it("n'affiche pas de label quand il n'est pas fourni", () => {
    render(<Input placeholder="Votre email" />)
    expect(screen.queryByRole('label')).not.toBeInTheDocument()
  })

  it('associe label et input via htmlFor / id', () => {
    render(<Input label="Mot de passe" />)
    const input = screen.getByLabelText('Mot de passe')
    expect(input).toBeInTheDocument()
    expect(input.tagName).toBe('INPUT')
  })

  it('passe aria-invalid=true quand error est fourni', () => {
    render(<Input label="Email" error="Email invalide" />)
    const input = screen.getByLabelText('Email')
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it("affiche le message d'erreur avec role alert", () => {
    render(<Input label="Email" error="Format incorrect" />)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Format incorrect')
  })

  it('appelle onChange lors de la saisie', () => {
    const onChange = vi.fn()
    render(<Input label="Email" onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@b.c' } })
    expect(onChange).toHaveBeenCalled()
  })
})
