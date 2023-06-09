import React from "react";
import * as S from "./Styles";
import Header from "../Header/Header";
import Button from "../Button/Button";
import { GlobalStorage } from "../../Hook/GlobalContext";
import semFoto from "../../assets/sem_foto.png";
import iconStar from "../../assets/iconStar.svg";
import { MOVIES_MENU, RETORNAR_DETAILS } from "../../API";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Home = () => {
  
  React.useEffect(()=>{
    if(window.localStorage.getItem('refreshOne') !== 'r1'){
      window.localStorage.setItem('refreshOne','r1')
      window.location.reload()
    } else return
  },[])

  const [textTitle, setTextTitle] = React.useState([]);
  const [nameCompanie, setNameCompanie] = React.useState("");
  const [inputWork, setInputWork] = React.useState(true);
  const [listaApi, setListaApi] = React.useState([]);
  const [imgCarrousel, setImgCarrousel] = React.useState(
    "https://image.tmdb.org/t/p/w500/1qpUk27LVI9UoTS7S0EixUBj5aR.jpg"
  );
  const {
    valueInputSearch,
    listaFetchContext,
    retornarListaApi,
    setValueInputSearch,
    setSerieEscolhida,
  } = React.useContext(GlobalStorage);
  const refCarrousel = React.useRef(null);
  // Pegando informações de acordo em qual card do carrousel o mouse está.

  function ativarButton() {
    refCarrousel.current.childNodes.forEach((element, index) => {
      element.addEventListener("mouseover", () => {
        element.children[0].children[0].children[0].style.display = "block";
        element.children[0].children[0].style.display = "block";
        setImgCarrousel(element.children[1].src);
        setTextTitle([
          element.children[0].children[0].children[1].innerText,
          element.children[0].children[0].children[2].innerText,
          element.children[0].children[0].children[3].innerText,
          element.children[0].children[0].children[4].innerText,
        ]);
      });
    });
  }
  // Desativando o botão ''mais detalhes'' do carrousel.
  function desativarButton() {
    refCarrousel.current.childNodes.forEach((element, index) => {
      element.addEventListener("mouseout", () => {
        element.children[0].children[0].children[0].style.display = "none";
        element.children[0].children[0].style.display = "none";
      });
    });
  }

  // Pegando o nome do estudio do filme do card.
  React.useEffect(() => {
    const { url } = RETORNAR_DETAILS(textTitle[3]);
    retornarListaApi();
    async function moviesDetails() {
      const jsonList = await fetch(url).then((res) => res.json());
      const detailsCompanie = await jsonList.production_companies.map(
        (res) => res
      );
      setNameCompanie(detailsCompanie[0].name === undefined ? 'Paramount' : detailsCompanie[0].name);
    }
    moviesDetails();
  }, [textTitle]);

  // Retorando a lista de filmes do menu search.
  React.useEffect(() => {
    const { url } = MOVIES_MENU(valueInputSearch);
    ativarButton();
    async function retornarListaMenuSearch() {
      const jsonList = await fetch(url).then((response) => response.json());
      setListaApi(jsonList.results);
      if (valueInputSearch === "") {
        setInputWork(false);
      } else {
        setInputWork(true);
      }
    }
    retornarListaMenuSearch();
  }, [valueInputSearch, inputWork]);
  // Funcionamento do carrousel
  function leftCarrousel() {
    refCarrousel.current.scrollLeft -= refCarrousel.current.offsetWidth;
  }
  function rightCarrousel() {
    refCarrousel.current.scrollLeft += 222
  }

  function closeMenu() {
    setValueInputSearch("");
  }

  return (
    <S.Main inputWork={inputWork} imgCarrousel={imgCarrousel}>
      <main>
        <Header closeMenu={closeMenu} />
        <ul className="animeMenuDropDown animeDown">
          {listaApi &&
            listaApi.map((show) => (
              <li key={show.id}>
                <Link to="/home/movie">
                  <img
                    onClick={({ target }) => {
                      setSerieEscolhida(show.id);
                      window.localStorage.setItem("id", show.id);
                    }}
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path === null ? semFoto : show.poster_path
                      }`}
                    alt="Foto da série"
                  />
                  <p
                    onClick={({ target }) => {
                      setSerieEscolhida(show.id);
                      window.localStorage.setItem("id", show.id);
                    }}
                  >
                    {show.name}
                  </p>
                </Link>
              </li>
            ))}
        </ul>
        <section className="titleSerie">
          <h1>{textTitle[1] === undefined ? "HALO" : textTitle[1]}</h1>
          <div className="information">
            <p>{nameCompanie === '' ? 'Paramount' : nameCompanie}</p>
            <p id="pIcon">
              <img src={iconStar} alt="icone de uma estrela" />
              {textTitle[0] === undefined ? "8.6" : textTitle[0]}
            </p>
            <p>
              {textTitle[2] === undefined
                ? "2022"
                : textTitle[2].substring(0, 4)}
            </p>
          </div>
          <div onClick={({ target }) => {
            setSerieEscolhida(textTitle[3]);
            window.localStorage.setItem("id", textTitle[3]);
          }}>
            <Button caminhoLink="/home/movie" texto="Mais Detalhes" />
          </div>
        </section>

        <section onClick={closeMenu} className="sectionDown">
          <h2>Mais Séries</h2>
          <div className="carrouselInformation">
            <ul ref={refCarrousel}>
              {listaFetchContext &&
                listaFetchContext.map((show) => (
                  <li key={show.id} onMouseOut={desativarButton}>
                    <Link to="/home/movie">
                      <div
                        onClick={({ target }) => {
                          setSerieEscolhida(show.id);
                          window.localStorage.setItem("id", show.id);
                        }}
                        className="backButton animeDiv"
                      >
                        <Button
                          caminhoLink="/home/movie"
                          texto="Mais detalhes +"
                        />
                        <h3>{show.vote_average}</h3>
                        <h3>{show.name}</h3>
                        <h3>{show.first_air_date}</h3>
                        <h3>{show.id}</h3>
                      </div>
                    </Link>
                    <img
                      className="tes"
                      src={`https://image.tmdb.org/t/p/w500${show.poster_path === null ? semFoto : show.poster_path
                        }`}
                      alt="Foto da série"
                    />
                  </li>
                ))}
            </ul>
          </div>
          <div className="arrowsCarrousel">
            <BsArrowLeftCircleFill onClick={leftCarrousel} />
            <BsArrowRightCircleFill onClick={rightCarrousel} />
          </div>
        </section>
      </main>
    </S.Main>
  );
};

export default Home;
