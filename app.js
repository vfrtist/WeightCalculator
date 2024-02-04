const weights = [2.5, 5, 10, 25, 35, 45];
const lower = document.querySelector('.lower');
const openMenuButton = document.querySelector('.up');
const upper = document.querySelector('.upper');

function make(item) { return document.createElement(item.toString()); }
function makeArray(list) { return Object.values(list.children) }

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

    get plateList() { return makeArray(this.ends[0]).slice(1); }

    removeWeight(weight) {
        let leftPlates = this.plateList;
        let rightPlates = makeArray(this.ends[1]).slice(1);
        let pos = leftPlates.findIndex(plate => plate.isEqualNode(weight));
        for (pos; pos < leftPlates.length; pos++) {
            leftPlates[pos].remove();
            rightPlates[pos].remove();
        }
        this.updateWeight();
    }

    updateWeight() { this.total.innerText = `${this.currentWeight} ${this.unit}` }

    get currentWeight() {
        let barWeight = 45;
        let total = this.plateList.reduce((total, currentValue) => +total + +currentValue.dataset.weight, barWeight,);
        return total;
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