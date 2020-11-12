// constants for teh spoonacular API
const RECIPE_API_KEY = '2a01944c5fed405ca014665c339e93c3';
const spoonacularBaseUrl = 'https://api.spoonacular.com';

// Universal scope variables
var mainEl = document.querySelector('main');
var shoppingList = localStorage.getItem('shoppingList') || [];
var checkedItems = [];
var searchCriteria;
var recipeListLink = document.querySelector('#recipe-list-link');
var shoppingListLink = document.querySelector('#shopping-list-link');
var homepageLink = document.querySelector('#homepage-link');

// Event Listeners
shoppingListLink.addEventListener('click', function () {
  generateIngredientListPage();
})

homepageLink.addEventListener('click', function () {
  generateStartPage();
})

recipeListLink.addEventListener('click', function () {
  var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes")) || [];
  generateRecipesList(savedRecipes, false);
})

// DOM elements for the various pages we'll make
var homepageEl;
var recipesListEl;
var ingredientsInstructionsEl;
var shoppingListEl;

// Fetch Recipes Function
function fetchRecipes(searchValue) {
  const apiUrl = `${spoonacularBaseUrl}/recipes/complexSearch?&apiKey=${RECIPE_API_KEY}&${getQueryParams(searchValue)}`;
  let recipes;
  fetch(apiUrl).then(response => {
    if (response.ok) {
      response.json().then(data => {
        recipes = data.results;
        // bring up the recipe list page
        generateRecipesList(recipes, true);
      });
    } else {
      handleError();
    }
  }).catch(handleError);
}

// Fetch Ingredients Function
function fetchIngredients(recipe, recipeId) {
  const apiUrl = `${spoonacularBaseUrl}/recipes/${recipeId}/information?apiKey=${RECIPE_API_KEY}&includeNutrition=true`;
  fetch(apiUrl).then(response => {
    if (response.ok) {
      response.json().then(data => {
        generateRecipePage(recipe, data);
      })
    }
  })
}

// Get Query Parameters Function
function getQueryParams(queryParam) {
  let httpParams = '';
  if (queryParam) {
    httpParams += `&query=${queryParam}`;
  }
  return httpParams;
}

// Error Handling Function
function handleError() {
  alert('Error occured with spoonacular API call');
}

//* ********************** HTML GENERATORS ********************** */

/* ***** Utility functions to generate generic HTML elements ***** */

// clear out the main HTML element to make room for the next one
function clearMain() {
  while (mainEl.firstChild) {
    mainEl.removeChild(mainEl.firstChild);
  }
}

// function to generate a <div>
function generateMainContentDiv() {
  let divEl = document.createElement('div');
  divEl.setAttribute('class', 'main-content');
  return divEl;
}

// function to generate a back button
function generateBackButtonEl() {
  let buttonEl = document.createElement('button');
  buttonEl.setAttribute('id', 'back-button');
  buttonEl.textContent = 'Return to search';
  buttonEl.setAttribute('onclick', 'generateStartPage()');
  buttonEl.setAttribute('class', 'button is-danger is-outlined');
  let divEl = generateMainContentDiv();
  divEl.appendChild(buttonEl);
  return divEl;
}

// function to generate an h1 within a div
function generateHeadingDivEl(headerText, classes) {
  let headingEl = document.createElement('h1');
  headingEl.setAttribute('class', classes);
  let divEl = generateMainContentDiv();
  headingEl.textContent = headerText;
  divEl.appendChild(headingEl);
  return divEl;
}

// function to generate a <ul>
function generateListEl() {
  let unorderedListEl = document.createElement('ul');
  return unorderedListEl;
}

// function to generate an img within a div
function generateImageEl(recipes, index) {
  let imgEl = document.createElement('img');
  let divEl = generateMainContentDiv();
  imgEl.setAttribute('src', recipes[index].image);
  divEl.appendChild(imgEl);
  return divEl;
}

// function to generate a paragraph <p> within a div
function generateParagraphEl(recipes, index) {
  let paragraphEl = document.createElement('p');
  let divEl = generateMainContentDiv();
  paragraphEl.textContent = (recipes[i].title);
  divEl.appendChild(paragraphEl);
  return divEl;
}



