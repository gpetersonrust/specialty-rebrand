// src/functions/Accordion.js

class Accordion {
  constructor() {
    this.buttons = document.querySelectorAll(".accordion-button");

    console.log("Accordion buttons:", this.buttons);
    

    if (this.buttons.length > 0) {
      this.init();
    }
  }

  init() {
    this.buttons.forEach((button) => {
      button.addEventListener("click", (event) => this.toggle(event));
    });
  }

  toggle(event) {
    const button = event.currentTarget;
    const targetId = button.getAttribute("data-target");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const isOpen = targetElement.style.height && targetElement.style.height !== "0px";

      if (isOpen) {
        this.close(targetElement);
      } else {
        this.open(targetElement);
      }
    }
  }

  open(targetElement) {
    targetElement.style.height = `${targetElement.scrollHeight}px`;
    targetElement.style.opacity = "1";
  }

  close(targetElement) {
    targetElement.style.height = "0px";
    targetElement.style.opacity = "0";
  }
}

 


export default Accordion;