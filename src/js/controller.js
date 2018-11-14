// Контроллер приложения
import * as flightView from './views/flightView';
import { domElements, domStringElements, renderLoader, clearLoader } from './views/base';
import Flight from './models/Flight';
import Request from './models/Request';

/* в объекте cache хранится объект с типом запроса и уже запрошенными рейсами,
если данным > ageLimit минут, то, при новом запросе, будут запрошенные новые данные*/
const cache = {};
cache.ageLimit = 10;
cache.isActual = function(event) {
    // проверяет получены ли данные больше чем cache.age минут назад
    let now = new Date();
    let difference = Math.floor((now - this[event].age) / 1000 / 60);
    return difference < this.ageLimit;
}

function parseFlightData(data) {
    /*получает JSON файл, обрабатывает его и объект с типом запроса
    и массивом объектов-рейсов*/
    if (data) {

        let result = [];
        let flightsAmount = (data.pagination.limit > data.pagination.total) ? data.pagination.total : data.pagination.limit;
        let event = data.event;
    
        for (let i = 0; i < flightsAmount; i++) {
            // время рейса
            let time = new Date(data.schedule[i][event]);
            let hours = (time.getHours() < 10) ? '0' + time.getHours() : time.getHours();
            let minutes = (time.getMinutes() < 10) ? '0' + time.getMinutes() : time.getMinutes();
            
    
            let number = data.schedule[i].thread.number;
            let direction = (event === 'departure') ? data.schedule[i].thread.title.split(' — ')[1] : data.schedule[i].thread.title.split(' — ')[0];
            let company = data.schedule[i].thread.carrier.title;
            let plane = data.schedule[i].thread.vehicle;
    
            let status = (new Date() > time) ? 'Совершил посадку' : 'Рейс ожидается';
            if (event === 'departure') {
                /* Каждый delayed рейс 'departure' получает статус 'Задержан', т.к.
                Яндекс.Расписание API не предоставляет данные о статусе рейса
                поэтому используются заглушки*/
                let delayed = 20;
                status = ((i + 1) % delayed === 0)  ? 'Задержан' : status;
            }
            time = formatDate(time) + ' ' + hours + ':' + minutes;
            let flight = new Flight(time, number, direction, company, plane, status);
            result.push(flight);
        }
    
        return {event: event, schedule: result};
    }
};

function formatDate(date) {
    let year = date.getFullYear();
    let month = date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    date = year + '-' + month + '-' + day;

    return date;
}

async function timetableControll(event) {
    // event = либо departure, либо arrival
    if (event) {
        let date = new Date();
        date = formatDate(date);
        let request = new Request(event, date);
        renderLoader(domElements.tableBody);

        try {
            await request.getData();

            let result = parseFlightData(request.data);

            cache[result.event] = result;
            cache[result.event].age = new Date();

            clearLoader();
            flightView.renderResult(result);
        } catch (error) {
            alert('Что-то пошло не так при получении данных');
            clearLoader();
        }
    }
};

function flightToggleControll(e) {
    let target = e.target;
    let event = e.target.dataset.event;
    if (!target || !event) {
        return;
    }
    document.querySelector(domElements.activeBtn).classList.toggle(domStringElements.activeBtn);
    target.classList.toggle(domStringElements.activeBtn);
    flightView.clearResult();
    if (event !== 'delayed') {
        if (cache[event] && cache.isActual(event)) {
            flightView.renderResult(cache[event]);
            return;
        }
        delete cache[event];
        timetableControll(event);
    } else {
        let result = {
            schedule: cache['departure'].schedule.filter((el) => el.status === 'Задержан'),
            event: 'departure'
        };
        cache[event] = result;
        flightView.renderResult(result);
    }
};

function renderSearchInput() {
    let value = document.querySelector(domElements.searchInput).value.toUpperCase();
    let event = document.querySelector(domElements.activeBtn).dataset.event;
    flightView.clearResult();
    let result;
    if (value) {
        result = {
            schedule: cache[event].schedule.filter((el) => el.number.includes(value)),
            event: event
        };
    } else {
        result = cache[event];
    }
    document.querySelector(domElements.searchInput).value = '';
    flightView.renderResult(result);
}

function flightSearchBtnControll(e) {
    let target = e.target;
    if (!target && !target.tagName !== 'BUTTON') {
        return;
    }
    renderSearchInput();
}

function flightSearchKeypressControll(key) {
    // проверка нажатия на Enter
    if (key.keyCode === 13) {
        renderSearchInput();
    }
}

document.querySelector(domElements.buttonContainer).addEventListener('click', flightToggleControll);
document.querySelector(domElements.search).addEventListener('click', flightSearchBtnControll);
document.querySelector(domElements.searchInput).addEventListener('keypress', flightSearchKeypressControll);


window.onload = function() {
    timetableControll('departure');
};
