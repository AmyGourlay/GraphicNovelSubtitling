import React, { useEffect, useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Result from './Result';
import Upload from './Upload';
import Nav from './Nav';
import Footer from './Footer';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

export default function Album() {

  return (

    <div className="App">
      <Router>
      <React.Fragment>
        <CssBaseline />
        <Route path="/" component={Nav} />
        <main>
          <Route path="/" exact component={Upload} />
          <Route path="/result" component={Result} />
        </main>
        <Route path="/" component={Footer} />
      </React.Fragment>
      </Router>
    </div>
  )
}

