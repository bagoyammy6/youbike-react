import { useNavigate } from "react-router";
import NavBar from "../components/NavBar";
import SearchForm from "../components/SearchForm";
import { BIKE_CITIES } from "../lib/counties";
import ride1 from "../assets/rideBike1.svg";
import ride2 from "../assets/rideBike2.svg";
import ride3 from "../assets/rideBike3.svg";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="app home">
      <NavBar />
      <main className="home__main">
        <h1 className="home__slogan">
          尋找單車，
          <br />
          來場悠閒的放鬆之旅！
        </h1>
        <SearchForm
          className="search--home"
          cities={BIKE_CITIES}
          city={null}
          keyword=""
          placeholder="請輸入車站名稱"
          onSearch={(city, q) => {
            const params = new URLSearchParams({ city });
            if (q) params.set("q", q);
            navigate(`/findbike?${params}`);
          }}
        />
        <div className="home__pics" aria-hidden>
          <img src={ride2} alt="" />
          <img src={ride1} alt="" />
          <img src={ride3} alt="" />
        </div>
      </main>
    </div>
  );
}
