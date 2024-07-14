class MyView extends HTMLElement {
    // etc...
    constructor (pathConnection) {
        super();
        this.pathConnection = pathConnection;
        this.innerHTML = this.getHTML();
    }

    connectedCallback() {

    }

    disconnectedCallback() {

    }

    getHTML () {
        // html for cmjaor is created as template string!
        return `
            // write HTML and css here!
        
        `;
    }

}

// allow define custom element in DOM
window.customElements.define("my-view", MyView);

// Register custom html in our window and connected to cmajor engine!
export default function createPatchView (pathConnection) {
    return new MyView(pathConnection);
}