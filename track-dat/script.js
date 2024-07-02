document.addEventListener('DOMContentLoaded', function() {
    const flightInfo = [
        {std: '07:20', etd: '8:30', airline: 'airasia.png', flight: 'Z2 716', destination: 'Manila (MNL)', gate: '2', remarks: 'Delayed'},
        {std: '08:20', etd: '', airline: 'airasia.png', flight: 'Z2 712', destination: 'Manila (MNL)', gate: '3', remarks: 'Gate Change'},
        {std: '08:50', etd: '', airline: 'airasia.png', flight: 'Z2 922', destination: 'Clark (CRK)', gate: '4', remarks: ''},
        {std: '08:50', etd: '', airline: 'cebupacific.png', flight: '5J 892', destination: 'Manila (MNL)', gate: '9', remarks: ''},
        {std: '09:40', etd: '10:20', airline: 'philippineairlines.png', flight: 'PR 2040', destination: 'Manila (MNL)', gate: '2', remarks: 'Delayed'},
        {std: '09:50', etd: '', airline: 'cebupacific.png', flight: '5J 920', destination: 'Manila (MNL)', gate: '7', remarks: ''},
        {std: '10:05', etd: '', airline: 'cebupacific.png', flight: '5J 1114', destination: 'Clark (CRK)', gate: '5', remarks: 'Cancelled'},
        {std: '10:30', etd: '', airline: 'cebupacific.png', flight: '5J 900', destination: 'Manila (MNL)', gate: '6', remarks: ''},
        {std: '11:25', etd: '', airline: 'philippineairlines.png', flight: 'PR 2360', destination: 'Cebu (CEB)', gate: '1A', remarks: 'Boarding Final Call'},
        {std: '11:50', etd: '', airline: 'airasia.png', flight: 'Z2 220', destination: 'Manila (MNL)', gate: '1B', remarks: ''},
        {std: '12:15', etd: '', airline: 'cebupacific.png', flight: '5J 898', destination: 'Manila (MNL)', gate: '3', remarks: ''},
    ];

    const flightInfoContainer = document.getElementById('flight-info');

    flightInfo.forEach(flight => {
        const row = document.createElement('tr');
        
        Object.keys(flight).forEach(key => {
            const cell = document.createElement('td');
            if (key === 'airline') {
                const img = document.createElement('img');
                img.src = `images/${flight[key]}`;
                img.alt = flight[key].split('.')[0];
                img.classList.add('airline-logo');
                cell.appendChild(img);
            } else {
                cell.textContent = flight[key];
            }
            if (key === 'remarks') {
                if (flight[key] === 'Delayed') {
                    cell.classList.add('remarks-delayed');
                } else if (flight[key] === 'Gate Change') {
                    cell.classList.add('remarks-gate-change');
                } else if (flight[key] === 'Cancelled') {
                    cell.classList.add('remarks-cancelled');
                } else if (flight[key] === 'Boarding Final Call') {
                    cell.classList.add('remarks-boarding-final-call');
                }
            }
            row.appendChild(cell);
        });
        
        flightInfoContainer.appendChild(row);
    });

    function updateDateTime() {
        const now = new Date();
        const dateTimeString = now.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit'}) + ' ' +
                               now.toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric'});
        document.getElementById('currentDateTime').textContent = dateTimeString;
    }

    setInterval(updateDateTime, 1000);
    updateDateTime();
});
