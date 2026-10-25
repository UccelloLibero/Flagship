/**
 * Wikipedia article titles for names that don't match an article exactly
 * (or that land on a disambiguation page).
 */
const wikiTitles = {
    "Cabo Verde": "Cape Verde",
    "Georgia": "Georgia (country)"
};

/**
 * Builds a direct Wikipedia article URL, used right away so links work before (or without) the API.
 * @param {string} title - The Wikipedia article title.
 */
function wikiArticleUrl(title) {
    return `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`;
}

/**
 * Fetches the Wikipedia URLs for many titles using the Wikipedia API.
 * Titles are sent in batches of 50 (the API's limit) so Wikipedia doesn't rate-limit us
 * the way one request per country does.
 * @param {string[]} titles - The article titles to look up.
 * @param {function} callback - Called once per batch with a map of title to URL (null if no article exists).
 */
function fetchWikiUrls(titles, callback) {
    for (let i = 0; i < titles.length; i += 50) {
        const batch = titles.slice(i, i + 50);
        $.ajax({
            url: `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=info&inprop=url&redirects=1&titles=${encodeURIComponent(batch.join('|'))}`, // Wikipedia API URL with parameters
            method: 'GET', // HTTP method
            success: function(response) {
                const query = response.query || {};
                const renamed = {}; // Follow the API's title normalizations and redirects
                (query.normalized || []).concat(query.redirects || []).forEach(change => {
                    renamed[change.from] = change.to;
                });
                const pagesByTitle = {};
                Object.values(query.pages || {}).forEach(page => {
                    pagesByTitle[page.title] = page;
                });

                const urls = {};
                batch.forEach(title => {
                    let resolved = title;
                    while (renamed[resolved] && renamed[resolved] !== resolved) {
                        resolved = renamed[resolved];
                    }
                    const page = pagesByTitle[resolved];
                    urls[title] = page && !('missing' in page) ? page.fullurl : null; // null means the page does not exist
                });
                callback(urls);
            }
            // On error, links keep their direct article URL
        });
    }
}

/**
 * When the document is ready, find all elements with the class 'wiki-link'
 * and point them at their Wikipedia pages based on the data-country attribute.
 */
$(document).ready(function() {
    const linksByTitle = {};
    $('.wiki-link').each(function() {
        const $link = $(this); // Reference to the current link element
        const countryName = $link.data('country'); // Get the country name from the data-country attribute
        const title = wikiTitles[countryName] || countryName;
        linksByTitle[title] = $link;
        $link.attr('href', wikiArticleUrl(title)).attr('target', '_blank').attr('rel', 'noopener');
    });

    fetchWikiUrls(Object.keys(linksByTitle), function(urls) {
        Object.entries(urls).forEach(([title, url]) => {
            // Fall back to a Wikipedia search when no article exists
            linksByTitle[title].attr('href', url || `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(title)}`);
        });
    });

    // Filter the flag cards as the player types
    $('#flagSearch').on('input', function() {
        const query = $(this).val().trim().toLowerCase();
        let visible = 0;
        $('.flag-col').each(function() {
            const matches = $(this).data('name').includes(query);
            $(this).toggle(matches);
            if (matches) {
                visible++;
            }
        });
        $('#noResults').toggle(visible === 0);
    });
});
