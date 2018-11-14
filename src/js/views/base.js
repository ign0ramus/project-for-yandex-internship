export const domElements = {
    tableBody:'.timetable__tbody',
    tableHead: '.timetable__head',
    timetable:'.timetable__content',
    loader: '.loader',
    buttonContainer: '.timetable__flight-type',
    buttons: '.button',
    activeBtn: '.button--active',
    search: '.timetable__search',
    searchInput: '.timetable__search-input'
};

export const domStringElements = {
    activeBtn: 'button--active'
};

export function renderLoader(parent) {
    let loader = `
        <div class="loader">
            <img src="./img/spinner.svg">
        </div>
    `;
    document.querySelector(parent).insertAdjacentHTML('afterbegin', loader);
};

export function clearLoader() {
    const loader = document.querySelector(domElements.loader);
    if (loader) {
        loader.parentElement.removeChild(loader);
    }
};