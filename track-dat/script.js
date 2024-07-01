document.addEventListener('DOMContentLoaded', () => {
    const flightData = [
        { std: '07:20', etd: '', airline: 'AirAsia', flight: 'Z2 716', destination: 'Manila (MNL)', gate: '2', remarks: '' },
        { std: '08:20', etd: '', airline: 'AirAsia', flight: 'Z2 712', destination: 'Manila (MNL)', gate: '3', remarks: '' },
        { std: '08:50', etd: '', airline: 'AirAsia', flight: 'Z2 922', destination: 'Clark (CRK)', gate: '4', remarks: '' },
        { std: '08:50', etd: '', airline: 'Cebu Pacific', flight: '5J 892', destination: 'Manila (MNL)', gate: '9', remarks: '' },
        { std: '09:40', etd: '10:20', airline: 'Philippine Airlines', flight: 'PR 2040', destination: 'Manila (MNL)', gate: '2', remarks: 'Delayed' },
        { std: '09:50', etd: '', airline: 'Cebu Pacific', flight: '5J 920', destination: 'Manila (MNL)', gate: '7', remarks: '' },
        { std: '10:05', etd: '', airline: 'Cebu Pacific', flight: '5J 1114', destination: 'Clark (CRK)', gate: '5', remarks: '' },
        { std: '10:30', etd: '', airline: 'Cebu Pacific', flight: '5J 900', destination: 'Manila (MNL)', gate: '6', remarks: '' },
        { std: '11:25', etd: '', airline: 'Philippine Airlines', flight: 'PR 2360', destination: 'Cebu (CEB)', gate: '1A', remarks: '' },
        { std: '11:50', etd: '', airline: 'AirAsia', flight: 'Z2 220', destination: 'Manila (MNL)', gate: '1B', remarks: '' },
        { std: '12:15', etd: '', airline: 'Cebu Pacific', flight: '5J 898', destination: 'Manila (MNL)', gate: '3', remarks: '' }
    ];

    const airlineLogos = {
        'AirAsia': 'images/airasia-logo.png',
        'Cebu Pacific': 'images/cebu-pacific-logo.png',
        'Philippine Airlines': 'images/philippine-airlines-logo.png'
    };

    function renderFlights() {
        const flightTable = document.getElementById('flightData');
        flightTable.innerHTML = '';

        flightData.forEach(flight => {
            const row = document.createElement('tr');

            const stdCell = document.createElement('td');
            stdCell.textContent = flight.std;
            row.appendChild(stdCell);

            const etdCell = document.createElement('td');
            etdCell.textContent = flight.etd;
            row.appendChild(etdCell);

            const airlineCell = document.createElement('td');
            const airlineImg = document.createElement('img');
            airlineImg.src = airlineLogos[flight.airline];
            airlineImg.alt = flight.airline;
            airlineImg.classList.add('flight-logo');
            airlineCell.appendChild(airlineImg);
            airlineCell.appendChild(document.createTextNode(` ${flight.flight}`));
            row.appendChild(airlineCell);

            const destinationCell = document.createElement('td');
            destinationCell.textContent = flight.destination;
            row.appendChild(destinationCell);

            const gateCell = document.createElement('td');
            gateCell.textContent = flight.gate;
            row.appendChild(gateCell);

            const remarksCell = document.createElement('td');
            remarksCell.textContent = flight.remarks;
            if (flight.remarks === 'Delayed') {
                remarksCell.style.color = 'orange';
                remarksCell.style.fontWeight = 'bold';
            }
            row.appendChild(remarksCell);

            flightTable.appendChild(row);
        });
    }

    function updateDateTime() {
        const now = new Date();
        const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const date = now.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });

        document.getElementById('time').textContent = time;
        document.getElementById('date').textContent = date;
    }

    setInterval(updateDateTime, 1000); // Update time and date every second
    renderFlights(); // Initial render
});
