  /**
   * Adding Reviews, Offline first, Bacground Sync
   * adaptation from Build an offline-first, data-driven PWA (codeLab)
   * https://codelabs.developers.google.com/codelabs/workbox-indexeddb/index.html?index=..%2F..%2Findex#0
   */
let reviewsByRest;
loadReviewsOnNetworkFirst(self.restaurant_id);
const id = getParameterByName('id');

  
  /**
   * Checking Network connectivity and acting accordingly
   */
//
function loadReviewsOnNetworkFirst(id) {
  debugger;
  //fetches de data from the server
  getServerData()
  //once the data is received the page and IndexedDB are updated
  .then(dataFromNetwork => {
    debugger
    updateReviewsHTML(dataFromNetwork);
    debugger
    saveReviewDataLocally(dataFromNetwork)
    //when the data is successfully saved, a timestamp is stored and the user is
    //notified that the data is available for offline use.
    .then(() => {
      debugger
      setLastUpdated(new Date());
      messageDataSaved();
    }).catch(err => {
      messageSaveError();
      console.warn(err);
    });
  }).catch(err => {
    console.log('Network requests have failed, this happens when offline');
    //getServerData() was rejected and the catch method took over.
    //the getLocalReviewData function retrieves local data from IndexedDB
    getLocalReviewData()
    .then(offlineData => {
      if (!offlineData.length) {
        //if there isn't local data saved, the user is alerted
        messageNoData();
      } else {
        //local data is displayed on the page and the user is informed that the
        //data might be outdated.
        messageOffline();
        updateReviewsHTML(offlineData);
      }
    });
  });
}

   /* Network functions */
  
//getting Server Data
function getServerData() {
  return fetch(`${DBHelper.DATABASE_URL}/reviews/?restaurant_id=`+window.location.search.slice(4))
  .then(response => {
    if (!response.ok) {
      throw Error(response.statusText);
      }
    debugger
    return response.json();
  });
}

//adding reviews to Server Data
//the preventDefault() Event method cancels the event if it is cancelable
//that means that the default action that belongs to the event will not occur.
function addAndPostReview(e) {
  e.preventDefault();
    const data = [{
      restaurant_id: parseInt(window.location.search.slice(4)),
      createdAt: Date.now(),
      name: document.getElementById('name').value,
      rating: document.getElementById('rating').value,
      comments: document.getElementById('comments').value
    }];
    updateReviewsHTML(data);
    //keeps the local data up-to-date when user adds new reviews.
    saveReviewDataLocally(data);
    const headers = new Headers({'Content-Type': 'application/json'});
    const body = JSON.stringify(data);
    return fetch(`${DBHelper.DATABASE_URL}/reviews/`, {
      method: 'POST',
      headers: headers,
      body: body
  });
}

/* Local functions */
        
function getLocalReviewData() {
  debugger
  if (!('indexedDB' in window)) {return null;}
  return dbPromise.then(db => {
    debugger
    const tx = db.transaction('reviews', 'readonly');
    const reviewsStore = tx.objectStore('reviews');
    debugger
    return reviewsStore.getAll();
  });
}



// this function takes an array of objects and add each object to the IndexeDB database.
// The store.put happens inside a Promise.all which allows to catch an error and abort the transaction if any
// of the put operations fail. This rolls back all the changes that happened in the transaction  - nothing will be added to the store
function saveReviewDataLocally(reviews) {
  console.log("reviews to save:", reviews);
  if (!('indexedDB' in window)) {return null;}
  return dbPromise.then(db => {
    debugger;
    const tx = db.transaction('reviews', 'readwrite');
    const reviewsStore = tx.objectStore('reviews');
    reviews.forEach(review => reviewsStore.put(review))
  }).catch(() => {
      throw Error ('Reviews were not added to the store')
  })
}


/* HTML */


/**
 * Create all reviews HTML and add them to the webpage.
 */
 
function updateReviewsHTML (reviews = self.restaurant.reviews) {
    console.log("recibido:", reviews);
    const container = document.getElementById('reviews-container');
    //const id = getParameterByName('id');
    //console.log('id:', id);
    //const title = document.createElement('h2');
    //title.innerHTML = 'Reviews';
    //container.appendChild(title);

    if (!reviews) {
      const noReviews = document.createElement('p');
      noReviews.innerHTML = 'No reviews yet!';
      container.appendChild(noReviews);
      return;
    }
    const ul = document.getElementById('reviews-list');
    reviews.forEach(review => {
      if (review.restaurant_id == window.location.search.slice(4)){
        ul.appendChild(createReviewHTML(review));
      }
      
    });
    container.appendChild(ul);
}


/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = (review) => {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  const reviewDate = new Date(review.createdAt);
  //adds format to Date on database
  date.innerHTML = reviewDate.toDateString();
  li.appendChild(date);


  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
}






/**
 * UI functions
*/

const container = document.getElementById('container');
const offlineMessage = document.getElementById('offline');
const noDataMessage = document.getElementById('no-data');
const dataSavedMessage = document.getElementById('data-saved');
const saveErrorMessage = document.getElementById('save-error');
const addReviewButton = document.getElementById('add-review-button');

window.onload=function(){
addReviewButton.addEventListener('click', addAndPostReview);
}

Notification.requestPermission();


function messageOffline() {
  // alert user that data may not be current
  const lastUpdated = getLastUpdated();
  if (lastUpdated) {
    offlineMessage.textContent += ' Last fetched server data: ' + lastUpdated;
  }
  offlineMessage.style.display = 'block';
}

function messageNoData() {
  // alert user that there is no data available
  noDataMessage.style.display = 'block';
}

function messageDataSaved() {
  // alert user that data has been saved for offline
  const lastUpdated = getLastUpdated();
  if (lastUpdated) {dataSavedMessage.textContent += ' on ' + lastUpdated;}
  dataSavedMessage.style.display = 'block';
}

function messageSaveError() {
  // alert user that data couldn't be saved offline
  saveErrorMessage.style.display = 'block';
}

/* Storage functions */

function getLastUpdated() {
  return localStorage.getItem('lastUpdated');
}

function setLastUpdated(date) {
  localStorage.setItem('lastUpdated', date);
}
