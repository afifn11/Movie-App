import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Avatar from './Avatar';

describe('Avatar', () => {
  it('renders an image with no-referrer policy when src is provided', () => {
    render(<Avatar src="https://example.com/photo.jpg" name="Afif Naufal" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'https://example.com/photo.jpg');
    expect(img).toHaveAttribute('referrerpolicy', 'no-referrer');
  });

  it('falls back to initials when no src is given', () => {
    render(<Avatar name="Afif Naufal" />);
    expect(screen.getByText('AN')).toBeInTheDocument();
  });

  it('falls back to initials if the image fails to load (fix Google avatar bug)', () => {
    render(<Avatar src="https://broken-url.example/photo.jpg" name="Afif Naufal" />);
    const img = screen.getByRole('img');
    fireEvent.error(img);
    expect(screen.getByText('AN')).toBeInTheDocument();
  });
});