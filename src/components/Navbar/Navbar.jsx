// src/components/Navbar/Navbar.jsx
import {
  Container,
  Nav,
  Brand,
  NavList,
  NavItem,
  NavLink,
} from "./Navbar.styled";

const Navbar = () => {
  return (
    <Container>
      <Nav>
        <Brand>Movie App</Brand>
        <NavList>
          <NavItem>
            <NavLink to="/">Home</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/movie/create"> Add Movie</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/movie/popular">Popular</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/movie/now">Now Playing</NavLink>
          </NavItem>
          <NavItem>
            <NavLink to="/movie/top">Top Rated</NavLink>
          </NavItem>
        </NavList>
      </Nav>
    </Container>
  );
};

export default Navbar;
