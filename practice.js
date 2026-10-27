import { useState } from 'react'

const [ contact, setContact ] = useState([
    {id: 1, name: "Al Leoncio", age: 23},
    {id: 2, name: "Aly Leoncio", age: 31}
]);

function addAge(id) {
    const updatedAge = contact.map(nextAge => {
        if (nextAge.id == id) {
            return { ...nextAge, age: }
        }
    })
}



export default App