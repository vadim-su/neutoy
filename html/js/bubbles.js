export function createBubble(text, isRight) {
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
        setTimeout(() => bubble.remove(), 1500);
    }, 2000);
}
