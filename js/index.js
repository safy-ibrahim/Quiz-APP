
let quizOptionsForm = document.querySelector('#quizOptions');
let categoryOptionsInput = document.querySelector('#categoryMenu');
let questionsLevelsInput = document.querySelector('#questionsLevels');
let questionsNumberInput = document.querySelector('#questionsNumber');
let startQuizBtn = document.querySelector('#startQuizBtn');

let questionsArr;
let myQuiz;

startQuizBtn.addEventListener('click', async function () {

  let categoryOptions = categoryOptionsInput.value;
  let questionsLevels = questionsLevelsInput.value;
  let questionsNumber = questionsNumberInput.value;

  myQuiz = new Quiz(categoryOptions, questionsLevels, questionsNumber);
  questionsArr = await myQuiz.fetchAllQuestions();
  let myQuestion = new Question(0)
  quizOptionsForm.classList.replace('d-flex', 'd-none');
  myQuestion.display();

})

class Quiz {

  constructor(category, level, number) {
    this.category = category;
    this.level = level;
    this.number = number;
    this.score = 0;
  }

  getApi() {
    return `https://opentdb.com/api.php?amount=${this.number}&category=${this.category}&difficulty=${this.level}`
  }

  async fetchAllQuestions() {
    let response = await fetch(this.getApi());
    let finalData = await response.json();
    return finalData.results;
  }

  showFinalResult() {
    return `
    <div
      class="question shadow-lg col-lg-12  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3"
      >
      <h2 class="mb-0">
      ${this.score == this.number ? `congratulations` : `your score is ${this.score} of ${this.number}`}   
      </h2>
      <button class="againBtn btn btn-primary rounded-pill"><i class="bi bi-arrow-repeat"></i> Try Again</button>
    </div>
    `
  }
}

class Question {

  constructor(index) {
    this.index = index;
    this.category = questionsArr[index].category;
    this.correct_answer = questionsArr[index].correct_answer;
    this.difficulty = questionsArr[index].difficulty;
    this.incorrect_answers = questionsArr[index].incorrect_answers;
    this.question = questionsArr[index].question;
    this.allAnswersArr = this.getAllAnswers();
    this.isAnswer = false;
  }

  getAllAnswers() {
    let ansArr = [...this.incorrect_answers, this.correct_answer];
    ansArr.sort();
    return ansArr
  }

  display() {
    const questionMarkUp = `
      <div class="question shadow-lg col-lg-6 offset-lg-3  p-4 rounded-3 d-flex flex-column justify-content-center align-items-center gap-3 animate__animated animate__bounceIn">
        
        <div class="w-100 d-flex justify-content-between">
          <span class="btn btn-category">${this.category}</span>
          <span class="fs-6 btn btn-questions"> ${this.index + 1} of ${questionsArr.length} Questions</span>
        </div>
        <h2 class="text-capitalize h4 text-center">${this.question}</h2>  
        <ul class="choices w-100 list-unstyled m-0 d-flex flex-wrap text-center">

          ${this.allAnswersArr.map(element => {
      return `<li>${element}</li>`
    }).join(' ')}

        </ul>
        <h2 class="text-capitalize text-center score-color h3 fw-bold"><i class="bi bi-emoji-laughing"></i> Score: ${myQuiz.score}</h2>        
      </div>

    `
    document.querySelector('#displayQuestionResult').innerHTML = questionMarkUp;

    let choices = document.querySelectorAll('.choices li')
    choices.forEach((li) => {
      li.addEventListener('click', () => {
        this.checkAnswer(li);
        this.nextQuestion();
      })
    })

  }

  checkAnswer(liChoiced) {
    if (this.isAnswer == false) {
      this.isAnswer = true;
      if (liChoiced.innerHTML == this.correct_answer) {
        liChoiced.classList.add('correct', "animate__animated", 'animate__pulse');
        myQuiz.score++;
      } else {
        liChoiced.classList.add('wrong', "animate__animated", 'animate__shakeX');
      }

    }
  }

  nextQuestion() {
    this.index++;

    setTimeout(() => {

      if (this.index < questionsArr.length) {
        let nextQuestionObj = new Question(this.index);
        nextQuestionObj.display();
      } else {
        let finalResult = myQuiz.showFinalResult();
        document.querySelector('#displayQuestionResult').innerHTML = finalResult;
        document.querySelector('.againBtn').addEventListener('click', () => {
          window.location.reload();
        })
      }

    }, 1500);
  }
}