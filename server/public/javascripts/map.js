document.addEventListener('DOMContentLoaded', function() {
    // Initialize the map centered on St. Louis
    const map = L.map('map').setView([38.6270, -90.1994], 12);
    let markerGroup = L.layerGroup().addTo(map);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Function to update markers based on current filters
    async function updateMarkers() {
        const crimeType = document.getElementById('crimeType').value;
        const district = document.getElementById('district').value;
        const fromDate = document.getElementById('fromDate').value;
        const toDate = document.getElementById('toDate').value;

        // Build query parameters
        const params = new URLSearchParams({
            crimeType,
            district,
            fromDate,
            toDate
        });

        try {
            // Update the endpoint to match your router
            const response = await fetch(`/crime?${params}`);
            const crimes = await response.json();

            // Clear existing markers
            markerGroup.clearLayers();

            // Add new markers
            crimes.forEach(crime => {
                if (crime.Latitude && crime.Longitude) {
                    const marker = L.marker([crime.Latitude, crime.Longitude])
                        .bindPopup(`
                            <div class="crime-popup">
                                <h3>${crime.Offense}</h3>
                                <p><strong>Date:</strong> ${crime.IncidentDate.split('T')[0]}</p>
                                <p><strong>Time:</strong> ${crime.OccurredFromTime}</p>
                                <p><strong>Location:</strong> ${crime.IncidentLocation}</p>
                                <p><strong>District:</strong> ${crime.District}</p>
                                <p><strong>Neighborhood:</strong> ${crime.Neighborhood}</p>
                                ${crime.FirearmUsed === 'Yes' ? '<p><strong>Firearm Used:</strong> Yes</p>' : ''}
                                <p><strong>Classification:</strong> ${crime.FelMisdCit || 'Not specified'}</p>
                            </div>
                        `);
                    markerGroup.addLayer(marker);
                }
            });
        } catch (error) {
            console.error('Error fetching crime data:', error);
        }
    }

    // Add event listeners to all filter controls
    document.getElementById('district').addEventListener('change', updateMarkers);
    document.getElementById('crimeType').addEventListener('change', updateMarkers);
    document.getElementById('fromDate').addEventListener('change', updateMarkers);
    document.getElementById('toDate').addEventListener('change', updateMarkers);

    // Initial load of markers
    updateMarkers();
});