/////////////////////////////////////////////////////
/***** Start Page Generator *****/
function generateStartPage(){
  clearMain();
 
  // generate the 3 div elements of this page
  let inputContainerDivEl = document.createElement('div');
  inputContainerDivEl.setAttribute('class', 'field has-addons has-addons-centered');
  let headingDivEl = generateHeadingDivEl("Recipedia", "title is-3 has-text-centered headin");
  let inputDivEl = generateInputDivEl();
  let submitButtonDivEl = generateSubmitButtonDivEl();
  clearMain();

  // append the 3 generated elements to the <main> element
  mainEl.appendChild(headingDivEl);
  inputContainerDivEl.appendChild(inputDivEl);
  inputContainerDivEl.appendChild(submitButtonDivEl);
  mainEl.appendChild(inputContainerDivEl);

  // create DOM element to reference the fetch/submit button we just added so it can be listened to
  fetchButtonEl = document.getElementById('fetch-button');

  //event listener for "fetch" button
  fetchButtonEl.addEventListener('click', function () {
    const inputEl = document.querySelector('#search-value');
    fetchButtonEl.classList.add('is-loading');
    searchCriteria = inputEl.value;
    fetchRecipes(inputEl.value);
  });
}

/* Start Page Element Generators */

// function to generate the main page input box
function generateInputDivEl() {
  let inputEl = document.createElement('input');
  let divEl = generateMainContentDiv();

  inputEl.setAttribute('placeholder', 'Search for Recipes');
  inputEl.setAttribute('class', 'input');
  inputEl.setAttribute('type', 'text');
  inputEl.setAttribute('id', 'search-value')
  divEl.setAttribute('class', 'control');
  divEl.appendChild(inputEl);

  return divEl;
}

// function to generate the fetch/submit button
function generateSubmitButtonDivEl() {
  let buttonEl = document.createElement('button');
  let divEl = generateMainContentDiv();

  divEl.setAttribute('class', 'control');
  buttonEl.setAttribute('class', 'button is-info');

  buttonEl.setAttribute('id', 'fetch-button');
  buttonEl.textContent = 'Submit';
  divEl.appendChild(buttonEl);

  return divEl;
}

// Generate Recipes List Function
function generateRecipesList(recipesList, isFromAPI) {
  let divContainerEl = document.createElement('div');
  let divHeaderEl = generateRecipesListHeadingDivEl();
  let backButtonEl = generateBackButtonEl();

  divContainerEl.classList.add('recipes-container');
  divContainerEl.appendChild(divHeaderEl);

  if(recipesList.length > 0 ){
    recipesList.forEach(recipe => {
      divContainerEl.appendChild(generateArticleItem(recipe, isFromAPI));
    })
    divContainerEl.appendChild(backButtonEl);

  } else {
    let emptyHeaderDivEl = document.createElement('div');
    let h5El = document.createElement('h5');

    h5El.setAttribute('class', 'title is-5');
    h5El.textContent = 'You do not have any recipes saved';
    emptyHeaderDivEl.setAttribute('id', 'shopping-list-header');
    emptyHeaderDivEl.appendChild(h5El);

    divContainerEl.appendChild(emptyHeaderDivEl);
  }
  clearMain();
  mainEl.appendChild(divContainerEl);
}

// Function to generate Recipes List Heading
function generateRecipesListHeadingDivEl() {
  let divEl = document.createElement('div');
  let headingEl = document.createElement('h3');

  divEl.classList.add('header');
  headingEl.setAttribute('class', 'title is-3');
  headingEl.textContent = 'Recipes List';

  divEl.appendChild(headingEl);

  return divEl;
}

// Generae Article Item Function
function generateArticleItem(recipe, isFromAPI) {
  let articleEl = document.createElement('article');
  let articleImageEl = generateArticleImage(recipe.image);
  let articleContentEl = generateArticleContent(recipe, isFromAPI);

  clearMain();
  articleEl.classList.add('media');
  articleEl.appendChild(articleImageEl);
  articleEl.appendChild(articleContentEl);

  return articleEl;
}

// Generate Article Image function
function generateArticleImage(image) {
  let figureEl = document.createElement('figure');
  let paragraphEl = document.createElement('p');
  let imgEl = document.createElement('img');

  imgEl.setAttribute('src', image);
  paragraphEl.setAttribute('class', 'image is-128x128');
  figureEl.setAttribute('class', 'media-left');

  paragraphEl.appendChild(imgEl);
  figureEl.appendChild(paragraphEl);

  return figureEl;
}

