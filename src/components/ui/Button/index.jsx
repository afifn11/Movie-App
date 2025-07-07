import styled from 'styled-components';
import theme from '../../../utils/constants/theme';

const Button = styled.button`
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  background-color: ${({ variant }) =>
    variant && theme.colors[variant] ? theme.colors[variant] : theme.colors.primary};
  padding: ${({ size }) =>
    size && theme.sizes[size] ? theme.sizes[size] : theme.sizes.md};
  width: ${({ full }) => (full ? '100%' : 'auto')};
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ variant }) =>
      variant && theme.colors.hover[variant] ? theme.colors.hover[variant] : theme.colors.hover.primary};
  }
`;

export default Button;
