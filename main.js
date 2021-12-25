const FIELD_SIZE_PX = 50;
const MAX_COUNT_IN_ROW = 3;

const AVAILABLE_INITIAL_VALUES = [2, 4, 8];

/**
 * @typedef Coordinate
 * @property {number} x
 * @property {number} y
 */

/**
 * @typedef Item
 * @property {Coordinate} coordinate
 * @property {number} value
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
 * @returns {HTMLElement}
 */
const generateFieldHtml = () => {
    const el = document.createElement('div');
    el.classList.add('field');
    return el;
};

/**
 * @param {number} value
 * @returns {String} className
 */
const getItemClassNamesByValue = (value) => `item item-${value}`;

/**
 * @param {number} initialValue
 * @returns {HTMLElement}
 */
const generateItemHtml = (initialValue) => {
    const el = document.createElement('div');
    el.className = getItemClassNamesByValue(initialValue);
    el.innerText = initialValue;
    return el;
};

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

/**
 * Game init
 * @param {HTMLElement} root
 */
const init = (root) => {
    const coordinates = generateCoordinates();

    const fieldsHtml = coordinates.map((coordinate) => {
        const html = generateFieldHtml();
        Object.assign(html.style, getPosition(coordinate));
        return html;
    });

    fieldsHtml.forEach((field) => root.append(field));

    /** @type {Item} */
    const firstItem = {
        coordinate: getCoordinateByRandom(coordinates),
        value: getValueByRandom(),
    };
    const firstItemHtml = generateItemHtml(firstItem.value);
    Object.assign(firstItemHtml.style, getPosition(firstItem.coordinate));
    root.append(firstItemHtml);

    setInterval(() => {
        const freeCoordinates = coordinates.filter((c) => {
            const { x, y } = firstItem.coordinate;
            return c.x !== x && c.y !== y;
        });

        // Changing coordinates
        firstItem.coordinate = getCoordinateByRandom(freeCoordinates);
        Object.assign(firstItemHtml.style, getPosition(firstItem.coordinate));

        // Changing value
        firstItem.value = getValueByRandom();
        firstItemHtml.className = getItemClassNamesByValue(firstItem.value);
        firstItemHtml.innerText = firstItem.value;
    }, 1000);
};

init(document.getElementById('app'));
