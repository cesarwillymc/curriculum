import './global.css'
import React from 'react'; // Add this import
import './App.css';
import SidebarWithData from './pages/component/SidebarWithData';
import Page from './pages/page'; // Import the new Page component

function App() {
  return (
    <div className="App">
      <div className='flex flex-col sm:flex-row'>
        {/* Sidebar with dynamic data */}
        <SidebarWithData />

        {/* Main content area */}
        <main className='grow-full p-8 sm:p-16 w-full sm:basis-2/3 ml-auto'>
          {/* Rendering the Page component */}
          <Page />
        </main>
      </div>
    </div>
  );
}

export default App;