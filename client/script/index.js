// IMPORTS
import * as APPContent from './content.js';
import * as SNAKE from './snake.js';

// GLOBAL VARIABLES
// os elements
const iconPortfolio = document.getElementById('mainscreen-applications_AboutMe');
const iconProjects = document.getElementById('mainscreen-applications_Projects')
const iconSnakeGame = document.getElementById('mainscreen-applications_SnakeGame');
const iconCredits = document.getElementById('mainscreen-applications_Credits');
const osDisplay = document.getElementById('os-screen-content');  
const osFooterToggle = document.getElementById('os-footer-burger_menu'); 
const osFooterMenu = document.getElementById('os-footer-menu-display'); 
const osFooterApps = document.getElementById('os-footer-apps');

// os app array
const osApps = [
    {
        index: 1,
        name: 'Open-Source Projects',
        image: './media/images/icon-folder.png',
        status: 'closed',
        toolbarclass: 'toolbar-projects',
        contentclass: 'content-projects',
        content: APPContent.Projects()
    },
    {
        index: 2,
        name: 'Snake.io',
        image: './media/images/icon-snake.png',
        status: 'closed',
        toolbarclass: 'toolbar-snake',
        contentclass: 'content-snake',
        content: APPContent.SnakeGame()
    },
    {
        index: 3,
        name: 'Credits',
        image: './media/images/icon-credits.png',
        status: 'closed',
        toolbarclass: 'toolbar-credits',
        contentclass: 'content-credits',
        content: APPContent.Credits()
    }
];

// app screen drag
let tempStatus = null;
let isDragging = false;
let currentAppIndex = null;
let offsetX, offsetY;

// FUNCTIONS
// build app screen
function buildAppScreen(app) {

    // if app is closed
    if (app.status === 'closed') {

        // create container
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('app-screen-container');
        containerDiv.id = `container-main-${app.index}`;

        // create app "screen"
        const appDiv = document.createElement('div');
        appDiv.classList.add('app-screen');
        appDiv.id = `app-main-${app.index}`;

        // set html
        appDiv.innerHTML = `
            <div class="as-toolbar ${app.toolbarclass}" id="as-toolbar-${app.index}">
                <div class="dynamic-toolbar" id="as-toolbar-name-${app.index}"><img src="${app.image}" alt="App Screen ${app.name} image"/>${app.name}</div>
                <div class="as-toolbar-min" id="as-toolbar-minimize-${app.index}">-</div>
                <div class="as-toolbar-max" id="as-toolbar-maximize-${app.index}">□</div>
                <div class="as-toolbar-exit" id="as-toolbar-exit-${app.index}">x</div>
            </div>
            <div id="as-content-${app.index}" class="as-content ${app.contentclass}">${app.content}</div>
        `;

        // append elements
        containerDiv.appendChild(appDiv);
        osDisplay.appendChild(containerDiv);

        // call functions
        addWindowToFooter(app.index);
        toggleZIndexes(app.index);

        // initialize stuff if chosen
        if (app.index === 1) {
            initializeProjects();
        }
        if (app.index === 2) {
            initializeSnakeGame();
        }
        if (app.index === 3) {
            initializeCredits();
        }

        // add listeners
        document.getElementById(`as-toolbar-${app.index}`).addEventListener('pointerdown', (e) => startDrag(e, app.index));
        document.getElementById(`as-toolbar-minimize-${app.index}`).addEventListener('click', () => toggleMinimizeScreenWindow(app.index));
        document.getElementById(`as-toolbar-maximize-${app.index}`).addEventListener('click', () => toggleFullScreenWindow(app.index));
        document.getElementById(`as-toolbar-exit-${app.index}`).addEventListener('click', () => {
            closeWindow(app.index);
            closeWindowInFooter(app.index);
        });

        // set status
        app.status = 'open';
    }
}

// start drag process
function startDrag(e, appIndex) {

    // get app div and app based off index
    const appDiv = document.getElementById(`app-main-${appIndex}`);
    const app = osApps.find(app => app.index === appIndex);
      
    // if div doesn't exist or status is maximized, return
    if (!appDiv) return; 
    if (app.status === 'maximized') return;

    // if done dragging
    if (isDragging && currentAppIndex === appIndex) {
        stopDrag();
        return;
    }

    // styling, drag, currentAppIndex
    appDiv.style.zIndex = '100'
    isDragging = true;
    currentAppIndex = appIndex;

    // div coords
    const toolbar = document.getElementById(`as-toolbar-${appIndex}`);
    const rect = toolbar.getBoundingClientRect();
    offsetX = e.clientX - rect.left; 
    offsetY = e.clientY - rect.top;  

    // listeners
    document.addEventListener('pointermove', onDrag);
    document.addEventListener('pointerup', stopDrag);
}

