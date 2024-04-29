import config from "./apikeys.js";
// api key import

const { API_KEY } = config;
const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1`;
const imgUrl = `https://image.tmdb.org/t/p/w300/`;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

// Promise 객체를 모두 불러와 변수에 저장해서 사용하고 싶다.
async function getMoviePromise(url, options) {
  const list = await getJson(url, options);

  return list;
}

function getJson(url, options) {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then((response) => response.json())
      .then((data) => {
        resolve(data);
      })
      .catch((err) => reject(err));
  });
}

const moviePromise = getMoviePromise(url, options);

// Promise 객체 사용을 위해
moviePromise.then((data) => {
  const getMovieList = (data) => {
    const movieList = new Array();

    const topMoives = data["results"];

    topMoives.forEach((elem) => {
      let movieInfo = {
        movieTitle: `${elem["title"]}`,
        moviePoster: `${imgUrl}${elem["poster_path"]}}`,
        movieOverview: `${elem["overview"]}`,
        movieRating: `${elem["vote_average"]}`,
        movieID: `${elem["id"]}`, // movie-collection__card 만들 때, id 추가해서 넣어주기
      };

      movieList.push(movieInfo);
    });
    return movieList;
  };
  // 이제야 필요한 5가지 정보를 편하게 객체로 사용할 수 있게됨.
  const movies = getMovieList(data);

  console.log(movies);
  movies.forEach((elem) => {
    const movieCardCollection = document.querySelector(".movie-collection"); // card container 선택.
    const movieCard = document.createElement("article"); // movie card

    movieCard.setAttribute("class", "movie-collection__card"); // css class 설정
    movieCard.setAttribute("id", `${elem["movieID"]}`); // css id 설정, 후에 alert 에 사용할 것임

    // const movieCardFig = document.createElement("figure");
    const movieCardImage = document.createElement("img"); // Fig > Image

    // movieCardFig.appendChild(movieCardImage);
    movieCardImage.setAttribute("class", "movie-collection__card__image");
    movieCardImage.setAttribute("src", `${elem["moviePoster"]}`);

    const movieCardTitle = document.createElement("h2");
    const movieCardOverview = document.createElement("p");
    const movieCardRating = document.createElement("span");

    movieCardTitle.setAttribute("class", "movie-collection__card__title");
    movieCardTitle.textContent = `${elem["movieTitle"]}`;

    movieCardOverview.setAttribute("class", "movie-collection__card__overview");
    movieCardOverview.textContent = `${elem["movieOverview"]}`;

    movieCardRating.setAttribute("class", "movie-collection__card__rating");
    movieCardRating.textContent = `Rating: ${elem["movieRating"]}`;

    movieCard.appendChild(movieCardImage); // Add figure
    movieCard.appendChild(movieCardTitle); // Add h4
    movieCard.appendChild(movieCardOverview); // Add p
    movieCard.appendChild(movieCardRating); // Add span
    // movieCard.addEventListener("click", handleSubmit); // Add eventlistener

    movieCardCollection.appendChild(movieCard);

    movieCard.addEventListener("click", handleClick, true);
  });
});

const movieSearchForm = document.querySelector(".search-bar__form");
const movieSearchInput = document.querySelector(".search-bar__input");
// 검색 기능

const handleSubmit = (evt) => {
  evt.preventDefault();
  const searchValue = movieSearchInput.value.toLowerCase();

  printSearchResult(searchValue);
};

const printSearchResult = (searchValue) => {
  const cardList = document.querySelectorAll(".movie-collection__card__title");
  console.log(cardList);

  cardList.forEach((elem) => {
    if (elem.innerText.toLowerCase().includes(`${searchValue}`) !== true) {
      elem.parentElement.classList.add("except");
    } else if (searchValue === "") {
      elem.parentElement.classList.remove("except");
    } else {
      elem.parentElement.classList.remove("except");
    }
  });
};

const handleClick = (evt) => {
  evt.stopPropagation();
  const target = evt.target;

  if (target === document.querySelector(".movie-collection__card")) {
    alert(`영화 id : ${target.id}`);
  } else {
    alert(`영화 id : ${target.parentElement.id}`);
  }
};

movieSearchForm.addEventListener("submit", handleSubmit);

window.addEventListener("load", () => {
  movieSearchInput.focus();
});
