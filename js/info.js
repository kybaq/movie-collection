const movieDetail = document.querySelector(".movie-detail");

const moiveDetailHtml = `
<article class="movie-detail__info">
<div class="movie-detail__info__box">
  <img class="movie-detail__info__image" src="#" alt="" />
</div>

<div class="movie-detail__info__box">
  <h4 class="movie-detail__info__title">
  </h4>

  <div class="movie-detail__info__span_box">
    <span class="movie-detail__info__rating"></span>
    <span class="movie-detail__info__date"></span>
  </div>

  <p class="movie-detail__info__overview">
  </p>
</div>
`;

// 전체 구조 구성
movieDetail.setAttribute("innerHTML", moiveDetailHtml);

// 영화 포스터 불러오기
const movieDetailImage = document.querySelector(".movie-detail__info__image");
const movieImageSrc = window.sessionStorage.getItem("img");
movieDetailImage.setAttribute("src", movieImageSrc);

// 영화 제목 불러오기
const movieDetailTitle = document.querySelector(".movie-detail__info__title");
const movieTitleText = window.sessionStorage.getItem("h2");
movieDetailTitle.textContent = movieTitleText;

// 영화 평점 불러오기
const movieDetailRating = document.querySelector(".movie-detail__info__rating");
const movieRatingText = window.sessionStorage.getItem("span");
movieDetailRating.textContent = movieRatingText;

// 영화 출시일자 불러오기
const movieDetailDate = document.querySelector(".movie-detail__info__date");
const movieDateText = window.sessionStorage.getItem("date");
movieDetailDate.textContent = `Release Date : ${movieDateText}`;

// 영화 줄거리 불러오기
const movieDetailOverview = document.querySelector(
  ".movie-detail__info__overview"
);
const movieOverviewText = window.sessionStorage.getItem("p");
movieDetailOverview.textContent = movieOverviewText;

// 영화 backdrop 설정
const movieBackGroundImage = document.querySelector(
  ".movie-detail__info::after"
);

const movieBackdropImage = window.sessionStorage.getItem("backdrop");

const styleTag = document.createElement("style");
styleTag.innerHTML = `.movie-detail__info::after {
  height: 100%;
  width: 100%;
  content: "";
  background-image: url("${movieBackdropImage}");
  background-size: cover;
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: -1;
  filter: blur(20px);
}`;

document.head.appendChild(styleTag);

// 추천 영화 불러오기
const ID = window.sessionStorage.getItem("id");

import config from "./apikey.js";
// api key import

const { API_KEY } = config;

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

fetch(
  `https://api.themoviedb.org/3/movie/${ID}/similar?language=en-US&page=1`,
  options
)
  .then((response2) => response2.json())
  .then((response2) => {
    console.log(response2);
    const movieData2 = response2["results"];

    const recommend = document.querySelector("#recommend_movies");

    movieData2.forEach((element) => {
      const img = element["poster_path"];
      const title = element["title"];
      const overview = element["overview"];
      const voteAverage = element["vote_average"];
      const id = element["id"];

      let moviePoster = document.createElement("img");
      moviePoster.setAttribute("src", `https://image.tmdb.org/t/p/w400${img}`);
      moviePoster.classList.add("movie-poster");

      const movieInfo = document.createElement("div");
      movieInfo.classList.add("movie-info");

      const movieTitle = document.createElement("h3");
      movieTitle.classList.add("movie-title");
      movieTitle.textContent = title;

      const movieOverview = document.createElement("p");
      movieOverview.classList.add("movie-overview");
      movieOverview.textContent = overview;

      const movieRating = document.createElement("p");
      movieRating.classList.add("movie-rating");
      movieRating.textContent = `Rating: ${voteAverage}`;

      const movieCard = document.createElement("div");
      movieCard.setAttribute("data-movie-id", `${id}`);
      movieCard.classList.add("movie-card");

      movieInfo.appendChild(movieTitle);
      movieInfo.appendChild(movieOverview);
      movieInfo.appendChild(movieRating);

      movieCard.appendChild(moviePoster);
      movieCard.appendChild(movieInfo);

      recommend.appendChild(movieCard);
    });
  })
  .catch((err) => console.error(err));

