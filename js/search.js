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

movieSearchForm.addEventListener("submit", handleSubmit);
