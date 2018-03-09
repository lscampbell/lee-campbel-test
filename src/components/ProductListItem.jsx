import React from 'react';

/**
 * Gone with inline styles here just as there wasn't much would look to put in file as it grows 
 */
const infoStyle = {
    textAlign: 'center',
    lineHeight: '10px'
  }

const labelStyle = {
    display: 'block',
    fontFamily: "'Georgia', 'Times New Roman', 'serif'",
    fontSize: '0.8em'
}

const designerStyle = {
    fontFamily: "'Georgia', 'Times New Roman', 'serif'",
    display: 'block',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: '0.8em'
}

const priceStyle = {
    color: 'red'
}


/**
 * Each entry in the ProductList is represtented by a ProductListItem, which displays high-level information
 * about a product in a format that works well in a list
 */
export default ({name, designerData, priceData, discountMessage, thumbnail})=>(
    <div className="col-3 col-sm-3 mb-2">
        <div>
            <img className="col-12 mb-2" src={thumbnail.replace("thumbnail","large")}/>
        </div>
        <div style={infoStyle}>
            <label style={designerStyle}>{designerData.name}</label>
            <label style={labelStyle}>{name}</label>
            <label style={labelStyle}><span style={priceStyle}>{priceData.formattedValue}</span> <strike>({priceData.formattedWasPrice})</strike> Save {discountMessage}</label>
        </div>
    </div>
);