export function Projects() {
    const html = `
        <div class="as-container">

                <div id="dd" class="dd">
                    <div class="dd-title"><h3>Operating System</h3></div>
                    <div class="dd-description">
                        <p>
                            A front-end application that simulates an operating system using HTML, CSS, and vanilla JavaScript. This is what you are currently viewing.
                        </p>
                        <a href="https://github.com/callahan-codes/BlockGrid/tree/main" target="_blank" class="btn">Source Code</a> <a href="https://callahan-codes.github.io/BlockGrid/" target="_blank" class="btn">Live Demo</a>
                    </div>
                </div>

                <hr/>

                <div id="dd" class="dd">
                    <div class="dd-title"><h3>BlocksGrid</h3></div>
                    <div class="dd-description">
                        <p>
                            A vanilla three.js scene that displays a 15x15 grid of cubes which are all animated on their own path.
                        </p>
                        <a href="https://github.com/callahan-codes/BlockGrid/tree/main" target="_blank" class="btn">Source Code</a> <a href="https://callahan-codes.github.io/BlockGrid/" target="_blank" class="btn">Live Demo</a>
                    </div>
                </div>

                <div id="dd" class="dd">
                    <div class="dd-title"><h3>Mirror-FBX</h3></div>
                    <div class="dd-description">
                        <p>
                            A vanilla three.js scene that displays a 15x15 grid of cubes which are all animated on their own path.
                        </p>
                        <a href="https://github.com/callahan-codes/Mirror-FBX" target="_blank" class="btn">Source Code</a> <a href="https://callahan-codes.github.io/Mirror-FBX/" target="_blank" class="btn">Live Demo</a>
                    </div>
                </div>

                <div id="dd" class="dd">
                    <div class="dd-title"><h3>Points</h3></div>
                    <div class="dd-description">
                        <p>
                            A vanilla three.js scene that displays a 15x15 grid of cubes which are all animated on their own path.
                        </p>
                        <a href="https://github.com/callahan-codes/Points" target="_blank" class="btn">Source Code</a> <a href="https://callahan-codes.github.io/Points/" target="_blank" class="btn">Live Demo</a>
                    </div>
                </div>
        </div>
    `;

    return html;
}

export function SnakeGame() {
    return '<div id="snake-container"></div>';
}

export function Credits() {

    let html = `
        <div class="credits-container" id="credits">
            <div id="credits-head">
                <h1>Special Thanks To</h1>
            </div>
            <div id="person-name"></div>
            <div id="continue-notice">
                <p>Click to continue</p>
            </div>
        </div>
    `;
    
    
    return html;
}
