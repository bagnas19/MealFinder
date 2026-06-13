# Project Description
MealFinder is a web application designed to help users discover recipes from different parts of the world. It allows users to search for meals, explore recommended dishes, save favorite recipes, and translate website content into multiple languages. The application provides a simple and user-friendly experience through real-time API integration and responsive design.

# API Integration
The application integrates with public APIs to retrieve and display dynamic data.

# TheMealDB API
Used as the primary source of recipe information. It provides meal names, images, categories, areas of origin, cooking instructions, recipe links, and YouTube tutorial videos.

# MyMemory Translation API 
Used to support the translation feature of the website. Users can select different languages and translate text displayed on the application. 

# Smart Search Functionality
Users can search meals by entering keywords such as Chicken, Pasta, Beef, or Seafood. Search results are fetched dynamically and displayed instantly without reloading the page.
Quick search buttons are also available to improve accessibility and user convenience.

# Recommended Meals
The system automatically loads recommended meals when the application starts. Popular categories such as Chicken, Pasta, Beef, and Seafood are retrieved from the API to provide meal suggestions for users.

# Favorites Collection
Users can save their preferred meals by clicking the heart icon found on each meal card.
Favorite meals are stored using the browser's Local Storage, allowing saved recipes to remain available even after refreshing or reopening the application.

# Multi-Language Translation
The application includes a built-in translator feature that supports multiple languages.

# Users can:
Select a language from the dropdown menu.
Click the Go button to translate supported text.
Select another language again without losing functionality.
Responsive User Interface
MealFinder features a clean and modern interface designed to provide a smooth user experience.

# Features include:
Responsive layouts for different screen sizes.
Interactive meal cards.
Loading animations.
Hover effects.
Organized navigation using Home, Search, and Favorites sections.
Error Handling
The application includes error handling to improve reliability.

# Examples include:
Displaying messages when no meals are found.
Handling failed API requests due to connection issues.
Preventing the application from crashing when invalid data is returned.
Technologies Used
HTML5
CSS3
JavaScript (ES6)
TheMealDB API
MyMemory Translation API
Local Storage
Visual Studio Code
Live Server Extension
How to Run the Project
Open the project folder using Visual Studio Code.
Ensure that the following files are in the same directory:
index.html
style.css
script.js
Install the Live Server extension if necessary.
Right-click the index.html file and select Open with Live Server.
The application will launch automatically in your default browser.
Make sure that your device has an internet connection since the APIs require online access.
Test the application's features, including searching meals, saving favorites, watching tutorials, and translating content.
