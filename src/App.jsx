// eslint-disable-next-line no-unused-vars
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import Graph from './components/graph/Graph.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/graph" element={<Graph/>}/>
                <Route path="/" element={<Home/>}/>
            </Routes>
        </Router>
    );
}

export default App;