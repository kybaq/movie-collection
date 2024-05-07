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
// const movieDetailDate = document.querySelector(".movie-detail__info__date");
// const movieDateText = window.sessionStorage.getItem();
// moviDetailDate.textContent = moviDateText;

// 영화 줄거리 불러오기
const movieDetailOverview = document.querySelector(
  ".movie-detail__info__overview"
);
const movieOverviewText = window.sessionStorage.getItem("p");
movieDetailOverview.textContent = movieOverviewText;