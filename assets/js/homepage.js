const RECIPE_API_KEY = '2a01944c5fed405ca014665c339e93c3';
const spoonacularBaseUrl = 'https://api.spoonacular.com';
const fetchButtonEl = document.querySelector('#fetch-button');

fetchButtonEl.addEventListener('click', fetchRecipes);

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