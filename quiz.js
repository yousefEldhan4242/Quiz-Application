
let countSpan = document.querySelector(".count span")
let bulletsContainer = document.querySelector(".bullets .spans")
let submitBtn = document.querySelector(".submit-button")
let quizArea = document.querySelector(".quiz-area")
let answersArea = document.querySelector(".answers-area")
let result = document.querySelector(".result")
let timer = document.querySelector(".countdown")
let category = document.querySelector(".category span")

let rightAnswers = 0;
let currentIndex = 0;
let countdowninterval;

let questionsNum = localStorage.getItem("selectedQuestionsNum") ;
let categoryToShow = localStorage.getItem("selectedCategory");


function getQuestions(){
    let request = new XMLHttpRequest();
    if (categoryToShow == "pyhton"){
        request.open('GET', 'https://mocki.io/v1/07618f69-ec88-48f2-81e6-fac6ee79b2da');

    }else if(categoryToShow == "HTML"){
        
        request.open('GET', 'https://mocki.io/v1/f8d55086-2d91-489a-a0fc-6399c51d0e48');
    }else if(categoryToShow == "JS"){
        request.open('GET', 'https://mocki.io/v1/85e630f1-6698-43b2-87de-5ff2515d8bec');
        
    }else if(categoryToShow == "TS"){
        request.open('GET', 'https://mocki.io/v1/9e604bca-8d6a-4875-9fb3-27030e6c9ffc');
        
    }else{
        
        request.open('GET', 'https://mocki.io/v1/1dc916d6-dda8-46b0-882e-a2a9f58f3cc5');
    }
    request.send()
    request.onreadystatechange = function(){
        if(request.readyState == 4 && request.status == 200){
            let questions = JSON.parse(request.responseText)
            for (let i = questions.length; i > 0; i--){
                let j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]]
            }

            qLength = questionsNum
            category.innerHTML = categoryToShow

            createBullets(qLength)
            getData(questions[currentIndex] ,  qLength)
            counter(questionsNum * 20 , qLength , questions)


            submitBtn.addEventListener("click", () => {


                let theRightAnswer = questions[currentIndex]["right_answer"]
                    checkAnswer(theRightAnswer)
                        currentIndex++;
                        getData(questions[currentIndex] ,  qLength)
                    
                    let arr = Array.from(bulletsContainer.children);
                    // Remove the 'on' class from all elements
                    arr.forEach((el , index) => {
                        el.classList.remove("on")
                        if (currentIndex === index){
                            el.classList.add("on")
                        }
                    });
                
                    showResult(qLength)
            })
        }
    }
}
getQuestions()

submitBtn.addEventListener("click", function() {

});

function createBullets(num){
    countSpan.innerHTML = num

    for(let i = 0; i < num; i++){
        let theBullet = document.createElement("span");
        // change color "on" class on first element
        if (i === 0){
            theBullet.className = "on"
        }
        bulletsContainer.appendChild(theBullet);
    }
}

function getData(obj, count){
    if (currentIndex < count){

        quizArea.textContent = ""
        answersArea.textContent = ""
        let values = Object.values(obj).slice(1,-1)
    
        for (let i = values.length - 1; i > 0; i--){
            let j = Math.floor(Math.random() * (i + 1));
            [values[i], values[j]] = [values[j], values[i]]
        }

        let h2 = document.createElement("h2");
        h2Text = document.createTextNode(obj["title"]);
        h2.appendChild(h2Text);
        quizArea.appendChild(h2);
    
        for (let i = 1; i <= 4; i++) {
            let mainDiv = document.createElement("div");
            mainDiv.className = "answer"
            let label = document.createElement("label");
            label.htmlFor = `answer-${i}`;
            // label.textContent = obj[`answer_${i}`];
            label.textContent = values[i - 1];
            let input = document.createElement("input");
            input.name = "question"
            input.type = "radio";
            input.id = `answer-${i}`;
            if ( i === 1){
                input.checked = true;
            }
            input.dataset.answer = values[i - 1];
            mainDiv.appendChild(input);
            mainDiv.appendChild(label);
            answersArea.appendChild(mainDiv);
        }
    }
}

function checkAnswer(rAnswer){
    let answers = document.getElementsByName("question");
    let theChosenAswer;
    for (i = 0; i < answers.length; i++) {
        if (answers[i].checked){
            theChosenAswer = answers[i].dataset.answer
        }
    }
    if(rAnswer === theChosenAswer){
        rightAnswers++;
    }
}

function showResult(count){
    if (currentIndex == count) {

        quizArea.remove()
        answersArea.remove()
        submitBtn.remove()
        timer.remove()
        bulletsContainer.remove()
        if (rightAnswers < (count / 3)){
            result.innerHTML = `<span class="bad">bad</span>, You Answered ${rightAnswers} Out Of ${count}`

        }else if (rightAnswers < (count / 1.7)){
            result.innerHTML = `<span class="good">good</span>, You Answered ${rightAnswers} Out Of ${count} `

        }else if (rightAnswers < (count / 1.1)){
            result.innerHTML = `<span class="very-good">very good</span>, You Answered ${rightAnswers} Out Of ${count} `

        }else{
            result.innerHTML = `<span class="perfect">perfect</span>, You Answered ${rightAnswers} Out Of ${count} `
        }
        result.classList.add("show")
    
    }
}

function counter(duration, count, question){
    countdown = setInterval(() =>{
        let minutes = parseInt(duration / 60);
        let secondes = parseInt(duration % 60);

        minutes  = minutes < 10 ? `0${minutes}` : minutes;
        secondes  = secondes < 10 ? `0${secondes}` : secondes;
        timer.innerHTML = `${minutes}:${secondes}`
        if (--duration < 0){
            let rAnswer = question[currentIndex]["right_answer"]
            checkAnswer(rAnswer)
            currentIndex = count
            showResult(count)
        }

    },1000)
}