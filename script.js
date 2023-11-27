let latitude;
let longitude;

// Function to fetch and display places data
async function fetchPlaces() {
    try {
      const response = await fetch('https://tour-guide-app-backend.onrender.com/tour_guide/shortest-path');
      const data = await response.json();
      const placesList = document.getElementById('placesList');
  
      data.data.forEach(place => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.innerHTML = `
          <div class="form-check">
            <input type="checkbox" class="form-check-input" id="${place[0]}Checkbox">
            <label class="form-check-label d-flex justify-content-between align-items-center" for="${place[0]}Checkbox">
              <div>
                <strong>${place[0]}</strong>: ${place[1]}
          </div>`;
        placesList.appendChild(listItem);
      });
  
      // Get device's geolocation
      navigator.geolocation.getCurrentPosition(
        position => {
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        },
        error => {
          console.error('Error getting geolocation:', error);
        }
      );
    } catch (error) {
      console.error('Error fetching places data:', error);
    }
  }
  

// Function to handle Check Route button click
async function checkSelectedRoutes() {
  const checkboxes = document.querySelectorAll('.form-check-input:checked');

  if (checkboxes.length === 0) {
    console.warn('No checkboxes selected.');
    return;
  }

  const names = Array.from(checkboxes).map(checkbox => checkbox.id.replace('Checkbox', ''));

  try {
    const response = await fetch('https://tour-guide-app-backend.onrender.com/tour_guide/shortest-path', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        names: names,
        current_coordinates: [latitude, longitude],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Route information:', result);

    // Redirect to another page with the response data
    const redirectUrl = `result.html?data=${encodeURIComponent(JSON.stringify(result))}`;
    window.location.href = redirectUrl;
  } catch (error) {
    console.error('Error checking routes:', error);
  }
}

// Fetch places data when the page is loaded
document.addEventListener('DOMContentLoaded', fetchPlaces);
