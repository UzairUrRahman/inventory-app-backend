
function isStaleItem(updatedAt) {
    if(updatedAt){
        const twentyFourHoursInMillis = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        const currentTime = new Date();
        const lastUpdatedTime = new Date(updatedAt);
        const timeDifference = currentTime.getTime() - lastUpdatedTime.getTime();
        return timeDifference > twentyFourHoursInMillis;
    }else{
        return false;
    }

}



// Function to generate the HTML for the email template 
function generateEmailTemplate(inventoryData) {
    let html = `
        <h2>Inventory Report</h2>
        <table style="border-collapse: collapse; width: 100%;">
            <thead style="background-color: lightgray;">
                <tr>
                    <th style="border: 1px solid black; padding: 10px;">Inventory Name</th>
                    <th style="border: 1px solid black; padding: 10px;">Par</th>
                    <th style="border: 1px solid black; padding: 10px;">Remaining</th>
                    <th style="border: 1px solid black; padding: 10px;">Order</th>
                </tr>
            </thead>
            <tbody>
    `;

    // Generate table rows for each inventory item
    inventoryData.forEach((item, index) => {
        // Check if the item hasn't changed in the last 24 hours and apply styling
        const isStale = isStaleItem(item?.updatedAt);
        html += `
            <tr style="${isStale ? 'background-color: red;' : ''}">
                <td style="border: 1px solid black; padding: 10px;">${item.itemName}</td>
                <td style="border: 1px solid black; padding: 10px;">${item.par}</td>
                <td style="border: 1px solid black; padding: 10px;">${item.remaining}</td>
                <td style="border: 1px solid black; padding: 10px;">${item.order}</td>
            </tr>
        `;
    });

    html += `</tbody></table>`;
    return html;
}

module.exports = generateEmailTemplate;


module.exports = generateEmailTemplate;