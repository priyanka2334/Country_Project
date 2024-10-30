let currentPage = 1;
const pageSize = 10;
let allCountries = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Fetch country data from API
async function fetchCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,capital,population,area,languages,tld");
    allCountries = await response.json();
    displayCountries(allCountries.slice(0, pageSize));
    displayWishlist();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Display paginated list of countries
function displayCountries(countries) {
  const countryList = document.getElementById('countryList');
  countryList.innerHTML = ''; // Clear previous countries
  countries.forEach(country => {
    const countryCard = document.createElement('div');
    countryCard.classList.add('country-card');
    countryCard.innerHTML = `
      <img class='main-img' src="${country.flags.png}" alt="Flag of ${country.name.common}" onclick="showCountryDetails('${country.name.common}')">
      <h3>${country.name.common}</h3>
      <button class="like-button" onclick="toggleWishlist('${country.name.common}', this)">❤️</button>
    `;
    countryList.appendChild(countryCard);
  });
}

// Display specific country details
function showCountryDetails(countryName) {
  const country = allCountries.find(c => c.name.common === countryName);
  if (country) {
    const detailsPage = document.getElementById('countryDetails');
    detailsPage.innerHTML = `
      <h2>${country.name.common}</h2>
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
      <p><strong>Top Level Domain:</strong> ${country.tld[0]}</p>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
      <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
      <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
      <button class='back' onclick="goBack()">Back</button>
    `;
    document.getElementById('mainPage').style.display = 'none';
    detailsPage.style.display = 'block';
  }
}

// Go back to the main page
function goBack() {
  document.getElementById('mainPage').style.display = 'block';
  document.getElementById('countryDetails').style.display = 'none';
}

// Toggle wishlist status for countries
function toggleWishlist(countryName, button) {
  if (wishlist.includes(countryName)) {
    wishlist = wishlist.filter(name => name !== countryName);
    button.classList.remove('liked');
  } else if (wishlist.length < 5) {
    wishlist.push(countryName);
    button.classList.add('liked');
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  displayWishlist();
}

// Display wishlist
function displayWishlist() {
  const wishlistList = document.getElementById('wishlist');
  wishlistList.innerHTML = wishlist.length ? '<h3>Wishlist</h3>' : '';

  wishlist.forEach(wished => {
    const country = allCountries.find(c => c.name.common === wished);
    if (country) {
      const wishItem = document.createElement('div');
      wishItem.className = 'wish-item';
      wishItem.innerHTML = `
        <img class='wish-img' src="${country.flags.png}" alt="Flag of ${country.name.common}" class="wishlist-flag">
        <p>${country.name.common} <button class="remove" onclick="removeWishlist('${wished}')">Remove</button></p>
      `;
      wishlistList.appendChild(wishItem);
    }
  });

  wishlistList.style.display = wishlist.length ? 'block' : 'none';
}

// Remove country from wishlist
function removeWishlist(countryName) {
  wishlist = wishlist.filter(name => name !== countryName);
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  displayWishlist();
}

// Search functionality with dynamic suggestions
document.getElementById('searchInput').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const suggestions = allCountries
    .filter(country => country.name.common.toLowerCase().includes(query))
    .slice(0, 5);
  const suggestionsContainer = document.getElementById('searchSuggestions');
  suggestionsContainer.innerHTML = suggestions
    .map(country => `<p class="suggestion-item" onclick="searchCountry('${country.name.common}')">${country.name.common}</p>`)
    .join('');
  const viewAllBtn = `<button onclick="viewAllResults('${query}')">View All</button>`;
  suggestionsContainer.innerHTML += viewAllBtn;
});

// Search for a country and display it
function searchCountry(name) {
  const country = allCountries.find(c => c.name.common === name);
  if (country) {
    displayCountries([country]);
    document.getElementById('searchSuggestions').innerHTML = '';
  }
}

