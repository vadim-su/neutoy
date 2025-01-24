class Triggers {
  constructor() {
    this.button1_handler = null;
    this.button2_handler = null;
  }

  on_button1_pressed(handler) {
    this.button1_handler = handler;
  }

  on_button2_pressed(handler) {
    this.button2_handler = handler;
  }

  bind_handler1(button) {
    button.addEventListener('click', () => {
      this._handleButton1Press(button);
    });
  }

  bind_handler2(button) {
    button.addEventListener('click', () => {
      this._handleButton2Press(button);
    });
  }

  _handleButton1Press(button) {
    if (this.button1_handler) {
      this.button1_handler(button);
    }
  }

  _handleButton2Press(button) {
    if (this.button2_handler) {
      this.button2_handler(button);
    }
  }
}

export default Triggers;
