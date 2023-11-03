var backButtons = document.querySelectorAll('.register-element-back')
var nextButtons = document.querySelectorAll('.register-element-next')
var registerContainer = document.querySelector('#register-container')
var currentProgress = document.querySelector('#current-progress')

var currentPosition = 0
var currentProgressValue = 0

var checkPossibleMotionBack = function() {
    if (currentPosition === 0) {
        backButtons[0].style.pointerEvents = 'none'
        backButtons[0].style.opacity = '0'
    } else {
        backButtons[0].style.pointerEvents = 'auto'
        backButtons[0].style.opacity = '1'
    }
}

checkPossibleMotionBack()

backButtons.forEach( (backButtons) => {
    backButtons.addEventListener('click', () => {
        currentPosition = currentPosition + 100
        checkPossibleMotionBack()
        registerContainer.style.transform = `translateY(${currentPosition}vh)`
        currentProgressValue = currentProgressValue - 10
        console.log(currentProgressValue)
        currentProgress.style.width = `${currentProgressValue}%`
    })
})

nextButtons.forEach(nextButtons => {
    nextButtons.addEventListener('click', () => {
        // checkPossibleMotion()
        currentPosition = currentPosition - 100
        // checkPossibleMotionBack(backButtons)
        registerContainer.style.transform = `translateY(${currentPosition}vh)`
        currentProgressValue = currentProgressValue + 10
        currentProgress.style.width = `${currentProgressValue}%`
    })
})