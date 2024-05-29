// eslint-disable-next-line no-unused-vars
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import Graph from './components/graph/Graph.jsx';
import {DarkModeProvider} from "./components/context/DarkModeContext";

function App() {
    return (
        <DarkModeProvider>
            <Router>
                <Routes>
                    <Route path="/graph" element={<Graph/>}/>
                    <Route path="/" element={<Home/>}/>
                </Routes>
            </Router>
        </DarkModeProvider>
    );
}

export default App;