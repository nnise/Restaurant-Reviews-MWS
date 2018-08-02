let restaurants,
    neighborhoods,
    cuisines
var map
var markers = []


/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  fetchNeighborhoods();
  fetchCuisines();
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
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  let loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'),{
    zoom: 12,
    center: loc,
    scrollwheel: false
  });

/**
 * Remove tabs in map links - DOES NOT WORK YET
 attribution:
 https://stackoverflow.com/questions/30531075/remove-the-tabindex-the-google-maps-in-my-page
 http://www.techstrikers.com/GoogleMap/Code/google-map-add-tilesloaded-event-Live_Demo.php
 */
  google.maps.event.addListener(map, 'tilesloaded', function(){
    var nodes = $('#map').find('*');
    for(var i=0; i<nodes.length; i++){nodes[i].setAttribute('tabindex','-1'); 
  }
  });
  /**
 * Remove tabs in map links ends
 */
  updateRestaurants();
}
  /**
 * A button to make the map optional and improve performance
 */
  document.getElementById('mapButton').addEventListener('click', () => {
  document.getElementById('map').className = 'show';
  });

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
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.setAttribute('aria-label', 'restaurant: ' + restaurant.name);
  image.setAttribute('alt', 'Photo of ' + restaurant.name + ' in ' + restaurant.neighborhood);
  li.append(image);

  const name = document.createElement('h2');
  name.innerHTML = restaurant.name;
  li.append(name);


  //create favorite Button in each restaurant Card and adds functionality
  const favoriteButton = document.createElement('button');
  favoriteButton.classList.add ('fav-button');
  favoriteButton.innerHTML = '☆';
  //onClick changes the favorie status
  favoriteButton.onclick = function(){
    const currentState = !restaurant.is_favorite;
    DBHelper.updateFavorite(restaurant.id, currentState);
    restaurant.is_favorite = !restaurant.is_favorite;
    emoticonVisualChange(favoriteButton, restaurant.is_favorite)
  }
  emoticonVisualChange(favoriteButton, restaurant.is_favorite)
  li.appendChild(favoriteButton);

  const neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  li.append(neighborhood);

  const address = document.createElement('p');
  address.innerHTML = restaurant.address;
  li.append(address);

  const more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = DBHelper.urlForRestaurant(restaurant);
  more.setAttribute('aria-label', 'more about ' + restaurant.name);
  li.append(more)

  return li
}

emoticonVisualChange = (emoticon, favorite) => {
  if (!favorite) {
    emoticon.classList.remove('isAFavorite');
    emoticon.classList.add('isNotAFavorite');
    emoticon.setAttribute('aria-label', 'set as a favorite restaurant');
  } else {
    emoticon.classList.remove('isNotAFavorite');
    emoticon.classList.add('isAFavorite');
    emoticon.setAttribute('aria-label', 'remove from my favorite restaurants');
  }

}

/**
 * Add markers for current restaurants to the map.
 */
addMarkersToMap = (restaurants = self.restaurants) => {
  restaurants.forEach(restaurant => {
    // Add marker to the map
    const marker = DBHelper.mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', () => {
      window.location.href = marker.url
    });
    self.markers.push(marker);
  });
}


