export function createBubble(text, isRight) {
  const bubblesContainer = document.getElementById("bubbles");

  if (!bubblesContainer) {
    console.error("Container with id 'bubbles' not found");
    return;
  }

  const bubble = document.createElement("div");
  bubble.className = `bubble ${isRight ? "bubble-right" : "bubble-left"}`;
  bubble.textContent = text;

  bubblesContainer.appendChild(bubble);

  // Trigger reflow to ensure the animation works
  void bubble.offsetWidth;

  // Start appear animation
  requestAnimationFrame(() => {
    bubble.classList.add("show");
  });

  // Start disappear animation after 5 seconds
  setTimeout(() => {
    bubble.classList.remove("show");
    bubble.classList.add("hide");
    // Remove the element after animation completes
    setTimeout(() => bubble.remove(), 500);
  }, 5000);

  return bubble;
}
