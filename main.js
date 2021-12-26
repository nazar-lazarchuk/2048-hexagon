const FIELD_SIZE_PX = 50;
const MAX_COUNT_IN_ROW = 3;

const AVAILABLE_INITIAL_VALUES = [2, 4, 8];
const FIELD_CLASSNAME = 'field';
const ITEM_CLASSNAME = 'item';

/**
 * @typedef Coordinate
 * @property {number} x
 * @property {number} y
 */

/**
 * @returns {Coordinate[]}
 */
const generateCoordinates = () => {
    // TODO: generate by MAX_COUNT_IN_ROW
    return [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
    ];
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

    // delta used for additional offset by X axis
    const deltaX = (Math.floor(MAX_COUNT_IN_ROW / 2) - x) / 2;

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
        this._items = [];
        
        this._startGame();
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

    _startGame() {
        this._pushItem();
        this._pushItem();
    }
}

/**
 * Game init
 * @param {HTMLElement} root
 */
const init = (root) => {
    const coordinates = generateCoordinates();

    coordinates.forEach((coordinate) => {
        root.append(generateFieldHtml(coordinate));
    });

    const game = new Game(coordinates, root);

    console.log(game);
};

init(document.getElementById('app'));
 