// View all results for search query
function viewAllResults(query) {
  const results = allCountries.filter(country => country.name.common.toLowerCase().includes(query));
  displayCountries(results);
  document.getElementById('searchSuggestions').innerHTML = '';
}

// Filtering countries by language or region
function filterCountries() {
  const language = document.getElementById('languageFilter').value;
  const region = document.getElementById('regionFilter').value;
  let filteredCountries = allCountries;
  if (language) {
    filteredCountries = filteredCountries.filter(country => Object.values(country.languages || {}).includes(language));
  }
  if (region) {
    filteredCountries = filteredCountries.filter(country => country.region === region);
  }
  displayCountries(filteredCountries);
}

// Show more countries
document.getElementById('showMoreBtn').addEventListener('click', () => {
  currentPage++;
  const startIndex = (currentPage - 1) * pageSize;
  const newCountries = allCountries.slice(startIndex, startIndex + pageSize);
  displayCountries(newCountries);
});

// Event listeners for filters
document.getElementById('languageFilter').addEventListener('change', filterCountries);
document.getElementById('regionFilter').addEventListener('change', filterCountries);

// Initialize the application
fetchCountries();










// let currentPage = 1;
// const pageSize = 10;
// let allCountries = [];
// let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// // Fetch country data from API
// async function fetchCountries() {
//   try {
//     const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,capital,population,area,languages,tld");
//     allCountries = await response.json();
//     displayCountries(allCountries.slice(0, pageSize));
//     displayFavorites();
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// // Display paginated list of countries
// function displayCountries(countries) {
//   const countryList = document.getElementById('countryList');
//   countryList.innerHTML = ''; // Clear previous countries
//   countries.forEach(country => {
//     const countryCard = document.createElement('div');
//     countryCard.classList.add('country-card');
//     countryCard.innerHTML = `
//       <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
//       <h3>${country.name.common}</h3>
//       <button class="like-button" onclick="toggleLike('${country.name.common}', this)">❤️</button>
//     `;
//     countryCard.onclick = () => showCountryDetails(country);
//     countryList.appendChild(countryCard);
//   });
// }

// // Display specific country details
// function showCountryDetails(country) {
//   const detailsPage = document.getElementById('countryDetails');
//   detailsPage.innerHTML = `
//     <h2>${country.name.common}</h2>
//     <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
//     <p><strong>Top Level Domain:</strong> ${country.tld[0]}</p>
//     <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
//     <p><strong>Region:</strong> ${country.region}</p>
//     <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
//     <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
//     <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
//     <button onclick="goBack()">Back</button>
//   `;
//   document.getElementById('mainPage').style.display = 'none';
//   detailsPage.style.display = 'block';
// }

// // Go back to the main page
// function goBack() {
//   document.getElementById('mainPage').style.display = 'block';
//   document.getElementById('countryDetails').style.display = 'none';
// }

// // Toggle like status for countries
// function toggleLike(countryName, button) {
//   if (favorites.includes(countryName)) {
//     favorites = favorites.filter(name => name !== countryName);
//     button.classList.remove('liked');
//   } else if (favorites.length < 5) {
//     favorites.push(countryName);
//     button.classList.add('liked');
//   }
//   localStorage.setItem('favorites', JSON.stringify(favorites));
//   displayFavorites();
// }

// // Display favorites
// function displayFavorites() {
//   const favoritesList = document.getElementById('favorites');
//   favoritesList.innerHTML = favorites.length ? `<h3>Favorites</h3>` : '';
//   favorites.forEach(favorite => {
//     const favItem = document.createElement('div');
//     favItem.className = 'favorite-item';
//     favItem.innerHTML = `
//       <p>${favorite} <button onclick="removeFavorite('${favorite}')">Remove</button></p>
//     `;
//     favoritesList.appendChild(favItem);
//   });
//   favoritesList.style.display = favorites.length ? 'block' : 'none';
// }

