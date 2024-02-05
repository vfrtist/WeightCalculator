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
        this.total = document.querySelector('h1');
        this.unit = 'lbs';
        this.ends = document.querySelectorAll('.end');
    }

    addWeight(weight) {
        for (let end of this.ends) {
            let addedWeight = weight.querySelector('.graphic').cloneNode('true');
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

    updateWeight() { this.total.innerText = `${this.currentWeight} ${this.unit}` }

    get currentWeight() {
        let barWeight = 45;
        let total = this.plateList.reduce((total, currentValue) => +total + (2 * +currentValue.dataset.weight), barWeight,);
        total = Math.round(total * units[this.unit]);
        return total;
    }

    switchUnits() {
        this.unit === 'lbs' ? this.unit = 'kgs' : this.unit = 'lbs';
        this.updateWeight();
        let buttons = lower.querySelectorAll('.weight');
        for (let step = 0; step < buttons.length; step++) {
            buttons[step].lastChild.innerText = Math.floor(weights[step] * units[bar.unit]);
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
    button.addEventListener('click', () => { bar.addWeight(button); })
}

openMenuButton.addEventListener('click', () => { upper.classList.toggle('open'); })
toggleUnits.addEventListener('click', () => { bar.switchUnits(); })
toggleTheme.addEventListener('click', () => {
    currentTheme = themes[themes.indexOf(currentTheme) + 1];
    if (!currentTheme) { currentTheme = 'orange' }
    setTheme(currentTheme);
})

