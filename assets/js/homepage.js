const RECIPE_API_KEY = '2a01944c5fed405ca014665c339e93c3';
const spoonacularBaseUrl = 'https://api.spoonacular.com';
//const fetchButtonEl = document.querySelector('#fetch-button');

// DOM element for the <main> HTML element
var  mainEl = document.querySelector('main');
var recipeListLink= document.querySelector('#recipe-list-link');
recipeListLink.addEventListener('click', function(){
  var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"))||[];
  console.log('savedRecipes',savedRecipes)
  generateRecipesList(savedRecipes,false);
}) 
// DOM elements for the various pages we'll make
var homepageEl;
var recipesListEl;
var ingredientsInstructionsEl;
var shoppingListEl;


function fetchRecipes(searchValue){

  const apiUrl = `${spoonacularBaseUrl}/recipes/complexSearch?&apiKey=${RECIPE_API_KEY}&${getQueryParams(searchValue)}`;
  let recipes; 

  fetch(apiUrl).then(response => {
    if (response.ok){
      response.json().then(data => {
        recipes = data.results;
        console.log('Recipes:', recipes);
        // bring up the recipe list page
        generateRecipesList(recipes,true);
      });
    } else {
      handleError();
    }
  }).catch(handleError);

  
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

function getQueryParams(queryParam){
  let httpParams = '';

  if (queryParam){
    httpParams += `&query=${queryParam}`;
  }

  return httpParams;
}

function handleError(){
  alert('Error occured with spoonacular API call');
}

//* ********************** HTML GENERATORS ********************** */

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

// function to generate a back button
function generateBackButtonEl() {
  let buttonEl = document.createElement('button');
  buttonEl.setAttribute('id', 'back-button');
  buttonEl.textContent = 'Back';
  buttonEl.setAttribute('onclick', 'generateStartPage()');
  buttonEl.setAttribute('class', 'button is-info');
  
  let divEl = generateMainContentDiv();

  
  divEl.appendChild(buttonEl);

  return divEl;
}

// function to generate an h1 within a div
function generateHeadingDivEl(headerText, classes){
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

  imgEl.setAttribute('src',recipes[index].image);

  divEl.appendChild(imgEl);

  return divEl;
}

// function to generate a paragraph <p> within a div
function generateParagraphEl(recipes, index) {
  let paragraphEl = document.createElement('p');
  let divEl = generateMainContentDiv();

  paragraphEl.textContent=(recipes[i].title);

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

  

  // append the 3 generated elements to the <main> element
  mainEl.appendChild(headingDivEl);
  inputContainerDivEl.appendChild(inputDivEl);
  inputContainerDivEl.appendChild(submitButtonDivEl);
  mainEl.appendChild(inputContainerDivEl);

  // create DOM element to reference the fetch/submit button we just added so it can be listened to
  fetchButtonEl = document.getElementById('fetch-button');

  //event listener for "fetch" button
  fetchButtonEl.addEventListener('click', function() {
    const inputEl = document.querySelector('#search-value');
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
    divEl.setAttribute('class','control');
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

/* *************GENERATE RECIPES LIST************* */
function generateRecipesList(recipesList,isFromAPI) {
  let divContainerEl = document.createElement('div');
  let divHeaderEl = generateRecipesListHeadingDivEl();
  let backButtonEl = generateBackButtonEl();

  divContainerEl.classList.add('recipes-container');
  divContainerEl.appendChild(divHeaderEl);

  recipesList.forEach(recipe => {
      divContainerEl.appendChild(generateArticleItem(recipe,isFromAPI));
  })
  divContainerEl.appendChild(backButtonEl);
clearMain();
  mainEl.appendChild(divContainerEl);
}

function generateRecipesListHeadingDivEl() {
  let divEl = document.createElement('div');
  let headingEl = document.createElement('h2');

  divEl.classList.add('header');
  headingEl.setAttribute('class', 'title is-2' );
  headingEl.textContent = 'Recipes List';

  divEl.appendChild(headingEl);
  
  return divEl;

}

function generateArticleItem(recipe,isFromAPI) {  
  let articleEl = document.createElement('article');
  let articleImageEl = generateArticleImage(recipe.image);
  let articleContentEl = generateArticleContent(recipe,isFromAPI);

  clearMain();
  articleEl.classList.add('media');
  articleEl.appendChild(articleImageEl);
  articleEl.appendChild(articleContentEl);

  return articleEl;

}

function generateArticleImage(image) {
  let figureEl  = document.createElement('figure');
  let paragraphEl = document.createElement('p');
  let imgEl = document.createElement('img');


  console.log('image:', image)
  imgEl.setAttribute('src', image);
  paragraphEl.setAttribute('class', 'image is-128x128');
  figureEl.setAttribute('class', 'media-left');

  paragraphEl.appendChild(imgEl);
  figureEl.appendChild(paragraphEl);

  return figureEl;
}

function generateArticleContent(recipe,isFromAPI) {
  let divMediaConentEl = document.createElement('div');
  let divContentEl = document.createElement('div');
  let paragraphEl = document.createElement('p');
  let boldTitleEl = document.createElement('strong');
  let breakEl = document.createElement('br');
  let divButtonsEl = document.createElement('div');
  let saveButtonEl = document.createElement('button');
  let viewButtonEl = document.createElement('button');


  divMediaConentEl.classList.add('media-content') ;
  divContentEl.classList.add('content');
  boldTitleEl.textContent = recipe.title;

  divButtonsEl.classList.add('buttons');
  if(isFromAPI) {
  saveButtonEl.setAttribute('class', 'button is-primary');
  saveButtonEl.textContent= 'Save';
  saveButtonEl.addEventListener('click', function(){
    saveRecipe(recipe.title,recipe.image,recipe.id);
} );
  } else{
  saveButtonEl.setAttribute('class', 'button is-danger');
  saveButtonEl.textContent= 'Remove';
  saveButtonEl.addEventListener('click', function(){
    removeRecipe(recipe.id);
    var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
    generateRecipesList(savedRecipes); 
} );
  }
  

  viewButtonEl.setAttribute('class', 'button is-link');
  viewButtonEl.textContent = 'View';
  viewButtonEl.addEventListener('click', function(){
    fetchIngredients(recipe.id);
  })

  divButtonsEl.appendChild(saveButtonEl);
  divButtonsEl.appendChild(viewButtonEl);

  paragraphEl.appendChild(boldTitleEl);
  paragraphEl.appendChild(breakEl);
  paragraphEl.appendChild(divButtonsEl);

  divContentEl.appendChild(paragraphEl);

  divMediaConentEl.appendChild(divContentEl);

  return divMediaConentEl;


}

function saveRecipe(recipeName,recipeImg, recipeId) {
  //create var for savedRecipes
  var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  console.log("savedRecipes contains " + savedRecipes);
  //initalize the var with savedRecipes from localStorage if it exists, if not intialize to empty array
  if(!savedRecipes) {
    console.log("savedRecipes was empty");
    savedRecipes = [];
  }
  //push recipedId to savedRecipes
  console.log(recipeId);
  if (savedRecipes.filter(recipe => recipe.id === recipeId).length === 0) {
  
    savedRecipes.push({ 
      id: recipeId,
      title: recipeName, 
      image: recipeImg
  
    });
  }
  
  console.log("now savedRecipes looks like this: " + savedRecipes);
  //update/set localStorage.savedRecipes with var savedRecipes
  localStorage.setItem("savedRecipes", JSON.stringify(savedRecipes));

}
function removeRecipe(recipeId) {
  //create var for savedRecipes
  var savedRecipes = JSON.parse(localStorage.getItem("savedRecipes"));
  console.log("savedRecipes contains " + savedRecipes);
  //initalize the var with savedRecipes from localStorage if it exists, if not intialize to empty array
  var updatedRecipes = savedRecipes.filter(recipe =>recipe.id!== recipeId);
console.log("now savedRecipes looks like this: " + updatedRecipes);
  //update/set localStorage.savedRecipes with var savedRecipes
  localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));

}
generateStartPage();


