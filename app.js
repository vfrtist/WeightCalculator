const weights = [2.5, 5, 10, 25, 35, 45];
const lower = document.querySelector('.lower');
const openMenuButton = document.querySelector('.up');
const upper = document.querySelector('.upper');
const barEnds = document.querySelectorAll('.end')
const total = document.querySelector('h1');

class barClass {
    constructor() {
        this.total = total;
        this.weights = [];
        this.ends = barEnds;
        this.unit = 'lbs';
    }
    addWeight(weight) {
        for (let end of this.ends) {
            this.weights.push(weight.dataset.weight);
            let addedWeight = weight.querySelector('.graphic').cloneNode('true');
            end.append(addedWeight);
            addedWeight.addEventListener('click', () => { this.removeWeight(addedWeight); })
        }
    }

    removeWeight(weight) {
        weight.remove();
        this.updateWeight();
    }

    updateWeight() {
        this.total.innerText = `${this.currentWeight} ${this.unit}`
    }

    get currentWeight() {
        let barWeight = 45;
        let total = this.weights.reduce((total, currentValue) => +total + +currentValue, barWeight,);
        return total;
    }
}

function make(item) { return document.createElement(item.toString()); }

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

