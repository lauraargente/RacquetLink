const faqsDown = document.querySelectorAll('.Faqs-svg-down')
const faqsUp = document.querySelectorAll('.Faqs-svg-up')
const faqsAnswers = document.querySelectorAll('.Faqs-answer')
const headerLi = document.querySelectorAll('.Header-li')

faqsDown.forEach((eachArrowDown, index) => {
    eachArrowDown.addEventListener(`click`, () => {
        
        faqsDown.forEach((eachDown) => { eachDown.classList.remove('Hide') })
        faqsUp.forEach((eachUp) => { eachUp.classList.remove('isActive') })
        faqsAnswers.forEach((eachAnswer) => { eachAnswer.classList.remove('isActive') })

        showAnswer(index);
    })
})

let showAnswer = (index) => {
    faqsDown[index].classList.add('Hide');
    faqsUp[index].classList.add('isActive');
    faqsAnswers[index].classList.add('isActive');
}

faqsUp.forEach((eachUp, index) => (
    eachUp.addEventListener(`click`, () => {
        faqsDown[index].classList.remove('Hide');
        faqsUp[index].classList.remove('isActive');
        faqsAnswers[index].classList.remove('isActive');
    })
))

let seeFaqs = localStorage.getItem('seeFaqs');
if (seeFaqs == 'yes') {
    const element = document.getElementById("Contact-button");
    setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth'})
    }, 1000);
}
localStorage.setItem('seeFaqs', 'no');