// drag process
function onDrag(e) {

    // check for correct drag and index
    if (!isDragging || !currentAppIndex) return;

    //get app div
    const appDiv = document.getElementById(`app-main-${currentAppIndex}`);
    if (!appDiv) return;

    // coords & positioning
    const x = e.clientX - offsetX; 
    const y = e.clientY - offsetY;

    const appWidth = appDiv.offsetWidth;
    const appHeight = appDiv.offsetHeight;

    const maxX = window.innerWidth - appWidth;
    const maxY = window.innerHeight - appHeight;

    const left = Math.min(Math.max(x, 0), maxX);
    const top = Math.min(Math.max(y, 0), maxY);

    appDiv.style.left = `${left}px`;
    appDiv.style.top = `${top}px`;
}

// stop drag process
function stopDrag() {

    // toggle z-index & remove drag/index
    toggleZIndexes(currentAppIndex);
    isDragging = false;
    currentAppIndex = null;

    // listeners
    document.removeEventListener('pointermove', onDrag);
    document.removeEventListener('pointerup', stopDrag);
}

// adjust app z-index
function toggleZIndexes(excludeAppIndex) {

    // get all app screen elements
    const allDivs = document.querySelectorAll('[id^="app-main-"]');
    
    // set z-index for all
    allDivs.forEach(div => {
        const appIndex = div.id.replace('app-main-', '');
        if (appIndex != excludeAppIndex) {
            div.style.zIndex = '25';
        } else {
            div.style.zIndex = '100';
        }
    });
}

// toggle fullscreen app window
function toggleFullScreenWindow(appIndex) {

    // get app and coresponding window
    const app = osApps.find(app => app.index === appIndex);
    const appWindow = document.getElementById(`app-main-${app.index}`);

    // if status checks
    if (app.status === 'open') {

        // apply css transition
        appWindow.style.transition = 'width 0.5s ease, height 0.5s ease, transform 0.5s ease';

        // animate
        window.requestAnimationFrame(() => {
            appWindow.style.transform = 'translate(-50%, 0%)';
            appWindow.style.width = '100vw';
            appWindow.style.height = 'calc(100vh - 70px)';
            appWindow.style.top = '0';
            appWindow.style.left = '50%';
            appWindow.style.resize = 'none'

            app.status = 'maximized';
        });

    } else if (app.status === 'maximized') {

        // reset
        appWindow.style.transition = 'none';
        appWindow.style.width = '';
        appWindow.style.height = '';
        appWindow.style.top = '';
        appWindow.style.left = '';
        appWindow.style.transform = '';
        appWindow.style.resize = 'both'

        app.status = 'open';
    }
}

// toggle minimize app window
function toggleMinimizeScreenWindow(appIndex) {

    // get current app, its window, the footer display
    const app = osApps.find(app => app.index === appIndex);
    const appWindow = document.getElementById(`app-main-${app.index}`);
    const osFooterLine = document.getElementById(`os-footer-app-item-line-${app.index}`);

    // either show/hide based on status
    if (app.status !== 'minimized') {

        appWindow.classList.add('hide');
        tempStatus = app.status;
        app.status = 'minimized';
        osFooterLine.classList.remove('active');

    } else {

        appWindow.classList.remove('hide');
        osFooterLine.classList.add('active');
        switch(tempStatus) {
            case 'open':
                app.status = 'open';
                break;
            case 'maximized':
                app.status = 'maximized';
                break;
            default:
                console.log('something went wrong (refresh page)...');
                break;
        }
        toggleZIndexes(app.index);
    }
}

// close app window
function closeWindow(appIndex) {

    // get app, elements
    const app = osApps.find(app => app.index === appIndex);
    const appWindow = document.getElementById(`app-main-${app.index}`);
    const container = document.getElementById(`container-main-${app.index}`);
    
    // close window
    if (appWindow) {
        container.remove();
        app.status = 'closed'; 

        if(app.index === 2) {
            SNAKE.destroyGame();
        }

    }
}

