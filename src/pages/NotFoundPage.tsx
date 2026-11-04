import { Link } from "react-router";
import NavBar from "../components/NavBar";

export default function NotFoundPage() {
  return (
    <div className="app home">
      <NavBar />
      <main className="home__main">
        <h1 className="home__slogan">找不到這個頁面</h1>
        <p>請確認網址或點擊下列連結</p>
        <div className="links">
          <Link className="btn btn--primary" to="/">
            首頁
          </Link>
          <Link className="btn btn--primary" to="/findbike">
            單車頁
          </Link>
          <Link className="btn btn--primary" to="/findroad">
            車道頁
          </Link>
        </div>
      </main>
    </div>
  );
}