// // Remove favorite country
// function removeFavorite(countryName) {
//   favorites = favorites.filter(name => name !== countryName);
//   localStorage.setItem('favorites', JSON.stringify(favorites));
//   displayFavorites();
// }

// // Search functionality with dynamic suggestions
// document.getElementById('searchInput').addEventListener('input', function() {
//   const query = this.value.toLowerCase();
//   const suggestions = allCountries
//     .filter(country => country.name.common.toLowerCase().includes(query))
//     .slice(0, 5);
//   const suggestionsContainer = document.getElementById('searchSuggestions');
//   suggestionsContainer.innerHTML = suggestions
//     .map(country => `<p class="suggestion-item" onclick="searchCountry('${country.name.common}')">${country.name.common}</p>`)
//     .join('');
//   const viewAllBtn = `<button onclick="viewAllResults('${query}')">View All</button>`;
//   suggestionsContainer.innerHTML += viewAllBtn;
// });

// // Search for a country and display it
// function searchCountry(name) {
//   const country = allCountries.find(c => c.name.common === name);
//   if (country) {
//     displayCountries([country]);
//     document.getElementById('searchSuggestions').innerHTML = '';
//   }
// }

// // View all results for search query
// function viewAllResults(query) {
//   const results = allCountries.filter(country => country.name.common.toLowerCase().includes(query));
//   displayCountries(results);
//   document.getElementById('searchSuggestions').innerHTML = '';
// }

// // Filtering countries by language or region
// function filterCountries() {
//   const language = document.getElementById('languageFilter').value;
//   const region = document.getElementById('regionFilter').value;
//   let filteredCountries = allCountries;

//   if (language) {
//     filteredCountries = filteredCountries.filter(country => Object.values(country.languages || {}).includes(language));
//   }
//   if (region) {
//     filteredCountries = filteredCountries.filter(country => country.region === region);
//   }
//   displayCountries(filteredCountries);
// }

// // Show more countries
// document.getElementById('showMoreBtn').addEventListener('click', () => {
//   currentPage++;
//   const startIndex = (currentPage - 1) * pageSize;
//   const newCountries = allCountries.slice(startIndex, startIndex + pageSize);
//   displayCountries(newCountries);
// });

// // Event listeners for filters
// document.getElementById('languageFilter').addEventListener('change', filterCountries);
// document.getElementById('regionFilter').addEventListener('change', filterCountries);

// // Initialize the application
// fetchCountries();






























// let currentPage = 1;
// const pageSize = 10;
// let allCountries = [];
// let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// // Fetch country data from API
// async function fetchCountries() {
//   try {
//     const response = await fetch("https://restcountries.com/v3.1/all?fields=name,flags,region,capital,population,area,languages,tld");
//     allCountries = await response.json();
//     displayCountries(allCountries.slice(0, pageSize));
//     displayFavorites();
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// // Display paginated list of countries
// function displayCountries(countries) {
//   const countryList = document.getElementById('countryList');
//   countryList.innerHTML = '';
//   countries.forEach(country => {
//     const countryCard = document.createElement('div');
//     countryCard.classList.add('country-card');
//     countryCard.innerHTML = `
//       <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
//       <h3>${country.name.common}</h3>
//       <button class="like-button" onclick="toggleLike('${country.name.common}', this)">❤️</button>
//     `;
//     countryCard.onclick = () => showCountryDetails(country);
//     countryList.appendChild(countryCard);
//   });
// }

// // Display specific country details in a simulated details page
// function showCountryDetails(country) {
//   const detailsPage = document.getElementById('countryDetails');
//   detailsPage.innerHTML = `
//     <h2>${country.name.common}</h2>
//     <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
//     <p><strong>Top Level Domain:</strong> ${country.tld[0]}</p>
//     <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
//     <p><strong>Region:</strong> ${country.region}</p>
//     <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
//     <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
//     <p><strong>Languages:</strong> ${Object.values(country.languages).join(', ')}</p>
//     <button onclick="goBack()">Back</button>
//   `;
//   document.getElementById('mainPage').style.display = 'none';
//   detailsPage.style.display = 'block';
// }

