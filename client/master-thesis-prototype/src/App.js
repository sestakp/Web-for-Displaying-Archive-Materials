import React from 'react';
import './App.css';
import Prototype3 from './pages/prototype3/prototype3';

// theme
import 'primereact/resources/themes/lara-light-indigo/theme.css';

// core
import 'primereact/resources/primereact.min.css';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; // theme
import 'primereact/resources/primereact.min.css'; // core css
import 'primeicons/primeicons.css'; // icons

/**
 * The main application component.
 *
 * @return {JSX.Element} The rendered application content.
 */
function App() {
  console.log('app rerender');


  return (
    <Prototype3 />
  );
}

export default App;
