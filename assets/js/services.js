function ParkingStatesService() {
    const URL = 'https://datatank.stad.gent/4/mobiliteit/bezettingparkingsrealtime.json';

    function loadParkingStates() {
        return AJAX.loadJsonByPromise(URL);
    }

    return {
        loadParkingStates: loadParkingStates
    }
};