import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../../src/components/Button.jsx';

describe('Button Component', () => {
  it('should render with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-blue-600'); // primary
    expect(button).toHaveClass('px-4 py-2'); // md
    expect(button).not.toBeDisabled();
  });

  it.each([
    ['primary', 'bg-blue-600'],
    ['secondary', 'bg-gray-600'],
    ['outline', 'border-gray-300'],
    ['danger', 'bg-red-600'],
    ['success', 'bg-green-600'],
  ])('should render with variant "%s"', (variant, expectedClass) => {
    render(<Button variant={variant}>{variant}</Button>);
    const button = screen.getByRole('button', { name: new RegExp(variant, 'i') });
    expect(button).toHaveClass(expectedClass);
  });

  it.each([
    ['sm', 'px-3 py-1.5'],
    ['md', 'px-4 py-2'],
    ['lg', 'px-6 py-3'],
  ])('should render with size "%s"', (size, expectedClass) => {
    render(<Button size={size}>{size}</Button>);
    const button = screen.getByRole('button', { name: new RegExp(size, 'i') });
    expect(button).toHaveClass(expectedClass);
  });

  it('should be disabled with the disabled prop', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button', { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it('should show a loading indicator and be disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole('button', { name: /loading/i });
    expect(button).toBeDisabled();
    expect(button.querySelector('svg')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    fireEvent.click(screen.getByRole('button', { name: /clickable/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} disabled>Not Clickable</Button>);
    fireEvent.click(screen.getByRole('button', { name: /not clickable/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should not call onClick when loading', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} loading>Not Clickable</Button>);
    fireEvent.click(screen.getByRole('button', { name: /not clickable/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should render with a custom type', () => {
    render(<Button type="submit">Submit</Button>);
    const button = screen.getByRole('button', { name: /submit/i });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('should apply custom className', () => {
    render(<Button className="my-custom-class">Custom</Button>);
    const button = screen.getByRole('button', { name: /custom/i });
    expect(button).toHaveClass('my-custom-class');
  });
});