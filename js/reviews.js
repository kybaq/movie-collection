const formSubmit = document.querySelector(".review-submit");
const reviewInput = document.querySelector(".review-write-input"); // 리뷰 작성 input
const reviewBox = document.querySelector(".review-box"); // 리뷰 li감싸고 있는 ul
const reviewModalClose = document.querySelector(".delete-modal-close"); // 리뷰 모달
const editModalClose = document.querySelector(".edit-modal-close");
const deleteModalBtn = document.querySelector(".delete-modal-btn");
const userbox = document.querySelector(".user-name-btn-box");
const reviewEmpty = document.querySelector(".review-empty");
const reviewFilterEmpty = document.querySelector(".review-filter-empty");

// 로컬에 리뷰 있으면 가져오기
let reviews = localStorage.getItem("reviews")
  ? JSON.parse(localStorage.getItem("reviews"))
  : [];

// 로컬에서 선택한 영화 ID 가져오기
const currentMovieId = localStorage.getItem("currentMovieId");

// 댓글을 표시할 때 선택한 영화 ID와 댓글의 영화 ID를 비교하여 필터링
const filteredMovieId = reviews.filter(
  (review) => parseInt(review.movieid) === parseInt(currentMovieId)
);

// 영화 리뷰 유무 표시
const reviewsFilter = () => {
  if (
    reviews.filter((review) => review.movieid === currentMovieId).length === 0
  ) {
    reviewFilterEmpty.classList.add("open");
  } else {
    reviewFilterEmpty.classList.remove("open");
  }
};

let deleteUserTarget = [];
let editUserTarget = [];

let targetDelete = null; // 삭제할 요소
let editItemId = null; // 현재 수정 중인 리뷰의 ID를 저장할 변수
let targetEditItem = null; // 수정 모달창에 전달할 수정전 text

// 로컬스토리지에 저장
const save = () => {
  // 리뷰 정보가 담긴  reviews배열 저장
  localStorage.setItem("reviews", JSON.stringify(reviews)); // 문자열로 변환
};

// 리뷰 삭제 이벤트
const deleteItem = (e) => {
  const passwordDeleteInput = document.querySelector("#password-delete-input");
  const reviewModalH4 = document.querySelector(".delete-modal-h4");
  const targetUserName = e.target.parentElement.querySelector(".user-name");
  const userName = targetUserName.innerText;
  targetDelete = e.target.parentElement;
  reviewModalH4.innerText = userName;
  passwordDeleteInput.value = "";
  deleteAlertOpenClose("close");
  modalOpenClose("open");
};

// 삭제 버튼 (모달)
deleteModalBtn.addEventListener("click", () => {
  const passwordDeleteInput = document.querySelector("#password-delete-input"); // 삭제 모달 Password input

  deleteUserTarget = reviews.filter(
    (review) => review.id === parseInt(targetDelete.id)
  );

  // 리뷰 삭제시 유저 비밀번호 확인
  if (deleteUserTarget[0].userpass === sha256(passwordDeleteInput.value)) {
    // 유저정보 일치
    reviews = reviews.filter(
      (review) => review.id !== parseInt(targetDelete.id)
    ); // id가 같지 않는것만 필터링해서 삭제 후 reviews에 할당

    save(); // 저장
    targetDelete.remove();
    passwordDeleteInput.value = "";
    deleteAlertOpenClose("close");
    alert("삭제가 완료되었습니다!");
    modalOpenClose("close");

    // 삭제 후 필터링된 리뷰가 없는지 확인 후 경고창 표시
    reviewsFilter();
  } else {
    deleteAlertOpenClose("open");
  }
});

// 수정 버튼
const editItem = (e) => {
  const editPasswordInput = document.querySelector(".edit-password-input");
  const editModalH4 = document.querySelector(".edit-modal-h4");
  const editInput = document.querySelector(".edit-input");
  const itemId = e.target.parentElement.id;
  const targetEditText = e.target.parentElement.querySelector(".review-text"); // 내가 선택한 부모요소의 review-text요소를 가져옴
  const userName = e.target.parentElement.querySelector(".user-name");
  const currentText = targetEditText.innerText; // 기존에 썼던 text 저장
  editInput.value = currentText;
  editModalH4.innerText = userName.innerText;
  editItemId = itemId;
  targetEditItem = targetEditText;
  editPasswordInput.value = "";

  editAlertOpenClose("close");
  editModalOpenClose("open");
};

//  모달창에 비밀번호 입력 시 리뷰 수정
const editModalBtn = document.querySelector(".edit-modal-btn");
const editInput = document.querySelector(".edit-input");
const editPasswordInput = document.querySelector(".edit-password-input");
editModalBtn.addEventListener("click", () => {
  editUserTarget = reviews.filter(
    (review) => review.id === parseInt(editItemId)
  );

  // 수정할때 유저 비밀번호 확인
  if (editUserTarget[0].userpass !== sha256(editPasswordInput.value)) {
    editAlertOpenClose("open");
    return;
  } else {
    editAlertOpenClose("close");
  }

  const editText = editInput.value; // 수정 후 리뷰 Text

  if (editText !== null) {
    targetEditItem.innerText = editText; // 수정한 리뷰로 체인지
    const index = reviews.findIndex(
      (review) => review.id === parseInt(editItemId)
    );

    if (index !== -1) {
      reviews[index].reviewText = editText;
      save();
    }

    editPasswordInput.value = "";
    alert("수정이 완료되었습니다!");
    editModalOpenClose("close");
  }
});

