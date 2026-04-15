import React from 'react'
import { useCreateCategoriesMutation } from './services/api'
import { useEffect } from 'react';

function App() {
  const [createCategories,{data,isLoading,error}] = useCreateCategoriesMutation()

//   useEffect(() => {
//   fetch("http://localhost:8000/api/categories/createCategories", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ 
//       categories_name:'battery',
//       subCategories:"inverter battery" 
//     }),
//   })
//   .then(res => res.json())
//   .then(data => console.log(data))
//   .catch(err => console.error(err));
// }, []);
  
  const handleCreateCategories = async() => {
    try {
      const res = createCategories({
        categories_name:'battery',
        subCategories:["inverter battery","lithium battery"]
      }).unwrap 
      // console.log("res aftetr crating categories", res) 
      console.log("res data after creatring categories",data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <button onClick={() => {handleCreateCategories()}}>
        Press Me
      </button>
    </div>
  )
}

export default App