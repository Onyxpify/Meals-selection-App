import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AppContext = React.createContext()

const allMealsUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
const randomMealUrl = 'https://www.themealdb.com/api/json/v1/1/random.php'

const getFavoritesFromLocalStorage = () => {
  let favorites = localStorage.getItem('favorites');

  if(favorites) {
    favorites = JSON.parse(favorites)
  }
  else{
    favorites = []
  }
  return favorites
}

const AppProvider = ({ children }) => {
   const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('') //for your search result to display
   
   const [showModal, setModal] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [favorites, setFavorites] = useState(getFavoritesFromLocalStorage())
  
  const fetchMeals = async (url) => {
    setLoading(true)
    try {
      const { data } = await axios.get(url)
      if (data.meals){
        setMeals(data.meals)
      }
      else {
        setMeals([])
      }
      console.log(data)
    } catch (error) {
      console.log(error.response)
    }
    setLoading(false)
  }
  const fetchRandomMeal = () => {
    fetchMeals(randomMealUrl)
  }

  const selectMeal = (idMeal, favoriteMeal) => {
    let meal;
    if(favoriteMeal){
      meal = favorites.find((meal) => meal.idMeal === idMeal)
    }
   else{
      meal = meals.find((meal) => meal.idMeal === idMeal)
   }
    setSelectedMeal(meal)
    setModal(true)
  }
  const closeModal = () => {
    setModal(false)
  }
  const addToFavorites = (idMeal) => {
    const alreadyFavorites = favorites.find((meal) => meal.idMeal === idMeal)
    if (alreadyFavorites) return
    const meal = meals.find((meal) => meal.idMeal === idMeal)
    const updatedFavorites = [...favorites, meal]
    setFavorites(updatedFavorites)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }

  const removeFromFavorites = (idMeal) => {
    const updatedFavorites = favorites.filter((meal) => meal.idMeal !== idMeal)
    setFavorites(updatedFavorites)
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites))
  }
  useEffect(() => {
    fetchMeals(allMealsUrl)
  }, [])
  
  useEffect(() => {
    if (!searchTerm) return
//for your search result to display
    fetchMeals(`${allMealsUrl}${searchTerm}`) 
  }, [searchTerm])
  
  return (
    <AppContext.Provider value={{
      loading, 
      meals, 
      setSearchTerm, 
      fetchRandomMeal, 
      showModal, 
      selectedMeal, 
      selectMeal, 
      closeModal, 
      favorites,
      addToFavorites, 
      removeFromFavorites 
    }}>
    {children}
  </AppContext.Provider>
    )
}
export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }