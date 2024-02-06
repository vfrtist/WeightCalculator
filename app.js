const weights = [2.5, 5, 10, 25, 35, 45];
const lower = document.querySelector('.lower');
const openMenuButton = document.querySelector('#up');
const upper = document.querySelector('.upper');
const units = {
    lbs: 1,
    kgs: .453592
}

const toggleUnits = document.querySelector('#units');
const toggleTheme = document.querySelector('#theme');
const themes = ['orange', 'blue', 'pink', 'purple']

function make(item) { return document.createElement(item.toString()); }
function makeArray(list) { return Object.values(list.children).slice(1) }
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

let currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
if (currentTheme) { setTheme(currentTheme); }

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
        for (let plate of this.plateList) { subtotal.push(plate.dataset.weight) }
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

openMenuButton.addEventListener('click', () => {
    scrollPage(2);
    upper.classList.toggle('open');
})
toggleUnits.addEventListener('click', () => { bar.switchUnits(); })
toggleTheme.addEventListener('click', () => {
    currentTheme = themes[themes.indexOf(currentTheme) + 1];
    if (!currentTheme) { currentTheme = 'orange' }
    setTheme(currentTheme);
})

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
    solvingWeight = (totalWeight - bar.barWeight) / 2
    while (solvingWeight > 0) {
        let plate = compareWeight(solvingWeight);
        solvingWeight = solvingWeight - plate;
        bar.addWeight(plate);
    };
}

const frame = document.querySelector('#frame');
const rest = document.querySelector('#rest');
const calculate = document.querySelector('#calculate');
const pages = document.querySelectorAll('.page');
let edges = []
for (let page of pages) {
    edges.push(page.offsetLeft);
}
console.log(edges)

// let width = navigate.offsetWidth;

function scrollPage(page) { frame.scrollTo(edges[page - 1], 0); }

scrollPage(2);

// navigate.addEventListener('click', (e) => {
//     width = navigate.offsetWidth;
//     e.clientX / width > .5 ? scrollNext('right', width) : scrollNext('left', width);
// })

rest.addEventListener('click', () => { scrollPage(1); })
calculate.addEventListener('click', () => { scrollPage(3); })