import React from "react";
import createArraySubsets from "../../../../../utils/createArraySubsets";

import './ItemGrid.scss';

const ItemGrid = ({ children, layout, itemsPerRow, rowClassName }) => {
    const itemRows = createArraySubsets(children, itemsPerRow);
    const itemsToDisplay = itemRows.map(
        (el, i) => <div key={i} className={layout}>{el}</div>
    );
    return itemsToDisplay;
};
ItemGrid.defaultProps = {
    itemsPerRow: 2,
    layout: 'row'
}
export default ItemGrid;