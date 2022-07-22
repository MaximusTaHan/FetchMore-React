import React, { useState, useEffect } from 'react';
import './App.css';

function DogsHeaders () {
  return (
    <tr>
      <th>Breed</th>
      <th>Size</th>
      <th>Picture</th>
    </tr>
  )
}

function DogRow(props) {
    const dog = props.dog;
    return (
      <tr>
        <td>
            <button onClick={() => props.getClickedId(dog.id)}>{dog.breed}</button>
        </td>
        <td>{dog.size}</td>
        <td>
          <img src={dog.imgUrl} alt="Dog breed img"/>
        </td>
      </tr>
    )
}

function DogsTable () {
  const [clickedId, getClickedId] = useState(0);
  const [detailedDog, getDetailedDog] = useState({});
  const [dogs, getDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(clickedId !== 0) {
      fetch('https://localhost:7224/api/Dogs/' + clickedId,
        {
          method: 'GET',
          mode: 'cors',
          headers: { 'Content-type': 'application/x-www-form-urlencoded'},
        }
      )
      .then(response => response.json())
      .then(data => {
        getDetailedDog(data)
      });
    }
  }, [clickedId]);

  useEffect(() => {
    const fetchDogs = async() => {
      const data = await fetch(
        'https://localhost:7224/api/Dogs',
        {
          method: 'GET',
          mode: 'cors',
          headers: { 'Content-type': 'application/x-www-form-urlencoded'},
        }
      )
      
      const test = await data.json();
      setIsLoading(false);
      getDogs(test);
    }

    fetchDogs()
    .catch(e => {
      setIsLoading(false);
      setError(e.message);
    });
  }, []);

  const rows = [];

  dogs.forEach((dog) => {
    rows.push(
      <DogRow key={dog.id}
        dog={dog}
        getClickedId={getClickedId}
      />
    );
  });
  
  if(clickedId !== 0) {
    return (
      <div className="detailed-table">
        <table>
          <tbody>
            <tr>
              <td>{detailedDog.description}</td>
            </tr>
          </tbody>
        </table>
        <button onClick={() => getClickedId(0)}>
          Return
        </button>
      </div>

    );
  }
  return (
    <div className="DogsTable">
      { isLoading && <div>Loading...</div>}
      { dogs.length > 0 && 
      <table>
        <thead>
          <DogsHeaders />
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
      }
      { error && <div>{error}</div>}
    </div>
  )

}

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <p>
          There will be dogs here
        </p>
      </header>

      <DogsTable />
    </div>
  );
}

export default App;
