document.addEventListener('DOMContentLoaded', () => {
    const flightData = [
        { flight: 'AA123', destination: 'New York (JFK)', departure: '10:30 AM', status: 'Gate Change', gate: 'A2' },
        { flight: 'BA456', destination: 'London (LHR)', departure: '11:00 AM', status: 'Delayed', gate: 'B2' },
        { flight: 'DL789', destination: 'Los Angeles (LAX)', departure: '12:15 PM', status: 'Boarding', gate: 'C3' }
    ];

    const statusOptions = ['On Time', 'Delayed', 'Boarding', 'Gate Change', 'Cancelled'];

    function updateFlightStatus() {
        flightData.forEach(flight => {
            const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
            flight.status = randomStatus;
        });
        renderFlights();
    }

    function renderFlights() {
        const flightTable = document.getElementById('flightData');
        flightTable.innerHTML = '';

        flightData.forEach(flight => {
            const row = document.createElement('tr');
            Object.values(flight).forEach(value => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            flightTable.appendChild(row);
        });
    }

    setInterval(updateFlightStatus, 5000); // Update flight status every 5 seconds
    renderFlights(); // Initial render
});
