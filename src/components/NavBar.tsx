import { Link, NavLink } from "react-router";
import logo from "../assets/logo.png";

export default function NavBar() {
  return (
    <header className="nav">
      <Link to="/" className="nav__logo" aria-label="回首頁">
        <img src={logo} alt="BIKE FUN" height={32} />
      </Link>
      <nav className="nav__links">
        <NavLink to="/findbike" className="nav__link">
          尋找單車
        </NavLink>
        <NavLink to="/findroad" className="nav__link">
          尋找車道
        </NavLink>
      </nav>
    </header>
  );
}
