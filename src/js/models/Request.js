import { key, proxy } from '../config';

export default class Request {
    constructor(query, date) {
        // date - в формате YYYY-MM-DD
        this.query = query;
        this.date = date;
    }
    
    async getData() {
        try {
            /* station = s9600366 - код станции аэропорта Пулково
            в системе Яндекс.Расписание */
            let response = await fetch(`${proxy}https://api.rasp.yandex.net/v3.0/schedule/?apikey=${key}&station=s9600366&transport_types=plane&event=${this.query}&date=${this.date}&limit=300`);
            let data = await response.json();

            this.data = data;
        } catch (error) {
            alert('Что-то пошло не так :(');
        }
    }
}