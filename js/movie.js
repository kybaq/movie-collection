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
export async function getMoviePromise(url, options) {
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

    const topMovies = data["results"];

    topMovies.forEach((elem) => {
      let movieInfo = {
        movieTitle: `${elem["title"]}`,
        moviePoster: `${imgUrl}${elem["poster_path"]}}`,
        movieBackdrop: `${imgUrl}${elem["backdrop_path"]}}`,
        movieOverview: `${elem["overview"]}`,
        movieRating: `${elem["vote_average"]}`,
        movieID: `${elem["id"]}`, // movie-collection__card 만들 때, id 추가해서 넣어주기
        movieDate: `${elem["release_date"]}`, // review.html 의 .movie-detail__info__date 에서 사용.
      };

      movieList.push(movieInfo);

      console.log(movieList[0].movieBackdrop);
    });
    return movieList;
  };
  // 이제야 필요한 5가지 정보를 편하게 객체로 사용할 수 있게됨.
  const movies = getMovieList(data);

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
    movieCardRating.classList.add("ubuntu-medium");
    movieCardRating.textContent = `Rating: ${elem["movieRating"]}`;
    movieCardRating.innerHTML += "<br>";

    const movieID = document.createElement("id");
    movieID.textContent = `${elem["movieID"]}`;
    movieID.setAttribute("style", "display: none");


    movieCard.appendChild(movieCardImage); // Add img
    movieCard.appendChild(movieCardTitle); // Add h4
    movieCard.appendChild(movieCardOverview); // Add p
    movieCard.appendChild(movieCardRating); // Add span
    movieCard.appendChild(movieID); // Add ID

    const movieDetailAnchor = document.createElement("a"); // 상세페이지 링크 삽입
    movieDetailAnchor.textContent = "영화 상세 정보";
    movieDetailAnchor.setAttribute("href", "./template/review.html");
    movieDetailAnchor.setAttribute("class", "movie-detail__info__review");
    movieDetailAnchor.classList.add("gowun-dodum-regular");

    movieCard.appendChild(movieDetailAnchor);

    movieCardCollection.appendChild(movieCard);

    movieDetailAnchor.addEventListener("click", handleClick);
    // movieCard.addEventListener("click", handleClick);
  });
});

// const handleClick = (evt) => {
//   const target = evt.target;

//   if (target === document.querySelector(".movie-collection__card")) {
//     console.dir(target);
//   } else {
//     console.dir(target.parentElement);
//   }
// };

// const movieAnchor = document.querySelectorAll(".movie-detail__info__review");

// localstorage 통해서 저장.
const handleClick = (evt) => {
  const target = evt.target;
  const cardData = target.parentElement.childNodes;
  console.dir(cardData);

  cardData.forEach((elem) => {
    window.sessionStorage.setItem(
      elem.localName,
      elem.textContent ? elem.textContent : elem.src
    );
  });
};
// (poster) -> img : src
// (title) -> h2 : textContent
// (overview) -> p : textContent
// (rating) -> span : textContent
