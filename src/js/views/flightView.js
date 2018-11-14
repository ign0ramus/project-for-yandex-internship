import { domElements } from './base';

function renderTableHead(event) {
    let tableHeadDirection = (event === 'departure') ? 'Направление' : 'Откуда';
    let markup =`
                <thead class="timetable__head">
                    <tr class="timetable__flight">
                        <th class="timetable__time">Время</th>
                        <th class="timetable__number">Рейс</th>
                        <th class="timetable__direction">${tableHeadDirection}</th>
                        <th class="timetable__company">Компания</th>
                        <th class="timetable__plane">Самолет</th>
                        <th class="timetable__status">Статус</th>
                    </tr>
                </thead>
    `;
    document.querySelector(domElements.timetable).insertAdjacentHTML('afterbegin', markup);
}

function renderFlight(flight) {
    let markup = `
                <tr class="timetable__flight">
                    <td class="timetable__time">${flight.time}</td>
                    <td class="timetable__number">${flight.number}</td>
                    <td class="timetable__direction">${flight.direction}</td>
                    <td class="timetable__company">${flight.company}</td>
                    <td class="timetable__plane">${flight.plane}</td>
                    <td class="timetable__status">${flight.status}</td>
                </tr>`;
    document.querySelector(domElements.tableBody).insertAdjacentHTML('beforeend', markup);
}

export function clearResult() {
    let tHead = document.querySelector(domElements.tableHead);
    if (tHead) {
        tHead.parentElement.removeChild(tHead);
    }
    let tBody = document.querySelector(domElements.tableBody);
    if (tBody) {
        tBody.innerHTML = '';
    }
}

export function renderResult(result) {
    renderTableHead(result.event);
    result.schedule.forEach(renderFlight);
}