document.addEventListener('DOMContentLoaded', (event) => {
    const touchButton = document.getElementById('touch_button');
    const speakButton = document.getElementById('speak_button');
    const tapSound = document.getElementById('tapSound');

    function playTapSound() {
        tapSound.currentTime = 0; // Reset the audio to the beginning
        tapSound.play();
    }

    touchButton.addEventListener('mousedown', playTapSound);
    speakButton.addEventListener('mousedown', playTapSound);

    // Prevent default action on touch devices
    touchButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        playTapSound();
    });
    speakButton.addEventListener('touchstart', function(e) {
        e.preventDefault();
        playTapSound();
    });

    const infoToggle = document.getElementById('info-toggle');
    const projectInfo = document.getElementById('project-info');

    infoToggle.addEventListener('click', () => {
        projectInfo.classList.toggle('show');
    });
});

let bubbleText1 = "Hello! Be a ball please";
let bubbleText2 = "We're turning the cube into a bouncing ball! The cube will show a ball bouncing around on the screen. You can tilt the cube (using the arrows) to change its direction, and when it hits a wall, it will bounce back and make a sound!";

let isRightBubble = true;

function createBubble(text, isRight) {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${isRight ? 'bubble-right' : 'bubble-left'}`;
    bubble.textContent = text;
    
    document.body.appendChild(bubble);
    
    // Запускаем анимацию появления
    requestAnimationFrame(() => {
        bubble.classList.add('show');
    });
    
    // Запускаем анимацию исчезновения через 2 секунды
    setTimeout(() => {
        bubble.classList.remove('show');
        bubble.classList.add('hide');
        
        // Удаляем элемент после завершения анимации
        setTimeout(() => bubble.remove(), 500);
    }, 2000);
}

function showNextBubble() {
    if (isRightBubble) {
        createBubble(bubbleText1, true);
    } else {
        createBubble(bubbleText2, false);
    }
    isRightBubble = !isRightBubble;
}

document.addEventListener('DOMContentLoaded', () => {
    const clickableArea = document.getElementById('clickable-area');
    
    clickableArea.addEventListener('click', showNextBubble);
    
    // Добавляем обработку события touchstart для мобильных устройств
    clickableArea.addEventListener('touchstart', function(event) {
        event.preventDefault(); // Предотвращаем зум на мобильных устройствах
        showNextBubble();
    });
});

// Функция для интерактивного обновления текстов
function updateBubbleTexts(text1, text2) {
    bubbleText1 = text1;
    bubbleText2 = text2;
}