// Generate Article Content Function
function generateArticleContent(recipe, isFromAPI) {
  let divMediaConentEl = document.createElement('div');
  let divContentEl = document.createElement('div');
  let paragraphEl = document.createElement('p');
  let boldTitleEl = document.createElement('strong');
  let breakEl = document.createElement('br');
  let divButtonsEl = document.createElement('div');
  let saveButtonEl = document.createElement('button');
  let viewButtonEl = document.createElement('button');

  divMediaConentEl.classList.add('media-content');
  divContentEl.classList.add('content');
  boldTitleEl.textContent = recipe.title;

  divButtonsEl.classList.add('buttons');
  if (isFromAPI) {
    saveButtonEl.setAttribute('class', 'button is-primary');
    saveButtonEl.textContent = 'Save';
    saveButtonEl.addEventListener('click', function () {
      saveButtonEl.setAttribute('disabled', '');
      saveRecipe(recipe.title, recipe.image, recipe.id);
    });
  } else {
    saveButtonEl.setAttribute('class', 'button is-danger');
    saveButtonEl.textContent = 'Remove';
    saveButtonEl.addEventListener('click', function () {
      removeRecipe(recipe.id);
      var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
      generateRecipesList(savedRecipes);
    });
  }

  viewButtonEl.setAttribute('class', 'button is-link');
  viewButtonEl.textContent = 'View';
  viewButtonEl.addEventListener('click', function () {
    viewButtonEl.classList.add('is-loading');
    fetchIngredients(recipe, recipe.id);
  })

  divButtonsEl.appendChild(viewButtonEl);
  divButtonsEl.appendChild(saveButtonEl);

  paragraphEl.appendChild(boldTitleEl);
  paragraphEl.appendChild(breakEl);
  paragraphEl.appendChild(divButtonsEl);

  divContentEl.appendChild(paragraphEl);

  divMediaConentEl.appendChild(divContentEl);

  return divMediaConentEl;
}

// Save Recipe Function
function saveRecipe(recipeName, recipeImg, recipeId) {
  //create var for savedRecipes
  var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  //initalize the var with savedRecipes from localStorage if it exists, if not intialize to empty array
  if (!savedRecipes) {
    savedRecipes = [];
  }
  //push recipedId to savedRecipes
  if (savedRecipes.filter(recipe => recipe.id === recipeId).length === 0) {

    savedRecipes.push({
      id: recipeId,
      title: recipeName,
      image: recipeImg
    });
  }

  //update/set localStorage.savedRecipes with var savedRecipes
  localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));
}

// Check a checkbox function
function checked(event) {
  let checkbox = event.target;

  if (checkbox.checked) {
    addToShoppingList(checkbox.dataset.ingredient);

  } else {
    removeFromShoppingList(checkbox.dataset.ingredient);
  }

  toggleAddToShoppingListButton();
}

// Add To Shopping List Function
function addToShoppingList(ingredient) {
  if (!checkedItems.includes(ingredient)) {
    checkedItems.push(ingredient);
  }
}

// Remove from Shopping List Function
function removeFromShoppingList(ingredient) {
  var index = checkedItems.indexOf(ingredient);
  if (index !== -1) {
    checkedItems.splice(index, 1);
  }
}

// Toggle Shopping List Button Function
function toggleAddToShoppingListButton() {
  const addButtonEl = document.querySelector('#add-button');

  if (checkedItems.length > 0) {
    addButtonEl.removeAttribute('disabled');

  } else {
    addButtonEl.setAttribute('disabled', '');
  }
}

// Generate Shopping List Function
function generateShoppingList() {
  var shoppingList = JSON.parse(localStorage.getItem('shoppingList')) || [];
  checkedItems.forEach(item => {
    if (!shoppingList.includes(item)) {
      shoppingList.push(item);
    }
  })
  checkedItems = [];
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  generateIngredientListPage();
}

// Remove Recipe Function
function removeRecipe(recipeId) {
  //create var for savedRecipes
  var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  //initalize the var with savedRecipes from localStorage if it exists, if not intialize to empty array
  var updatedRecipes = savedRecipes.filter(recipe => recipe.id !== recipeId);
  //update/set localStorage.savedRecipes with var savedRecipes
  localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
}

