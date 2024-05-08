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
const imgUrl = `https://image.tmdb.org/t/p/w300`;

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
    const movieData2 = response2["results"];

    const recommend = document.querySelector("#recommend_movies");

    movieData2.forEach((element) => {
      const title = element["title"];
      const poster = element["poster_path"];
      const backdrop = imgUrl + element["backdrop_path"];
      const overview = element["overview"];
      const voteAverage = element["vote_average"];
      const id = element["id"];
      const release_date = element["release_date"];

      const moviePoster = document.createElement("img");
      if (poster === null) {
        moviePoster.setAttribute("src", "../image/No_Image_Available.jpg");
      } else {
        moviePoster.setAttribute(
          "src",
          `https://image.tmdb.org/t/p/w300${poster}`
        );
      }

      moviePoster.classList.add("movie-poster");

      const movieInfo = document.createElement("div");
      movieInfo.classList.add("movie-info");

      const movieTitle = document.createElement("h2");
      movieTitle.classList.add("movie-title");
      movieTitle.classList.add("ubuntu-bold");
      movieTitle.textContent = title;

      const movieBackdrop = document.createElement("backdrop"); // Backdrop 링크를 전달하기 위한 방법
      movieBackdrop.textContent = backdrop;
      movieBackdrop.setAttribute("class", "except"); // 보이지 않도록 설정

      const movieOverview = document.createElement("p");
      movieOverview.classList.add("movie-overview");
      movieOverview.classList.add("quicksand-medium");
      movieOverview.textContent = overview;

      const movieRating = document.createElement("span");
      movieRating.classList.add("movie-rating");
      movieOverview.classList.add("quicksand-light");
      movieRating.textContent = `Rating: ${
        Math.round(voteAverage * 100) / 100
      }`;
      movieRating.innerHTML += "<br> <br>";

      const movieId = document.createElement("id");
      movieId.textContent = id;
      movieId.setAttribute("class", "except");

      const movieRelaseDate = document.createElement("date"); // 출시일자 전달하기 위한 방법
      movieRelaseDate.textContent = release_date;
      movieRelaseDate.setAttribute("class", "except"); // 보이지 않도록 설정

      const movieAnchor = document.createElement("a"); // 상세페이지 링크 삽입
      movieAnchor.textContent = `More Information`;
      movieAnchor.setAttribute("href", "./review.html");
      movieAnchor.setAttribute("class", "movie-detail__info__review");
      movieAnchor.classList.add("gowun-dodum-regular");

      const movieCard = document.createElement("div");
      movieCard.setAttribute("data-movie-id", `${id}`);
      movieCard.classList.add("movie-card");

      movieInfo.appendChild(movieTitle);
      movieInfo.appendChild(movieOverview);
      movieInfo.appendChild(movieRating);
      movieInfo.appendChild(movieBackdrop);
      movieInfo.appendChild(movieRelaseDate);
      movieInfo.appendChild(movieId);
      movieInfo.appendChild(movieAnchor);

      movieCard.appendChild(moviePoster);
      movieCard.appendChild(movieInfo);

      recommend.appendChild(movieCard);

      movieAnchor.addEventListener("click", handleClick);
    });
  })
  .catch((err) => console.error(err));

const handleClick = (evt) => {
  const target = evt.target;
  // const targetId = evt.target.parentElement.id;
  const targetImg = evt.target.parentElement.parentElement.firstChild.src;

  const cardData = target.parentElement.childNodes;

  window.sessionStorage.setItem("img", targetImg); // 유사 영화의 poster src 를 별도로 로컬에 저장

  cardData.forEach((elem) => {
    window.sessionStorage.setItem(
      elem.localName,
      elem.textContent ? elem.textContent : elem.src
    );
  });
};
