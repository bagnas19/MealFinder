const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
const recommendedGrid = document.getElementById('recommendedGrid');
const homeFavoritesGrid = document.getElementById('homeFavoritesGrid');
const favoritesGrid = document.getElementById('favoritesGrid');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const noResultsDiv = document.getElementById('noResults');
const searchTitle = document.getElementById('searchTitle');
const favCountSpan = document.getElementById('favCount');
const languageSelect = document.getElementById('languageSelect');

// Storage
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Update favorite count
function updateFavoriteCount() {
    favCountSpan.textContent = favorites.length;
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    updateFavoriteCount();
    loadRecommended();
    loadHomeFavorites();
});

// NAVIGATION
function showSection(sectionName) {
    document.getElementById('homeSection').classList.add('hidden');
    document.getElementById('searchSection').classList.add('hidden');
    document.getElementById('favoritesSection').classList.add('hidden');
    
    document.getElementById(sectionName + 'Section').classList.remove('hidden');
    
    if (sectionName === 'favorites') {
        loadFavorites();
    }
    
    window.scrollTo(0, 0);
}

function quickSearch(query) {
    searchInput.value = query;
    showSection('search');
    searchForm.dispatchEvent(new Event('submit'));
}

// SEARCH
searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const query = searchInput.value.trim();
    if (!query) return;
    
    showSection('search');
    showLoading();
    
    fetch(BASE_URL + '/search.php?s=' + query)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            hideLoading();
            
            if (!data.meals || data.meals.length === 0) {
                resultsContainer.innerHTML = '';
                noResultsDiv.classList.remove('hidden');
                return;
            }
            
            noResultsDiv.classList.add('hidden');
            displayMeals(data.meals, resultsContainer);
        })
        .catch(function(error) {
            hideLoading();
            showError('Failed to fetch meals. Please check your connection.');
        });
});

// LOAD RECOMMENDED
function loadRecommended() {
    recommendedGrid.innerHTML = '<div class="loading-container"><div class="spinner"></div><p>Loading...</p></div>';
    
    Promise.all([
        fetch(BASE_URL + '/search.php?s=chicken').then(r => r.json()),
        fetch(BASE_URL + '/search.php?s=pasta').then(r => r.json()),
        fetch(BASE_URL + '/search.php?s=beef').then(r => r.json()),
        fetch(BASE_URL + '/search.php?s=seafood').then(r => r.json())
    ])
    .then(function(results) {
        let allMeals = [];
        results.forEach(function(data) {
            if (data.meals) {
                allMeals = allMeals.concat(data.meals.slice(0, 2));
            }
        });
        
        allMeals = allMeals.sort(function() { return 0.5 - Math.random() });
        displayMeals(allMeals.slice(0, 6), recommendedGrid);
    })
    .catch(function(error) {
        recommendedGrid.innerHTML = '<div class="empty-state">Failed to load</div>';
    });
}

// DISPLAY MEALS
function displayMeals(meals, container) {
    container.innerHTML = '';
    
    if (!meals || meals.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No meals found</p></div>';
        return;
    }
    
    meals.forEach(function(meal) {
        const isFavorite = favorites.some(function(f) { 
            return f && f.idMeal === meal.idMeal; 
        });
        
        const card = document.createElement('article');
        card.className = 'card';
        card.setAttribute('data-id', meal.idMeal);
        
        card.innerHTML = 
            '<button class="favorite-btn ' + (isFavorite ? 'active' : '') + '" data-id="' + meal.idMeal + '">' + (isFavorite ? '❤️' : '🤍') + '</button>' +
            '<img src="' + meal.strMealThumb + '" alt="' + meal.strMeal + '">' +
            '<div class="card-content">' +
                '<h3>' + meal.strMeal + '</h3>' +
                '<div class="info-row">' +
                    '<span class="badge badge-category">📂 ' + (meal.strCategory || 'Category') + '</span>' +
                    '<span class="badge badge-area">🌍 ' + (meal.strArea || 'Area') + '</span>' +
                '</div>' +
                '<p class="instructions">' + (meal.strInstructions || 'No instructions').substring(0, 150) + '...</p>' +
                '<div class="btn-group">' +
                    (meal.strSource ? '<a href="' + meal.strSource + '" target="_blank" class="btn-recipe">View Recipe</a>' : '') +
                    (meal.strYoutube ? '<a href="' + meal.strYoutube + '" target="_blank" class="btn-video">▶ Video</a>' : '') +
                '</div>' +
            '</div>';
        
        const favBtn = card.querySelector('.favorite-btn');
        favBtn.addEventListener('click', function() {
            const mealId = this.getAttribute('data-id');
            const isActive = this.classList.contains('active');
            toggleFavorite(mealId, isActive, this);
        });
        
        container.appendChild(card);
    });
}

