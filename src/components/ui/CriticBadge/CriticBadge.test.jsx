import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CriticBadge from './CriticBadge';

describe('CriticBadge', () => {
  it('renders the rank text', () => {
    render(<CriticBadge rank="Master Critic" />);
    expect(screen.getByText('Master Critic')).toBeInTheDocument();
  });

  it('renders nothing when rank is not provided', () => {
    const { container } = render(<CriticBadge rank={null} />);
    expect(container).toBeEmptyDOMElement();
  });
});