// Generate Recipes Page Function
function generateRecipePage(recipe, recipeDetails) {
  let headerSectionEl = generateHeaderSection(recipe.title);
  let imgAndIngredientsSectionEl = generateImgAndIngredientsSectionEl(recipe, recipeDetails.extendedIngredients, recipeDetails.nutrition);
  let recipeInstructionSectionEl = generateRecipeInstructionsSectionEl(recipeDetails.summary);

  clearMain()
  mainEl.appendChild(headerSectionEl);
  mainEl.appendChild(imgAndIngredientsSectionEl);
  mainEl.appendChild(recipeInstructionSectionEl);
}

// Generate Header Section Function
function generateHeaderSection(recipeName) {
  let sectionEl = document.createElement('section');
  let titleDivEl = document.createElement('div');
  let h3El = document.createElement('h3');
  let buttonDivEl = generateHeaderButtonsDivEl();

  titleDivEl.setAttribute('id', 'recipe-header');
  h3El.setAttribute('class', 'title is-3');
  h3El.textContent = recipeName;
  titleDivEl.appendChild(h3El);

  sectionEl.setAttribute('class', 'is-flex is-flex-wrap-nowrap is-justify-content-space-between')
  sectionEl.appendChild(titleDivEl);
  sectionEl.appendChild(buttonDivEl);

  return sectionEl;
}

// Generate Image and Ingredients Section Function
function generateImgAndIngredientsSectionEl(recipe, ingredients, nutrition) {
  let sectionEl = document.createElement('section');
  let imgDiv = document.createElement('div');
  let imgEl = document.createElement('img');
  let chartEl = document.createElement('img');
  let recipeListDiv = document.createElement('div');
  let proteins = nutrition.caloricBreakdown.percentProtein;
  let fats = nutrition.caloricBreakdown.percentFat;
  let carbs = nutrition.caloricBreakdown.percentCarbs;
  let chartApiUrl = `https://image-charts.com/chart?chl=Protein|Fats|Carbs&chco=95CB59%7CEC4545%7C4464AC&chd=t%3A${proteins}%2C${fats}%2C${carbs}&chs=312x231&cht=p3`

  sectionEl.setAttribute('class', 'is-flex is-flex-wrap-nowrap is-justify-content-space-between');

  imgDiv.setAttribute('id', 'recipe-img');
  imgEl.setAttribute('src', recipe.image);
  chartEl.setAttribute('src', chartApiUrl);
  imgDiv.appendChild(imgEl);
  imgDiv.appendChild(chartEl);

  recipeListDiv.setAttribute('id', 'recipe-list');
  ingredients.forEach(ingredient => {
  recipeListDiv.appendChild(generateIngredientListEl(ingredient));
  })

  sectionEl.appendChild(imgDiv);
  sectionEl.appendChild(recipeListDiv);

  return sectionEl;
}

// Generate Ingrediens List Function
function generateIngredientListEl(ingredient) {
  let articleEl = document.createElement('article');
  let mediaContentDivEl = document.createElement('div');
  let contentDivEl = document.createElement('div');
  let labelEl = document.createElement('label');
  let checkboxEl = document.createElement('input');
  let ingredientEl = document.createElement('strong');

  ingredientEl.textContent = '  ' + ingredient.originalString;
  checkboxEl.setAttribute('type', 'checkbox');
  checkboxEl.addEventListener('change', checked);
  checkboxEl.setAttribute('data-ingredient', ingredient.name);
  labelEl.appendChild(checkboxEl);
  labelEl.appendChild(ingredientEl);
  labelEl.setAttribute('class', 'checkbox');
  contentDivEl.appendChild(labelEl);
  contentDivEl.setAttribute('class', 'content');
  mediaContentDivEl.appendChild(contentDivEl);
  mediaContentDivEl.setAttribute('class', 'media-content');
  articleEl.appendChild(mediaContentDivEl);
  articleEl.setAttribute('class', 'media');

  return articleEl;
}

