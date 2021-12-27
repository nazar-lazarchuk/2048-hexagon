const FIELD_SIZE_PX = 50;
const DIAMETER = 11;

const AVAILABLE_INITIAL_VALUES = [2, 4, 8];
const FIELD_CLASSNAME = 'field';
const ITEM_CLASSNAME = 'item';

/**
 * @typedef Coordinate
 * @property {number} x
 * @property {number} y
 */

/**
 * @param {number} n the diameter of the hexagon
 * @returns {Coordinate[]}
 */
const generateCoordinates = (n) => {
    /** @type {Coordinate[]} */
    const result = [];

    const radius = Math.floor(n / 2);

    for (let x = 0; x < n; x++) {
        for (let y = 0; y < n; y++) {
            if (Math.abs(x - y) <= radius) {
                result.push({ x, y });
            }
        }
    }

    return result;
};

/**
 * @param {Coordinate} coordinate
 * @returns {HTMLElement}
 */
const generateFieldHtml = (coordinate) => {
    const html = document.createElement('div');
    html.classList.add(FIELD_CLASSNAME);
    Object.assign(html.style, getPosition(coordinate));
    return html;
};

/**
 * @param {number} value
 * @returns {String} className
 */
const getItemClassNamesByValue = (value) =>
    `${ITEM_CLASSNAME} ${ITEM_CLASSNAME}-${value}`;

/**
 * @param {Coordinate} coordinate
 * @returns {CSSStyleDeclaration}
 */
const getPosition = (coordinate) => {
    const { x, y } = coordinate;

    const radius = Math.floor(DIAMETER / 2);

    // delta used for additional offset by X axis
    const deltaX = (radius - x) / 2;

    return {
        top: `${(y + deltaX) * FIELD_SIZE_PX}px`,
        left: `${x * FIELD_SIZE_PX}px`,
    };
};

/**
 * @param {Coordinate[]} freeCoordinates
 * @returns {Coordinate}
 */
const getCoordinateByRandom = (freeCoordinates) => {
    const coordinateIndex = Math.floor(Math.random() * freeCoordinates.length);
    return { ...freeCoordinates[coordinateIndex] };
};

/**
 * @returns {Item}
 */
const getValueByRandom = () => {
    const valueIndex = Math.floor(
        Math.random() * AVAILABLE_INITIAL_VALUES.length
    );
    return AVAILABLE_INITIAL_VALUES[valueIndex];
};

class Item {
    coordinate;
    value;
    _ref;

    /**
     * @param {Coordinate} coordinate
     * @param {Number} value
     * @param {HTMLElement} ref
     */
    constructor(coordinate, value, ref) {
        this._ref = ref;
        this.update(coordinate, value);
    }

    _render() {
        Object.assign(this._ref.style, getPosition(this.coordinate));
        this._ref.className = getItemClassNamesByValue(this.value);
        this._ref.innerText = this.value;
    }

    /**
     * @param {Coordinate} coordinate
     * @param {number} value
     */
    update(coordinate, value = this.value) {
        this.coordinate = coordinate;
        this.value = value;
        this._render();
    }

    destroy() {
        this._ref.parentElement.remove(this._ref);
        this._ref = null;
    }
}

class Game {
    _coordinates;
    _root;

    /** @type {Item[]} */
    _items;

    /**
     * @param {Coordinate[]} coordinates
     * @param {HTMLElement} root
     */
    constructor(coordinates, root) {
        this._coordinates = coordinates;
        this._root = root;
    }

    start() {
        this._items = [];
        this._pushItem();
        this._pushItem();
    }

    get _freeCoordinates() {
        return this._coordinates.filter((coordinate) => {
            return this._items.every((item) => {
                return (
                    item.coordinate.x !== coordinate.x ||
                    item.coordinate.y !== coordinate.y
                );
            });
        });
    }

    _pushItem() {
        const itemRef = document.createElement('div');

        this._items.push(
            new Item(
                getCoordinateByRandom(this._freeCoordinates),
                getValueByRandom(),
                itemRef
            )
        );

        this._root.append(itemRef);
    }
}

/**
 * Game init
 * @param {HTMLElement} root
 */
const init = (root) => {
    const coordinates = generateCoordinates(DIAMETER);

    coordinates.forEach((coordinate) => {
        root.append(generateFieldHtml(coordinate));
    });

    const game = new Game(coordinates, root);
    game.start();

    console.log(game);
};

init(document.getElementById('app'));
 