// 리뷰 추가
const addItem = (review) => {
  if (review.reviewText !== "") {
    const li = document.createElement("li");

    li.classList.add("review-list");

    li.innerHTML = `
			<div class="user-review-box">
				<p class="user-name">${review.user}<span class="user-name-sub"> 님의 리뷰</span></p>
				<p class="review-text">${review.reviewText}</p>
			</div>
			<button class="delete-btn">삭제</button>
			<button class="edit-btn">수정</button>
			`;

    // 새로운 리뷰의 위치를 결정하기 위해 이전 리뷰들과의 비교
    // const existingReview = reviewBox.querySelector(`li[id="${review.id}"]`);
    const existingReview = reviewBox.querySelector(".review-list"); //reviewBox안에 있는 li선택
    if (existingReview) {
      // 리뷰가 있으면, 새로운 리뷰 삽입(insertBefore : 특정 위치 앞에 노드 삽입)
      reviewBox.insertBefore(li, existingReview);
    } else {
      // 새로운 리뷰가 없는 경우 가장 앞에 추가
      reviewBox.prepend(li); // prepend : 선택한 블록에 제일 첫번째로 추가
    }

    li.id = review.id; // li에 review.id값 저장.(HTML안에 저장한값은 문자열로 돼있으니 나중에 꺼낼때 숫자로 바꿔주기)

    const deleteBtn = document.querySelector(".delete-btn");
    const editBtn = document.querySelector(".edit-btn");

    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);
  }
};

const submitHandler = (e) => {
  e.preventDefault();
  const userName = document.querySelector("#username").value.trim();
  const userPassword = document.querySelector("#password").value.trim();
  const usernameClass = document.querySelector(".usernameClass");
  const passwordClass = document.querySelector(".passwordClass");
  const userLoginAlert = document.querySelector(".user-login-alert");
  const reviewTextAlert = document.querySelector(".review-text-alert");
  const userPasswordAlert = document.querySelector(".user-password-alert");

  const inputValue = reviewInput.value.trim();
  // 로그인, 리뷰, 입력 안할 시 경고문
  if (userName === "" || userPassword === "") {
    userLoginAlert.classList.add("open");
    reviewTextAlert.classList.remove("open");
    return;
  } else if (inputValue === "") {
    reviewTextAlert.classList.add("open");
    userLoginAlert.classList.remove("open");
    return;
  } else {
    userLoginAlert.classList.remove("open");
    reviewTextAlert.classList.remove("open");
    usernameClass.value = "";
    passwordClass.value = "";
    reviewInput.value = "";
  }

  // 같은 아이디가 있을때는, 비밀번호만 맞으면 리뷰작성 가능
  for (let i = 0; i < reviews.length; i++) {
    if (
      userName === reviews[i].user &&
      sha256(userPassword) !== reviews[i].userpass
    ) {
      userPasswordAlert.classList.add("open");
      return;
    } else {
      userPasswordAlert.classList.remove("open");
    }
  }

  const review = {
    id: Date.now(),
    user: userName,
    userpass: sha256(userPassword),
    reviewText: inputValue,
    movieid: currentMovieId,
  };

  addItem(review);
  reviews.push(review);
  save();

  reviewInput.value = "";
  reviewInput.focus();
  alert("리뷰 등록이 완료되었습니다!");

  // 새 리뷰가 추가되면 필터링된 리뷰가 있는지 확인 후 경고창 표시 및 제거
  reviewsFilter();
};

// 로컬저장소에서 데이터를 꺼내 화면에 출력
const drawReviewList = () => {
  // 꺼내올때는 파싱(parse)해야함(JS 배열 형태로 가져옴)
  const userReviews = JSON.parse(localStorage.getItem("reviews"));

  // userReviews있으면 화면에 보여주기
  if (userReviews) {
    userReviews.forEach((review) => {
      // 클릭한 현재 영화 id랑 같은 댓글만 화면에 출력
      if (review.movieid === currentMovieId) {
        addItem(review); // 화면에 출력
      }
    });

    reviews = userReviews;

    // 필터링된 리뷰가 없는 경우 경고창 표시
    reviewsFilter();
  }
};

// 모달 X 버튼 클릭시
reviewModalClose.addEventListener("click", () => {
  modalOpenClose("close");
});
editModalClose.addEventListener("click", () => {
  editModalOpenClose("close");
});

// 모달 열고 닫는 함수
const modalOpenClose = (modal) => {
  const reviewModalConteiner = document.querySelector(
    ".delete-modal-conteiner"
  );
  if (modal === "open") {
    reviewModalConteiner.classList.add("open");
  }

  if (modal === "close") {
    reviewModalConteiner.classList.remove("open");
  }
};

// 경고문구 열고 닫는 함수
const deleteAlertOpenClose = (alert) => {
  const deleteUserInfoNotAlert = document.querySelector(
    ".delete-user-info-not-alert"
  ); // 경고문구

  if (alert === "open") {
    deleteUserInfoNotAlert.classList.add("open");
  }

  if (alert === "close") {
    deleteUserInfoNotAlert.classList.remove("open");
  }
};
const editAlertOpenClose = (alert) => {
  const editAlert = document.querySelector(".edit-user-info-not-alert");

  if (alert === "open") {
    editAlert.classList.add("open");
  }

  if (alert === "close") {
    editAlert.classList.remove("open");
  }
};

const editModalOpenClose = (edit) => {
  const editModalConteiner = document.querySelector(".edit-modal-conteiner");

  if (edit === "open") {
    editModalConteiner.classList.add("open");
  }

  if (edit === "close") {
    editModalConteiner.classList.remove("open");
  }
};

drawReviewList();

formSubmit.addEventListener("submit", submitHandler);
