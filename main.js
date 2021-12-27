const FIELD_SIZE_PX = 50;
const DIAMETER = 5;

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
    /** @type {Coordinate} */
    coordinate;

    /** @type {Number} */
    value;

    /** @type {HTMLElement} */
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
     * @param {Number} value
     */
    update(coordinate = this.coordinate, value = this.value) {
        this.coordinate = coordinate;
        this.value = value;
        this._render();
    }

    destroy() {
        this._ref.remove();
        this._ref = null;
    }

    /** @param {Item} item */
    canBeMerged(item) {
        return item.value === this.value;
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

    /** @param {Item} item */
    _popItem(item) {
        this._items.splice(this._items.indexOf(item), 1);
        item.destroy();
    }

    /** @param {Coordinate | void} coordinate */
    _getItemByCoordinate(coordinate) {
        return this._items.find((item) => {
            const { x, y } = item.coordinate;
            return x === coordinate.x && y === coordinate.y;
        });
    }

    /** @param {1 | -1} delta */
    goXAxis(delta = 1) {
        const sortDesc = (item1, item2) => {
            return (item1.coordinate.y - item2.coordinate.y) * delta;
        };

        this._items.sort(sortDesc).forEach((item) => {
            const { x, y } = item.coordinate;

            const nextCoordinates = this._coordinates
                .filter((coordinate) => coordinate.x === x)
                .filter((coordinate) =>
                    delta === 1 ? coordinate.y > y : coordinate.y < y
                )
                .sort((c1, c2) => (c1.y - c2.y) * delta);

            /** @type {Coordinate | undefined} */
            let coordinate;

            for (let i = 0; i < nextCoordinates.length; i++) {
                const c = nextCoordinates[i];
                const v = this._getItemByCoordinate(c);

                if (!v) {
                    coordinate = c;
                    continue;
                }

                if (!v.canBeMerged(item)) break;

                // merge items
                item.update({ ...v.coordinate }, v.value + item.value);
                this._popItem(v);
            }

            if (coordinate) {
                item.update(coordinate);
            }
        });
    }
}

class GameController {
    _game;

    /** @param {Game} game */
    constructor(game) {
        this._game = game;

        window.addEventListener('keydown', this.handleKeydown.bind(this));
    }

    destruct() {
        window.removeEventListener('keydown', this.handleKeydown.bind(this));
    }

    /**
     * @param {KeyboardEvent} e
     */
    handleKeydown(e) {
        switch (e.key) {
            case 'w':
                this._game.goXAxis(-1);
                break;
            case 's':
                this._game.goXAxis();
                break;
            case 'q':
                break;
            case 'd':
                break;
            case 'a':
                break;
            case 'e':
                break;
        }
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
    new GameController(game);

    game.start();

    console.log(game);
};

init(document.getElementById('app'));
