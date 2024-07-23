/**
 * Fetches the Wikipedia URL for a given country name using the Wikipedia API.
 * @param {string} countryName - The name of the country to fetch the Wikipedia URL for.
 * @param {function} callback - A callback function that receives the Wikipedia URL.
 */
function fetchWikiUrl(countryName, callback) {
    $.ajax({
        url: `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=info&titles=${encodeURIComponent(countryName)}&inprop=url`, // Wikipedia API URL with parameters
        method: 'GET', // HTTP method
        success: function(response) {
            const pages = response.query.pages; // Extract pages object from response
            const pageId = Object.keys(pages)[0]; // Get the first page ID
            if (pageId === "-1") { // If the page ID is -1, it means the page does not exist
                callback("#"); // Call the callback with "#" indicating no URL found
            } else {
                callback(pages[pageId].fullurl); // Call the callback with the Wikipedia URL
            }
        },
        error: function() {
            callback("#"); // Call the callback with "#" in case of an error
        }
    });
}

/**
 * When the document is ready, find all elements with the class 'wiki-link'
 * and fetch their corresponding Wikipedia URLs based on the data-country attribute.
 */
$(document).ready(function() {
    $('.wiki-link').each(function() {
        const $link = $(this); // Reference to the current link element
        const countryName = $link.data('country'); // Get the country name from the data-country attribute
        fetchWikiUrl(countryName, function(url) {
            $link.attr('href', url).attr('target', '_blank'); // Set the href attribute of the link to the fetched URL
        });
    });
});