// // Go back to the main page
// function goBack() {
//   document.getElementById('mainPage').style.display = 'block';
//   document.getElementById('countryDetails').style.display = 'none';
// }

// // Toggle like status for countries
// function toggleLike(countryName, button) {
//   if (favorites.includes(countryName)) {
//     favorites = favorites.filter(name => name !== countryName);
//     button.classList.remove('liked'); // Remove the liked class
//   } else if (favorites.length < 5) {
//     favorites.push(countryName);
//     button.classList.add('liked'); // Add the liked class
//   }
//   localStorage.setItem('favorites', JSON.stringify(favorites));
//   displayFavorites();
// }

// // Display favorites
// function displayFavorites() {
//   const favoritesList = document.getElementById('favorites');
//   favoritesList.innerHTML = favorites.length ? `<h3>Favorites</h3>` : '';
//   favorites.forEach(favorite => {
//     const favItem = document.createElement('div');
//     favItem.className = 'favorite-item';
//     favItem.innerHTML = `
//       <p>${favorite} <button onclick="removeFavorite('${favorite}')">Remove</button></p>
//     `;
//     favoritesList.appendChild(favItem);
//   });
//   favoritesList.style.display = favorites.length ? 'block' : 'none'; // Show only if there are favorites
// }

// // Remove favorite country
// function removeFavorite(countryName) {
//   favorites = favorites.filter(name => name !== countryName);
//   localStorage.setItem('favorites', JSON.stringify(favorites));
//   displayFavorites();
// }

// // Search functionality with dynamic suggestions
// document.getElementById('searchInput').addEventListener('input', function() {
//   const query = this.value.toLowerCase();
//   const suggestions = allCountries
//     .filter(country => country.name.common.toLowerCase().includes(query))
//     .slice(0, 5);
//   const suggestionsContainer = document.getElementById('searchSuggestions');
//   suggestionsContainer.innerHTML = suggestions
//     .map(country => `<p class="suggestion-item" onclick="searchCountry('${country.name.common}')">${country.name.common}</p>`)
//     .join('');
//   const viewAllBtn = `<button onclick="viewAllResults('${query}')">View All</button>`;
//   suggestionsContainer.innerHTML += viewAllBtn;
// });

// // Search for a country and display it
// function searchCountry(name) {
//   const country = allCountries.find(c => c.name.common === name);
//   if (country) {
//     displayCountries([country]);
//     document.getElementById('searchSuggestions').innerHTML = '';
//   }
// }

// // View all results for search query
// function viewAllResults(query) {
//   const results = allCountries.filter(country => country.name.common.toLowerCase().includes(query));
//   displayCountries(results);
//   document.getElementById('searchSuggestions').innerHTML = '';
// }

// // Filtering countries by language or region
// function filterCountries() {
//   const language = document.getElementById('languageFilter').value;
//   const region = document.getElementById('regionFilter').value;
//   let filteredCountries = allCountries;

//   if (language) {
//     filteredCountries = filteredCountries.filter(country => Object.values(country.languages || {}).includes(language));
//   }
//   if (region) {
//     filteredCountries = filteredCountries.filter(country => country.region === region);
//   }
//   displayCountries(filteredCountries);
// }

// // Show more countries
// document.getElementById('showMoreBtn').addEventListener('click', () => {
//   currentPage++;
//   const startIndex = (currentPage - 1) * pageSize;
//   const newCountries = allCountries.slice(startIndex, startIndex + pageSize);
//   displayCountries(newCountries);
// });

// // Event listeners for filters
// document.getElementById('languageFilter').addEventListener('change', filterCountries);
// document.getElementById('regionFilter').addEventListener('change', filterCountries);

// // Initialize the application
// fetchCountries();
