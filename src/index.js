import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import {fetchCountries} from "./fetchCountries.js"
const DEBOUNCE_DELAY = 300;
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');
// function fetchCountries(name) {
//   return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
//     .then(response => {
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       return response.json();
//     })
//     .then(data => {
//       return data;
//     })
//     .catch(error => {
//       console.error(error);
//       throw error;
//     });
// }

function renderCountriesList(countries) {
    info.innerHTML = '';
  list.innerHTML = '';
  countries.forEach(country => {
    const item = document.createElement('li');
    console.log(country);
    const flag = document.createElement('img');
    flag.src = country.flags.svg;
    flag.alt = country.name.official;
    const name = document.createElement('span');
    name.textContent = country.name.official;
    item.append(flag, name);
    list.append(item);
  });
}

function renderCountryInfo(country) {
    list.innerHTML = ''
  
  info.innerHTML = '';
  const flag = document.createElement('img');
  flag.src = country.flags.svg;
  flag.alt = country.name.official;
  const name = document.createElement('h2');
  name.textContent = country.name.official;
  const capital = document.createElement('p');
  capital.textContent = `Capital: ${country.capital}`;
  const population = document.createElement('p');
  population.textContent = `Population: ${country.population}`;
  const languages = document.createElement('ul');
  Object.values(country.languages).forEach(lang => {
    const item = document.createElement('li');
    item.textContent = lang;
    languages.append(item);
  });
  info.append(flag, name, capital, population, languages);

}

function showTooManyMatchesAlert() {
  Notiflix.Notify.warning('Too many matches found. Please enter a more specific name.');
}

const input = document.querySelector('#search-box');
input.addEventListener('input', debounce(() => {
  const query = input.value.trim();
  if (!query) {
    return;
  }
    fetchCountries(query)
    .then(countries => {
      if (countries.length > 10) {
        showTooManyMatchesAlert();
        return;
      }
      if (countries.length > 1) {
        renderCountriesList(countries);
        return;
      }
      if (countries.length === 1){
        renderCountryInfo(countries[0])
      }
      
    })
    .catch(error => Notiflix.Notify.failure("Ops, there is no country with that name"))
}, DEBOUNCE_DELAY));
