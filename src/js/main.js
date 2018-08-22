let restaurants,
    neighborhoods,
    cuisines
var newMap
var markers = []


/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  //initMap();
  fetchNeighborhoods();
  fetchCuisines();
  updateRestaurants();
  const showMapButton = document.querySelector('#mapButton');
  showMapButton.addEventListener('click', initMap);

});

/**
 * Fetch all neighborhoods and set their HTML.
 */
const fetchNeighborhoods = () => {
  DBHelper.fetchNeighborhoods((error, neighborhoods) => {
    if (error) { // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
}

/**
 * Set neighborhoods HTML.
 */
const fillNeighborhoodsHTML = (neighborhoods = self.neighborhoods) => {
  const select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(neighborhood => {
    const option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
}

/**
 * Fetch all cuisines and set their HTML.
 */
const fetchCuisines = () => {
  DBHelper.fetchCuisines((error, cuisines) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
}

/**
 * Set cuisines HTML.
 */
const fillCuisinesHTML = (cuisines = self.cuisines) => {
  const select = document.getElementById('cuisines-select');

  cuisines.forEach(cuisine => {
    const option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
}

/**
 * Initialize leaflet, called from HTML.
 */
window.initMap = () => {
  self.newMap = L.map('map',{
    zoom: 12,
    center: [40.722216, -73.987501],
    scrollWheelZoom: false
  });

  L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token={mapboxToken}', {
    mapboxToken: 'pk.eyJ1Ijoibm5pc2UiLCJhIjoiY2psNHoxZm4wMjlsejNwbndvMWh0c2NpOSJ9.alGKM8jhN8BHF-Wlxhgq7g',
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
      '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox.streets'
  }).addTo(newMap);


  updateRestaurants();

  const mapElement = document.querySelector('#map');
  const showMapButton = document.querySelector('#mapButton');

  mapElement.classList.add('show');
  showMapButton.remove();
  

}

/**
 * Update page and map for current restaurants.
 */
const updateRestaurants = () => {
  const cSelect = document.getElementById('cuisines-select');
  const nSelect = document.getElementById('neighborhoods-select');

  const cIndex = cSelect.selectedIndex;
  const nIndex = nSelect.selectedIndex;

  const cuisine = cSelect[cIndex].value;
  const neighborhood = nSelect[nIndex].value;

  DBHelper.fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, (error, restaurants) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
    }
  })
}

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
const resetRestaurants = (restaurants) => {
  // Remove all restaurants
  self.restaurants = [];
  const ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(m => m.setMap(null));
  self.markers = [];
  self.restaurants = restaurants;
}

/**
 * Create all restaurants HTML and add them to the webpage.
 */
const fillRestaurantsHTML = (restaurants = self.restaurants) => {
  const ul = document.getElementById('restaurants-list');
  restaurants.forEach(restaurant => {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
}

/**
 * Create restaurant HTML.
 */
createRestaurantHTML = (restaurant) => {
  const li = document.createElement('li');
 
  const image = document.createElement('img');
  image.setAttribute('aria-label', 'restaurant: ' + restaurant.name);
  image.setAttribute('alt', 'Photo of ' + restaurant.name + ' in ' + restaurant.neighborhood);
  //https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  //Detecting visibility of images through the Intersection Observer API, here the images are the target
  let lazyImageObserver;
  const options = {
    // it has a threshold for each percentage point of visibility;
    threshold: 0.1
  }
  if ("IntersectionObserver" in window) {
    lazyImageObserver = new IntersectionObserver(callback, options);
    lazyImageObserver.observe(image);  
    }else{
    console.log('This browser does not support IntersectionObserver');
    loadImage(image);
  }  
  
  const loadImage = image => {
    image.className = 'restaurant-img';
    image.src = DBHelper.imageUrlForRestaurant(restaurant);
  }

  function callback (entries, lazyImageObserver){
    entries.forEach(entry => {
      if (entry.intersectionRatio > 0){
        loadImage(entry.target);
        lazyImageObserver.unobserve(entry.target);
        }
    })
  }
  li.append(image);

  


  //create favorite Button in each restaurant Card and adds functionality
  const favoriteButton = document.createElement('button');
  favoriteButton.classList.add ('fav-button');
  favoriteButton.innerHTML = `✰`;
  //onClick changes the is_favorite status to the opposite value and changes the icon accordingly
  favoriteButton.onclick = function(){
    const currentState = !restaurant.is_favorite;
    DBHelper.updateFavorite(restaurant.id, currentState);
    restaurant.is_favorite = !restaurant.is_favorite;
    iconFavVisualChange(favoriteButton, restaurant.is_favorite)
  }
  iconFavVisualChange(favoriteButton, restaurant.is_favorite)
  li.appendChild(favoriteButton);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = '+ Details';
  more.className = 'raised button ripple';
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute('aria-label', 'more about ' + restaurant.name);
  li.append(more)

  return li
}

iconFavVisualChange = (iconFav, favorite) => {
  if (!favorite) {
    iconFav.classList.remove('isAFavorite');
    iconFav.classList.add('isNotAFavorite');
    iconFav.setAttribute('aria-label', 'set as a favorite restaurant');
  } else {
    iconFav.classList.remove('isNotAFavorite');
    iconFav.classList.add('isAFavorite');
    iconFav.setAttribute('aria-label', 'remove from my favorite restaurants');
  }

}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.newMap);
    marker.on('click', onClick);
    function onClick(){
      window.location.href = marker.options.url;
    }
    self.markers.push(marker);
    });
  };



