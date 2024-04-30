import config from "./apikey.js";
import {} from "./search.js";
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

// 기존, Promise 객체를 명시적으로 return 하도록 작성했는데 fetch 자체가 Promise 객체를 return 함.
// fetch 의 결과를 return 하도록 짧게 수정함.
function getJson(url, options) {
  return fetch(url, options)
    .then((response) => response.json())
    .catch((err) => console.log(err));
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
    movieCardTitle.classList.add("ubuntu-bold");
    movieCardTitle.textContent = `${elem["movieTitle"]}`;

    movieCardOverview.setAttribute("class", "movie-collection__card__overview");
    movieCardOverview.classList.add("quicksand");
    movieCardOverview.textContent = `${elem["movieOverview"]}`;

    movieCardRating.setAttribute("class", "movie-collection__card__rating");
    movieCardRating.textContent = `Rating: ${elem["movieRating"]}`;

    movieCard.appendChild(movieCardImage); // Add img
    movieCard.appendChild(movieCardTitle); // Add h4
    movieCard.appendChild(movieCardOverview); // Add p
    movieCard.appendChild(movieCardRating); // Add span

    movieCardCollection.appendChild(movieCard);

    movieCard.addEventListener("click", handleClick);
  });
});

const handleClick = (evt) => {
  const target = evt.target;

  if (target === document.querySelector(".movie-collection__card")) {
    alert(`영화 id : ${target.id}`);
  } else {
    alert(`영화 id : ${target.parentElement.id}`);
  }
};
