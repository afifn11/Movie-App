// src/components/Navbar/Navbar.Styled.js
import styled from "styled-components";
import { Link } from "react-router-dom";

export const Container = styled.div`
  background-color: #0F172A;
  padding: 1rem;
  color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export const Brand = styled.h1`
  font-size: 2.4rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin-bottom: 0;
  }
`;

export const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;

  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

export const NavItem = styled.li`
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    margin: 0 1rem;
  }
`;

export const NavLink = styled(Link)`
  text-decoration: none;
  color: #fff;

  &:hover {
    color: #ffd60a;
  }
`;