// Generate Header Buttons Div Function
function generateHeaderButtonsDivEl() {
  let divEl = document.createElement('div');
  let addButtonEl = document.createElement('button');
  let backButtonEl = document.createElement('button');

  divEl.setAttribute('id', 'recipe-buttons');
  divEl.setAttribute('class', 'buttons is-flex is-flex-wrap-nowrap is-justify-content-end');

  addButtonEl.setAttribute('id', 'add-button');
  addButtonEl.setAttribute('class', 'button is-small is-success');
  addButtonEl.setAttribute('disabled', '');
  addButtonEl.addEventListener('click', generateShoppingList);
  addButtonEl.textContent = 'Add items to Shopping List';

  backButtonEl.setAttribute('id', 'back-button');
  backButtonEl.setAttribute('class', 'button is-small is-danger is-outlined');
  backButtonEl.addEventListener('click', function () {
    backButtonEl.classList.add('is-loading');
    fetchRecipes(searchCriteria);

  })
  backButtonEl.textContent = 'Return to Recipes';

  divEl.appendChild(addButtonEl);
  divEl.appendChild(backButtonEl);

  return divEl;
}

// Generate Recipe List Instructions Function
function generateRecipeInstructionsSectionEl(recipeInstruction) {
  let sectionEl = document.createElement('section');
  let headingDivEl = document.createElement('div');
  let h4El = document.createElement('h4');
  let instructionsDivEl = document.createElement('div');

  instructionsDivEl.setAttribute('class', 'block');
  instructionsDivEl.setAttribute('id', 'recipe-instructions');
  instructionsDivEl.innerHTML = recipeInstruction;

  h4El.setAttribute('class', 'title is-5');
  h4El.textContent = 'Recipe Instructions';

  headingDivEl.setAttribute('class', 'headin');
  headingDivEl.setAttribute('id', 'instruction-heading');
  headingDivEl.appendChild(h4El);

  sectionEl.setAttribute('id', 'recipe-instructions');
  sectionEl.appendChild(headingDivEl);
  sectionEl.appendChild(instructionsDivEl);

  return sectionEl;
}

// Remove Ingredients Function
function removeIngredient(event) {
  let ingredient = event.target.dataset.ingredient;
  let shoppingList = JSON.parse(localStorage.getItem("shoppingList"));
  var index = shoppingList.indexOf(ingredient);
  if (index !== -1) {
    shoppingList.splice(index, 1);
  } 
  localStorage.setItem('shoppingList', JSON.stringify(shoppingList));
  generateIngredientListPage();
}

// Generate Ingredients List Function
function generateIngredientListPage() {
  let listDivEl = document.createElement('div');
  let shoppingList = JSON.parse(localStorage.getItem("shoppingList")) || [];
  let headerDivEl = document.createElement('div');
  let h3El = document.createElement('h3');

  h3El.setAttribute('class', 'title is-3');
  h3El.textContent = 'Shopping List';
  headerDivEl.setAttribute('id', 'shopping-list-header');
  headerDivEl.appendChild(h3El);
  clearMain();
  listDivEl.setAttribute('id', 'ingredient-list');
  listDivEl.appendChild(headerDivEl);
  if (shoppingList.length > 0) {
    shoppingList.forEach(ingredient => {
      listDivEl.appendChild(generateIngredient(ingredient));
    })
  } else {
    let emptyHeaderDivEl = document.createElement('div');
    let h5El = document.createElement('h5');

    h5El.setAttribute('class', 'title is-5');
    h5El.textContent = 'You do not have any ingredients saved';
    emptyHeaderDivEl.setAttribute('id', 'shopping-list-header');
    emptyHeaderDivEl.appendChild(h5El);

    listDivEl.appendChild(emptyHeaderDivEl);
  }

  mainEl.appendChild(listDivEl);
}

// Generae Ingredients Function
function generateIngredient(ingredient) {
  let articleEl = document.createElement('article');
  let mediaContentDivEl = document.createElement('div');
  let contentDivEl = document.createElement('div');
  let ingredientEl = document.createElement('strong');
  let deleteButtonEl = document.createElement('button');

  articleEl.classList.add('media');
  mediaContentDivEl.classList.add('media-content');
  contentDivEl.classList.add('content');
  contentDivEl.setAttribute('id', 'ingredient-row');
  ingredientEl.textContent = ingredient;
  deleteButtonEl.classList.add('delete');
  deleteButtonEl.setAttribute('data-ingredient', ingredient);
  deleteButtonEl.setAttribute('id', 'delete-button');
  deleteButtonEl.addEventListener('click', removeIngredient);

  contentDivEl.appendChild(ingredientEl);
  mediaContentDivEl.appendChild(contentDivEl);
  articleEl.appendChild(mediaContentDivEl);
  articleEl.appendChild(deleteButtonEl);
  return articleEl;
}

generateStartPage();


