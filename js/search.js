const movieSearchForm = document.querySelector(".search-bar__form");
const movieSearchInput = document.querySelector(".search-bar__input");

// 검색 기능
const handleSubmit = (evt) => {
  evt.preventDefault();
  const searchValue = movieSearchInput.value.trim().toLowerCase();
  if (searchValue.length >= 2) {
    printSearchResult(searchValue);
  } else {
    alert("2글자 이상 검색해주세요");
  }
};

const printSearchResult = (searchValue) => {
  const cardList = document.querySelectorAll(".movie-collection__card__title");

  cardList.forEach((elem) => {
    if (elem.innerText.toLowerCase().includes(searchValue)) {
      elem.parentElement.classList.remove("except");
    } else {
      elem.parentElement.classList.add("except");
    }
  });
};

movieSearchForm.addEventListener("submit", handleSubmit);
