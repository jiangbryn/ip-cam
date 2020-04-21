import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import MainPage from "./components/MainPage";

const App = () => {
    return (
        <BrowserRouter>
            <React.Fragment>
                <Route path="/:roomId" exact component={MainPage}/>
            </React.Fragment>
        </BrowserRouter>
    )
};

ReactDOM.render(<App />, document.getElementById('root'));
