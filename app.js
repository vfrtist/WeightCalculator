//=============== Variables ====================

const weights = [2.5, 5, 10, 25, 35, 45];
const lower = document.querySelector('.lower');
const openMenuButton = document.querySelector('#up');
const upper = document.querySelector('.upper');
const toggleUnits = document.querySelector('#units');
const toggleTheme = document.querySelector('#theme');
const themes = ['orange', 'blue', 'pink', 'purple', 'earth']
const frame = document.querySelector('#frame');
const rest = document.querySelector('#rest');
const calculate = document.querySelector('#calculate');
const pages = document.querySelectorAll('.page');
const timeForm = document.querySelector('#timeForm');
const weightForm = document.querySelector('#weightForm');
const findWeightInput = document.querySelector('#findWeight');
let currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
let currentPage = 2;
let edges = [];
const units = {
    lbs: 1,
    kgs: .453592
}

//=============== Functions ====================

function make(item) { return document.createElement(item.toString()); }
function makeArray(list) { return Object.values(list.children).slice(1) }
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}
function nextTheme() {
    currentTheme = themes[themes.indexOf(currentTheme) + 1];
    if (!currentTheme) { currentTheme = themes[0] }
    setTheme(currentTheme);
}

//=============== Bar Class ====================

class barClass {
    constructor() {
        this.total = document.querySelector('.main');
        this.subtotal = document.querySelector('.subheading');
        this.unit = 'lbs';
        this.ends = document.querySelectorAll('.end');
        this.barWeight = 45;
    }

    addWeight(weight) {
        for (let end of this.ends) {
            let addedWeight = make('div');
            addedWeight.classList.add(weight, 'graphic');
            addedWeight.dataset.weight = weight;
            end.append(addedWeight);
            addedWeight.addEventListener('click', () => { this.removeWeight(addedWeight); })
        }
        this.updateWeight();
    }

    get plateList() { return makeArray(this.ends[0]); }

    removeWeight(weight) {
        let end = weight.parentElement;
        let leftPlates = makeArray(this.ends[0]);
        let rightPlates = makeArray(this.ends[1]);
        let pos = makeArray(end).indexOf(weight);
        for (pos; pos < leftPlates.length; pos++) {
            leftPlates[pos].remove();
            rightPlates[pos].remove();
        }
        this.updateWeight();
    }

    updateWeight() {
        this.total.innerText = `${this.currentWeight} ${this.unit}`
        this.subtotal.innerText = this.subWeight;
    }

    get subWeight() {
        let subtotal = []
        for (let plate of this.plateList) { subtotal.push(Math.floor(plate.dataset.weight * units[this.unit])) }
        return subtotal.join(' / ');
    }

    get currentWeight() {
        let total = this.plateList.reduce((total, currentValue) => +total + (2 * +currentValue.dataset.weight), this.barWeight,);
        total = Math.round(total * units[this.unit]);
        return total;
    }


    switchUnits() {
        scrollPage(2);
        this.unit === 'lbs' ? this.unit = 'kgs' : this.unit = 'lbs';
        this.updateWeight();
        let buttons = lower.querySelectorAll('.weight');
        for (let step = 0; step < buttons.length; step++) {
            buttons[step].lastChild.innerText = Math.floor(weights[step] * units[bar.unit]);
        }
    }

    clearBar() {
        for (let end of this.ends) {
            for (let item of end.querySelectorAll(':not(.cap)')) { item.remove() }
        }
    }
}

//=============== Initial Page Building Section ====================

let bar = new barClass;

for (let weight of weights) {
    let button = make('div');
    let graphic = make('div');
    let caption = make('div');

    button.classList.add('weight');
    button.dataset.weight = weight;

    caption.innerText = weight;

    graphic.classList.add(weight, 'graphic');
    graphic.dataset.weight = weight;

    button.append(graphic, caption);
    lower.append(button);
    button.addEventListener('click', () => { bar.addWeight(button.dataset.weight); })
}

for (let page of pages) { edges.push(page.offsetLeft); }

if (currentTheme) { setTheme(currentTheme); }

scrollPage(currentPage);

openMenuButton.addEventListener('click', () => {
    scrollPage(2);
    upper.classList.toggle('open');
})

toggleUnits.addEventListener('click', () => { bar.switchUnits(); })
toggleTheme.addEventListener('click', nextTheme)

//=============== Weight Function ====================

function compareWeight(solvingWeight) {
    if (solvingWeight >= 45) {
        return 45;
    } else {
        for (let step = 0; step < weights.length; step++) {
            if (solvingWeight < weights[step]) { return weights[step - 1]; }
        }
    }
}

function findWeight(totalWeight) {
    bar.clearBar();
    scrollPage(2);
    findWeightInput.blur();
    solvingWeight = (totalWeight - bar.barWeight) / 2
    while (solvingWeight > 0) {
        let plate = compareWeight(solvingWeight);
        solvingWeight = solvingWeight - plate;
        bar.addWeight(plate);
    };
}

weightForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let total = e.target['findWeight'];
    if (total.value % 5 > 0) { window.alert('Number must be divisible by 5') }
    else {
        total.value >= 50 ? findWeight(total.value) : window.alert('Please input more than 50lbs');
        total.value = '';
    }
})

// =============== Page Moving ====================

function scrollPage(page, focus = '') {
    if (page != 2) { upper.classList.remove('open'); }
    if (currentPage === page) { page = 2 }
    frame.scrollTo(edges[page - 1], 0);
    currentPage = page;
    if (focus && page !== 2) { focus.focus(); }
}

rest.addEventListener('click', () => { scrollPage(1); })
calculate.addEventListener('click', () => { scrollPage(3, findWeightInput); })

//=============== Timer Function ====================

timeForm.addEventListener('submit', (e) => {
    e.preventDefault()
    countdown(e.submitter.value);
})

const delay = (operation, delay) => new Promise(resolve => setTimeout(resolve, delay));

async function countdown(time) {
    scrollPage(2);
    bar.total.classList.toggle('clock');
    do {
        await delay(postTime(time), 1000);
        time--
    } while (time > 0)
    bar.total.classList.toggle('clock');
    await delay((bar.total.innerText = 'Get it!'), 2000);
    await delay(bar.updateWeight(), 1000);
};

function postTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    if (seconds < 10) { seconds = '0' + seconds };
    bar.total.innerText = `${minutes}:${seconds}`;
}