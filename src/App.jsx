import React from 'react';
import { connect } from 'react-redux';
import ProductList from './components/ProductList'
import ProductDetail from './components/ProductDetail'

import {
    Route,
    Link
} from 'react-router-dom'

/**
 * Gone with inline styles here just as there wasn't much would look to put in file as it grows 
 */
const infoStyle = {
    textAlign: 'center',
    lineHeight: '10px'
  }

const titleStyle = {
    fontFamily: "'Arial','serif'",
    letterSpacing: '10px',
    color: 'black',
    cursor: 'pointer'
}

const lineStyle = {
    color: 'black',
    lineHeight: '10px'
}

/**
 * App Component is the highest level real component in the application, it is the parent of the routes and an
 * an ancestors of all other compoents
 */
const AppDisplay = ()=>(
    <div>
        <div style={infoStyle}>
            <Link to={`/`}>
                <h1 style={titleStyle}>MATCHESFASHION.COM</h1>
            </Link>
            <h6>THE FASHION POINT OF VIEW</h6>
        </div>
        <hr style={lineStyle}/>
        {/*Specify a route for the main page which renders when the path is empty*/}
        <Route exact path='/' render={()=><ProductList />}/>

        {/*Specify a route for products where the detail renders differently depending on the product selected, the ID of which is passed in at render time*/}
        {/*It would be possible to read the current path from within the component during rendering, but this way all data is passed in through props.*/}
        <Route exact path='/product/:id' render={({match})=><ProductDetail code={match.params.id}/>}/>

    </div>
);

const mapStateToProps = (state,ownProps)=>({
    ...state,
});

/**
 * The connected component exported below forms the
 * core of our application and is used both on the server and the client
 */
export default connect(mapStateToProps)(AppDisplay);