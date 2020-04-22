import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route } from 'react-router-dom';
import MainPage from "./components/MainPage";
import {EnterRoom} from "./components/EnterRoom";

const App = () => {
    return (
        <HashRouter>
            <React.Fragment>
                <Route path="/" exact component={EnterRoom}/>
                <Route path="/:roomId" exact component={MainPage}/>
            </React.Fragment>
        </HashRouter>
    )
};

ReactDOM.render(<App />, document.getElementById('root'));
