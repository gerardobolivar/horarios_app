class MyCustomElement extends HTMLElement{
  static observedAttributes = ["size","text","color"];

  constructor() {
    super();
  }

  disconnectedCallback() {
    console.log("Custom element removed from page.");
  }

  adoptedCallback() {
    console.log("Custom element moved to new page.");
  }
  
  connectedCallback() {
    //Custom element setup should be here rather than the contructor.
    //console.log("Custom element added to page.");
    const shadow = this.attachShadow({mode: "open"})

    const text = this.getAttribute("text") || "";
    const size = this.getAttribute("size") || "25px";
    const color = this.getAttribute("color") || "#000000";

    const paragraph = document.createElement("p");
    paragraph.setAttribute("class","custom-paragraph");
    paragraph.innerText = text;

    //Add styles to the paragraph
    const style = document.createElement("style");

    style.textContent = `
      .custom-paragraph{
        color: ${color};
        font-size: ${size}
      }
    `

    shadow.appendChild(paragraph);
    shadow.appendChild(style);
  }

  attributeChangedCallback(name:any, oldValue:any, newValue:any) {
    console.log(
      `Attribute ${name} has changed from ${oldValue} to ${newValue}.`,
    );
  }
}


customElements.define("my-custom-element", MyCustomElement)

export default MyCustomElement;