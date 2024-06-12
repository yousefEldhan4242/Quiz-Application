let btn = document.querySelector(".get-quiz-button");
let questionsInput = document.querySelector("#num-questions");
let categoryInput = document.querySelector("#category");
let selectedQuestionsNum;
let selectedCategory;

btn.onclick = () => {
  selectedCategory = categoryInput.value;
  selectedQuestionsNum = questionsInput.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  localStorage.setItem("selectedQuestionsNum", selectedQuestionsNum);
  window.location.href = "quiz.html";
};
