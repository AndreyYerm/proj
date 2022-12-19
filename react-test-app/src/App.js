import React from "react";
import GroceryList from "./elems/GroceryList";

function App() {


  return (
    <div style={{position: 'absolute', width: '100%', height: '100%', left: '0', top: '0', 
    display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <GroceryList/>
    </div>
  );
}

export default App;