// add app icon to footer
function addWindowToFooter(appIndex) {

    // get app, create html
    const app = osApps.find(app => app.index === appIndex);
    const html = `
        <div class="os-footer-app-item" id="os-footer-app-item-${app.index}">
            <img src="${app.image}" alt="${app.name} image"/>
            <div class="os-footer-app-item-line active" id="os-footer-app-item-line-${app.index}"></div>
        </div>
    `;
    
    // create div and set html, app and add to footer
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html; 
    
    const appElement = tempDiv.firstElementChild;
    osFooterApps.appendChild(appElement);

    document.getElementById(`os-footer-app-item-${app.index}`).addEventListener('click', () => toggleMinimizeScreenWindow(app.index));
}

// close app in footer
function closeWindowInFooter(appIndex) {

    // get app, elements
    const app = osApps.find(app => app.index === appIndex);
    const appWindow = document.getElementById(`os-footer-app-item-${app.index}`);
    
    // remove from footer
    if (appWindow) {
        appWindow.remove(); 
    }
}

// footer menu toggle
function toggleMenu(status) {

    // burger or x based off status
    switch (status) {
        case 'open':
            osFooterToggle.classList.add('active');
            osFooterMenu.classList.add('show');
            break;
        case 'close':
            osFooterToggle.classList.remove('active');
            osFooterMenu.classList.remove('show');
            break;
        default:
            break;
    }
}

// init projects
function initializeProjects() {

    // Get all dropdown elements
    const dropdowns = document.querySelectorAll('.dd');

    // Loop through each dropdown and add an event listener
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', () => {
            // Close all other dropdowns first
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    const otherDesc = otherDropdown.querySelector('.dd-description');
                    otherDesc.style.display = 'none';
                }
            });

            // Toggle the clicked dropdown's description
            const desc = dropdown.querySelector('.dd-description');
            desc.style.display = desc.style.display === 'block' ? 'none' : 'block';
        });
    });


}

// init snake game
function initializeSnakeGame() {

    // get container, make canvas
    const snakeContainer = document.getElementById("snake-container");
    const canvas = document.createElement('canvas');
    canvas.classList.add('game-canvas');
    canvas.id = "gameCanvas"; 
    snakeContainer.appendChild(canvas); 

    // set canvas size
    function updateCanvasSize() {
        canvas.width = snakeContainer.offsetWidth;
        canvas.height = snakeContainer.offsetHeight;
        SNAKE.updateGameCanvasSize(canvas.width, canvas.height); 
    }
    updateCanvasSize();

    // add listener and show game menu
    window.addEventListener('resize', updateCanvasSize);
    SNAKE.showMenuScreen();
}

// init credits
function initializeCredits() {

    // get element & build array
    const creditsContainer = document.getElementById('credits');
    const people = [
        "Ashley Flowers <3",
        "Mom and Dad",
        "Blake and Brenna",
        "Wilkey, Ben and Alex",
        "test1",
        "test2",
        "test3",
        "test4"
    ];

    // set index and show the first array object
    let index = 0;
    const personNameElement = document.getElementById('person-name');
    personNameElement.innerHTML = `<p>${people[index]}</p>`;

    // notice & header elements
    const notice = document.getElementById('continue-notice');
    const header = document.getElementById('credits-head');

    // endless loop per click
    creditsContainer.addEventListener('click', () => {
        if(index === 0) {
            notice.innerHTML = ''
        } 

        index = (index + 1) % people.length;
        personNameElement.innerHTML = `<p>${people[index]}</p>`;

        if(index >= 4) {
            header.innerHTML = '<h1>Contributions</h1>'
        } else {
            header.innerHTML = '<h1>Special Thanks To</h1>'
        }
    });

}


// LISTENERS
// os icons listeners
iconPortfolio.addEventListener('click', () => {
    window.open('https://example.com', '_blank'); // waiting to publish my personal porfolio @ brycecallahan.com
});

iconProjects.addEventListener('click', () => {
    buildAppScreen(osApps[0])
});

iconSnakeGame.addEventListener('click', () => {
    buildAppScreen(osApps[1]);
});

iconCredits.addEventListener('click', () => {
    buildAppScreen(osApps[2]);
});

// footer menu listeners
osFooterToggle.addEventListener('click', () => {
    if (osFooterToggle.classList.contains('active')) {
        toggleMenu('close');  
    } else {
        toggleMenu('open');
    }
});
