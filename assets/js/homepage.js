const RECIPE_API_KEY = '2a01944c5fed405ca014665c339e93c3';
const spoonacularBaseUrl = 'https://api.spoonacular.com';
//const fetchButtonEl = document.querySelector('#fetch-button');

// DOM element for the <main> HTML element
var  mainEl = document.querySelector('main');

// DOM elements for the various pages we'll make
var homepageEl;
var recipesListEl;
var ingredientsInstructionsEl;
var shoppingListEl;


function fetchRecipes(){
  const apiUrl = `${spoonacularBaseUrl}/recipes/complexSearch?&apiKey=${RECIPE_API_KEY}&${getQueryParams(true, true)}`;
  let recipes; 

  fetch(apiUrl).then(response => {
    if (response.ok){
      response.json().then(data => {
        recipes = data.results;
        console.log('Recipes:', recipes);
        fetchIngredients(recipes[0].id)
      });
    } else {
      handleError();
    }
  }).catch(handleError);

  // bring up the recipe list page
  generateRecipeListPage();
}

function fetchIngredients(recipeId){
  const apiUrl = `${spoonacularBaseUrl}/recipes/${recipeId}/information?apiKey=${RECIPE_API_KEY}&includeNutrition=true`;

  fetch(apiUrl).then(response => {
    if (response.ok){
      response.json().then(data => {
        console.log('Ingredients', data.extendedIngredients);
      })
    }
  })
}

function getQueryParams(useDiet, useQuery){
  let httpParams = '';
  let dietParam = 'vegan';
  let queryParam = 'pasta';

  if (useDiet){
    httpParams += `&diet=${dietParam}`;
  }

  if (useQuery){
    httpParams += `&query=${queryParam}`;
  }

  return httpParams;
}

function handleError(){
  alert('Error occured with spoonacular API call');
}

/* ********************** HTML GENERATORS ********************** */

/* ***** Utility functions to generate generic HTML elements ***** */

// clear out the main HTML element to make room for the next one
function clearMain(){
  while(mainEl.firstChild){
      mainEl.removeChild(mainEl.firstChild);
  }
}

// function to generate a <div>
function generateMainContentDiv(){
  let divEl = document.createElement('div');
  divEl.setAttribute('class', 'main-content');

  return divEl;
}

// function to generate an h1 within a div
function generateHeadingDivEl(headerText){
  let headingEl = document.createElement('h1');
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
function generateImageEl(i) {
  let imgEl = document.createElement('img');
  let divEl = generateMainContentDiv();

  imgEl.setAttribute('src', 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTD1kMb0H58I45e9dgLJqEsU7Nc3W1SwoWtpQ&usqp=CAU');

  divEl.appendChild(imgEl);

  return divEl;
}

// function to generate a paragraph <p> within a div
function generateParagraphEl(i) {
  let paragraphEl = document.createElement('p');
  let divEl = generateMainContentDiv();

  paragraphEl.textContent = "Recipe name placeholder"
  //name = "";
  //console.log("recipes[i].title");
  //paragraphEl.textContent = name;
  divEl.appendChild(paragraphEl);

  return divEl;
}



/////////////////////////////////////////////////////
/***** Start Page Generator *****/
function generateStartPage(){
  // generate the 3 div elements of this page
  let headingDivEl = generateHeadingDivEl("Recipedia");
  let inputDivEl = generateInputDivEl();
  let submitButtonDivEl = generateSubmitButtonDivEl();

  // append the 3 generated elements to the <main> element
  mainEl.appendChild(headingDivEl);
  mainEl.appendChild(inputDivEl);
  mainEl.appendChild(submitButtonDivEl);

  // create DOM element to reference the fetch/submit button we just added so it can be listened to
  fetchButtonEl = document.getElementById('fetch-button');

  //event listener for "fetch" button
  fetchButtonEl.addEventListener('click', fetchRecipes);
}

/* Start Page Element Generators */

// function to generate the main page input box
function generateInputDivEl() {
    let inputEl = document.createElement('input');
    let divEl = generateMainContentDiv();

    inputEl.setAttribute('placeholder', 'Search for Recipes');
    divEl.appendChild(inputEl);

    return divEl;
}

// function to generate the fetch/submit button
function generateSubmitButtonDivEl() {
    let buttonEl = document.createElement('button');
    let divEl = generateMainContentDiv();

    buttonEl.setAttribute('id', 'fetch-button');
    buttonEl.textContent = 'Submit';
    divEl.appendChild(buttonEl);

    return divEl;
}


//////////////////////////////////////////////////////////////
/*****  Recipe List Page Generator *****/
function generateRecipeListPage(){
  // clear main element of previous HTML
  clearMain();

  // generate the <h1> and <ul> elements of this page
  let headingDivEl = generateHeadingDivEl("Recipes");
  let recipeListDivEl = generateRecipelistDivEl();
  
  // append the generated elements to the <main> element
  mainEl.appendChild(headingDivEl);
  mainEl.appendChild(recipeListDivEl);
}

// function to generate the recipe list
function generateRecipelistDivEl() {
  let listEl = generateListEl();

  // add for loop logic to show top 10 recipe list items
  for (i = 0; i < 10; i++) {
    // call function to make a list item with 3 divs
    let listItemEl = generateRecipeListItem(i);
    // assign picture, name  and ingredient anchor to each
      // the 3 below items are pseudocode
        //listItemEl.img = recipes.image[i];
        //listItemEl.p = recipes.title[i];
        //listItemEl.img = recipes.image[i];
    // append to list
    listEl.appendChild(listItemEl);
  }
  return listEl;
}

// function to generate recipe list item
function generateRecipeListItem(recipe) {
  let listItemEl = document.createElement('li');

  // make DOM elements for the img, p and a (all within divs)
  let imageEl = generateImageEl(recipe);
  let recipeTitleEl = generateParagraphEl(recipe);

  // append elements to the list item
  listItemEl.appendChild(imageEl);
  listItemEl.appendChild(recipeTitleEl);

  return listItemEl;
}


//generateStartPage();