// FAVORITES
function toggleFavorite(mealId, isCurrentlyActive, buttonElement) {
    if (isCurrentlyActive) {
        favorites = favorites.filter(function(f) {
            return f && f.idMeal !== mealId;
        });
        
        if (buttonElement) {
            buttonElement.innerHTML = '🤍';
            buttonElement.classList.remove('active');
        }
    } else {
        fetch(BASE_URL + '/lookup.php?i=' + mealId)
            .then(function(response) { return response.json(); })
            .then(function(data) {
                if (data.meals && data.meals[0]) {
                    const meal = data.meals[0];
                    favorites.push(meal);
                    
                    if (buttonElement) {
                        buttonElement.innerHTML = '❤️';
                        buttonElement.classList.add('active');
                    }
                    
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    updateFavoriteCount();
                    loadHomeFavorites();
                }
            })
            .catch(function(error) {
                console.error('Error adding favorite:', error);
            });
        
        return;
    }
    
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoriteCount();
    loadHomeFavorites();
}

function loadHomeFavorites() {
    if (favorites.length === 0) {
        homeFavoritesGrid.innerHTML = '<div class="empty-state"><p>No favorites yet. Click the heart!</p></div>';
    } else {
        displayMeals(favorites, homeFavoritesGrid);
    }
}

function loadFavorites() {
    if (favorites.length === 0) {
        favoritesGrid.innerHTML = '<div class="empty-state"><p>No favorites yet. Click the heart!</p></div>';
    } else {
        displayMeals(favorites, favoritesGrid);
    }
}

// HELPERS
function showLoading() {
    resultsContainer.innerHTML = '';
    errorDiv.classList.add('hidden');
    noResultsDiv.classList.add('hidden');
    searchTitle.classList.add('hidden');
    loadingDiv.classList.remove('hidden');
}

function hideLoading() {
    loadingDiv.classList.add('hidden');
    searchTitle.classList.remove('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
}

// TRANSLATION
function translatePage() {
    const targetLang = languageSelect.value;
    
    if (targetLang === 'en') {
        location.reload();
        return;
    }
    
    const allElements = document.querySelectorAll('h1, h2, h3, p, .logo, .badge, .empty-state, .search-tags button, .nav-links a, .section-header h2, .section-header p, footer p, #searchInput');
    
    const originals = [];
    allElements.forEach(function(el, index) {
        originals[index] = el.textContent;
    });
    
    document.body.style.cursor = 'wait';
    
    let translatedCount = 0;
    
    allElements.forEach(function(el, index) {
        const text = originals[index];
        
        if (text && text.trim().length > 0 && text.length < 100 && !text.includes('http')) {
            translateSingleText(text, targetLang, function(translatedText) {
                if (translatedText && translatedText !== text) {
                    el.textContent = translatedText;
                }
                translatedCount++;
                
                if (translatedCount >= allElements.length) {
                    document.body.style.cursor = 'default';
                }
            });
        } else {
            translatedCount++;
        }
    });
    
    setTimeout(function() {
        document.body.style.cursor = 'default';
    }, 3000);
}

function translateSingleText(text, targetLang, callback) {
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=en|' + targetLang;
    
    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (data.responseStatus === 200 && data.responseData.translatedText) {
                callback(data.responseData.translatedText);
            } else {
                callback(null);
            }
        })
        .catch(function(err) {
            callback(null);
        });
}

// DESSERT API
function searchDesserts() {
    showSection('search');
    showLoading();
    
    const url = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert';
    
    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            hideLoading();
            
            if (!data.meals || data.meals.length === 0) {
                resultsContainer.innerHTML = '';
                noResultsDiv.classList.remove('hidden');
                return;
            }
            
            noResultsDiv.classList.add('hidden');
            
            const mealPromises = data.meals.slice(0, 12).map(function(meal) {
                return fetch(BASE_URL + '/lookup.php?i=' + meal.idMeal)
                    .then(function(res) { return res.json(); })
                    .then(function(d) { return d.meals ? d.meals[0] : null; });
            });
            
            Promise.all(mealPromises)
                .then(function(meals) {
                    displayMeals(meals, resultsContainer);
                });
        })
        .catch(function(error) {
            hideLoading();
            showError('Failed to fetch desserts. Please check your connection.');
        });
}