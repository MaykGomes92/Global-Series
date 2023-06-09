import React from "react";
import * as S from "./Styles";
import { GlobalStorage } from "../../../Hook/GlobalContext";
import Header from "../../Header/Header";
import iconStar from "../../../assets/iconStar.svg";
import { EPSODIOS_SEASON, RETORNAR_DETAILS } from "../../../API";
import Loading from "../../Loading/Loading";
import ButtonsTemp from "../ButtonsTemp/ButtonsTemp";

const HomeMovie = () => {
  const { retornarListaApi, setValueInputSearch } =
    React.useContext(GlobalStorage);

  const [detailsMovie, setDetailsMovie] = React.useState([]);
  const [detailsEpisodios, setDetailsEpisodios] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [idFirstTemp, setIdFirstTemp] = React.useState("");
  const [toggleTemp, setToggleTemp] = React.useState("");
  const [numberTemp, setNumberTemp] = React.useState(1)

  function toggleTab({ target }) {
    setToggleTemp(target.classList[2]);
    setNumberTemp(target.innerText.substring(0,2))
  }

  // Pegando detalhes da série
  React.useEffect(() => {
    const idLocal = window.localStorage.getItem("id");
    const { url } = RETORNAR_DETAILS(idLocal);
    retornarListaApi();

    async function detailsMovies() {
      const jsonList = await fetch(url).then((res) => res.json());
      setDetailsMovie(jsonList);
      setIdFirstTemp(
        jsonList.seasons[0].air_date === null
          ? jsonList.seasons[1].id
          : jsonList.seasons[0].id
      );
      setToggleTemp(idFirstTemp);
    }

    setTimeout(() => {
      setLoading(true);
    }, 2000);

    detailsMovies();
    document.title = 'Global Series - '+ detailsMovie.name
  }, [detailsMovie.length]);
  setValueInputSearch("");


  // Pegando detalhes dos episodios
  React.useEffect(() => {
    const idLocal = window.localStorage.getItem("id");
    const {url} = EPSODIOS_SEASON(idLocal,numberTemp)

    async function detailsSerieSeason(){
      const jsonList = await fetch(url).then(res => res.json())
      setDetailsEpisodios(jsonList.episodes)
  }

  detailsSerieSeason()
  },[numberTemp])


  if (!loading) {
    return <Loading />;
  }
  return (
    <S.MainHome2
      backImage={
        detailsMovie.backdrop_path === undefined
          ? "/1qpUk27LVI9UoTS7S0EixUBj5aR.jpg"
          : detailsMovie.backdrop_path
      }
    >
      <main>
        <Header />
        <section className="informationMovie">
          <h1>
            {detailsMovie.name === undefined ? "Halo" : detailsMovie.name}
          </h1>
          <div className="subInformation">
            <p>
              {detailsMovie.production_companies.length === 0
                ? "Amblin Television"
                : detailsMovie.production_companies[0].name}
            </p>
            <p>
              <img src={iconStar} alt="icone de estrela" />
              {detailsMovie.vote_average === undefined
                ? "8.2"
                : detailsMovie.vote_average}
            </p>
            <p>
              {detailsMovie.first_air_date === undefined
                ? 2022
                : detailsMovie.first_air_date.substring(0, 4)}
            </p>
          </div>
          <h2>
            {detailsMovie.genres[0].name === undefined
              ? "Action & Adventure"
              : detailsMovie.genres[0].name}
          </h2>
          <div className="containerSinopse">
            <p className="sinopse">
              {detailsMovie.overview === undefined
                ? "Depicting an epic 26th-century conflict between humanity and an alien threat known as the Covenant, the series weaves deeply drawn personal stories with action, adventure and a richly imagined vision of the future."
                : detailsMovie.overview}
            </p>
          </div>
        </section>

        <section className="containerDetailsSeries">
          <h1>Temporadas:</h1>
          <ul>
            {detailsMovie &&
              detailsMovie.seasons.map((res,index) => (
                <li key={res.id} 
                
                >
                  <ButtonsTemp
                    classTest={res.id}
                    idNameTeste={toggleTemp == res.id ? "positivo" : "negativo"}
                    toggleTab={toggleTab}
                    title={
                      res.air_date !== null
                        ? index + 1 + " Temporada"
                        : ""
                    }
                  />
                </li>
              ))}
          </ul>
        </section>

        <section className="containerDetailsEpisodios">
          <a href={detailsMovie.homepage} target='_blank'>

                    <ul>
                      {detailsEpisodios && 
                        detailsEpisodios.map((res,index) => (
                          <li key={index}>
                            <h1>{res.episode_number}</h1>
                            <img src={`https://image.tmdb.org/t/p/w500${res.still_path}`} alt='foto do episódio'/>
                            <h2>{res.name} <p>{res.overview}</p></h2>
                          </li>
                        ))
                      }
                    </ul>
                        </a>
        </section>
      </main>
    </S.MainHome2>
  );
};

export default HomeMovie;
