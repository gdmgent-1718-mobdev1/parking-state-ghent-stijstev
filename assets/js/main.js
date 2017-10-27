function App() {
    let _parkingStatesService,
        _parkingStatesElement,
        _currentParkingStatesData,
        _previousParkingStatesData,
        _updateParkingStates;

    function init() {
        console.log('1 Initialize the application');
        console.log('1.1 Create a ParkingStatesService object');
        _parkingStatesService = new ParkingStatesService();
        console.log('1.2 Chache the active DOM-elements');
        _parkingStatesElement = document.querySelector('.parking-states');
        console.log('1.3 Load the parking states via _parkingStatesService object');
        loadParkingStatesData();
        //Refreshes parking states every 2.5 minutes
        _updateParkingStates = setInterval(function(){
            loadParkingStatesData();
        }, 150000);
    }

    function loadParkingStatesData() {
        _parkingStatesService.loadParkingStates()
            .then(function(data) {
                console.log('2.1 Save the loaded data in _currentParkingStatesData');
                if (!_previousParkingStatesData) {
                    _previousParkingStatesData = data;
                } else {
                    _previousParkingStatesData = _currentParkingStatesData;
                }
                _currentParkingStatesData = data;
                console.log('2.2 Update parking states user interface');
                updateParkingStatesUI();
            })
            .catch(function(reject) {
                throw new Error(reject);
            });
    }

    function updateParkingStatesUI() {
        if(_parkingStatesElement != null && _parkingStatesElement != undefined && _currentParkingStatesData != null && _currentParkingStatesData != undefined && _currentParkingStatesData.length > 0) {
            let tempStr = '';
            console.log('3.1 Loop through the parking states');
            _currentParkingStatesData.forEach(function(parkingState, index) {
                tempStr += `
<li class="mdl-list__item mdl-list__item--three-line" data-id="${ parkingState.id }" data-lat="${ parkingState.latitude }" data-lng="${ parkingState.longitude }">
    <span class="mdl-list__item-primary-content">
        <i class="material-icons mdl-list__item-avatar pa-color__${setOccupationColor(parkingState.parkingStatus.availableCapacity, parkingState.totalCapacity)}">fiber_manual_record</i>
        <span>${ parkingState.name }</span>
        <span class="mdl-list__item-text-body">
        ${ parkingState.address }
        </span>
    </span>
    <span class="mdl-list__item-secondary-content parking-state__capacity">
        <span class="parking-state__availablecapacity">${ parkingState.parkingStatus.availableCapacity }</span>
        <span class="parking-state__totalcapacity">${ parkingState.totalCapacity }</span>
        <i class="material-icons parking-state__evolution">${checkParkingEvolution(parkingState.parkingStatus.availableCapacity, _previousParkingStatesData[index].parkingStatus.availableCapacity)}</i>
    </span>
</li>
            `;
            }, this);
            _parkingStatesElement.innerHTML = tempStr;
        }
    }
    function setOccupationColor(available, total) {
        let percFull = (available/total) * 100;
        if (percFull <= 20) {
            return "red";
        }
        else if (percFull >= 20 && percFull <= 50) {
            return "orange";
        }
        else {
            return "green";
        }
    }
    function checkParkingEvolution(currentCapacity, lastCapacity) {
        if (currentCapacity && lastCapacity) {
            if (currentCapacity > lastCapacity) {
                return "arrow_upward";
            }
            else if (currentCapacity < lastCapacity) {
                return "arrow_downward";
            }
            else {
                return "compare_arrows";
            }
        } else {
            return "campare_arrows";
        }
    }
    return {
        init: init
    }
};

// load event window object
// all resources are loaded
window.addEventListener('load', function(ev) {
    // Make new instance of app
    const app = new App();
    app.init();
});