class Triggers {
  constructor() {
    this.button_handler = null;
  }

  on_button_pressed(handler) {
    this.button_handler = handler;
  }

  bind_handler(button) {
    button.addEventListener('click', () => {
      this._handleButtonPress(button);
    });
  }

  _handleButtonPress(button) {
    if (this.button_handler) {
      this.button_handler(button);
    }
  }
}

export default Triggers;
