class MyView extends HTMLElement {
    // etc...
    constructor (patchConnection) {
        super();
        this.patchConnection = patchConnection;
        this.innerHTML = this.getHTML();
        this.classList.add("view-patch-element");
    }

    connectedCallback() {

        // when something in cmajor changes, is executed here!
        this.paramListener = event => {
            const slider = this.querySelector("#" + event.endpointID);
            if (slider) {
                slider.value = event.value;
            }
        };
        this.patchConnection.addAllParameterListener (this.paramListener);
        // getting all changes from html side.
        for (const slider of this.querySelectorAll(".param")) {
            slider.oninput = () => this.patchConnection.sendEventOrValue(slider.id, slider.value);
            this.patchConnection.requestParameterValue(slider.id);
        }
        // styling
        const knobs = this.querySelectorAll(".param");
        knobs.forEach(knob => {
            knob.addEventListener('input', function () {
                const min = knob.min;
                const max = knob.max;
                const val = knob.value;
                const angle = (val - min) * 270 / (max - min) - 135;
                knob.style.transform = `rotate(${angle}deg)`;
            });
        })
    }

    disconnectedCallback() {
        this.patchConnection.removeAllParameterListener(this.paramListener);
    }

    getHTML () {
        // html for cmjaor is created as template string!
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
           <style>
                .view-patch-element {
                    background-color: #000;
                    color: #fff;
                    width:100% !important;
                    height: 100%;
                    font-family: Verdana, sans-serif;
                }
                .knobs-container {
                    display: flex !important;
                    justify-content: center;
                    align-items: center;
                }
                .knob-container {
                    text-align: center;
                    margin: 20px;
                }

                .param {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100px;
                    height: 100px;
                    background: #444;
                    border-radius: 50%;
                    position: relative;
                    margin: 0 auto;
                    cursor: pointer;
                    transform: rotate(-135deg);
                }

                .param::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 0;
                    height: 0;
                    border: none;
                    background: transparent;
                }

                .param:before {
                    content: '';
                    width: 10px;
                    height: 30px;
                    background: #ff1f1f;
                    position: absolute;
                    top: 10%;
                    left: 50%;
                    transform: translateX(-50%);
                }

                .knob-label {
                    margin-top: 10px;
                }
                .logo {
                    width: 100%;
                     height: auto; /* Maintain aspect ratio */
                }

            </style>

            <body class="view-patch-element">
                <div class="img-container">
                    <img id="tap-logo" class="logo" src="./Resources/logo.png" alt="tap logo">
                </div>
                <div class="knobs-container">
                <div class="knob-container">
                    <input type="range" min="20" max="20000" value="300" class="param" id="frequencyIn">
                    <div class="knob-label">Frequency</div>
                </div>
                <div class="knob-container">
                    <input type="range" min="-84" max="6" value="-12" class="param" id="volume">
                    <div class="knob-label">Gain</div>
                </div>
                </div>
            </body>
            </html>
        `;
    }

}

// allow define custom element in DOM
window.customElements.define("my-view", MyView);

// Register custom html in our window and connected to cmajor engine!
export default function createPatchView (patchConnection) {
    return new MyView(patchConnection);
}