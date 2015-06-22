
document.addEventListener('DOMContentLoaded', function() {
    var selectedCategory = undefined;
    var span = '<span class="caret"></span>';

    document.querySelector('ul.dropdown-menu').addEventListener('click', function(e) {
        selectedCategory = e.target.textContent;
        document.querySelector('button.dropdown-toggle').innerHTML = selectedCategory + span;
    });

    var btn = document.querySelector('button.base-btn-search');
    btn.addEventListener('click', function(e) {
        var input = document.querySelector('input[type="text"]').value;

        if ( selectedCategory === undefined ) {
            displayError('Please select category...');
            return;
        }

        if ( input === undefined ) {
            displayError("Please enter search item's title");
            return;
        }

        //displaySearch({category: selectedCategory, title: input});
        searchProduct({category: selectedCategory, title: input});
    });

    /*
    makeAjaxCall('gateway/download', function(xhr) {
        if ( xhr.readyState === 4 ) {}
    });  */
});

function searchProduct(obj) {
    callback = function(xhr) {
        if ( xhr.status === 200 ) {
            var response = JSON.parse(xhr.responseText);
            if (response && response.length !== 0 ) {

                if ( Array.isArray(response)) { response = response[0]; }

                displaySearch(response);
            }

            else { displayError('No matching search...')}
        }

        else { displayError('No matching search...')}
    };

    makeAjaxCall('/gateway/search/?q=' + JSON.stringify(obj), callback);
}

function makeAjaxCall(url, callback) {
    //console.log('makeAjaxCall: ' + obj + " " + obj.category + " " + obj.title);
    var xhr = new XMLHttpRequest(url);

    xhr.open('GET', url);

    xhr.addEventListener('readystatechange', function() {
        if ( xhr.readyState === 4 ) {
            if ( xhr.status === 200 ) {
                callback(xhr);
            }
        }
    });

    xhr.send();
}

function displayError(err) {
    var div = document.querySelector('div.jumbotron');
    while (div.firstChild) { div.removeChild(div.firstChild); }

   displayHeader(div, err);
}

function displayHeader(parent, title) {
    createElement('div', parent, "", {class: "col-lg-4"});
    createElement('h2', parent, title, {class: "col-lg-8"});
}

function displaySearch(obj) {
    var div = document.querySelector('div.jumbotron');
    while (div.firstChild) { div.removeChild(div.firstChild); }

    var title = "Search for " + obj.title + " in " + obj.category;
    displayHeader(div, title);

    //console.log(obj);

    createElement('h4', div, 'Author: ' + obj.description.author );
    createElement('h4', div, 'Price: ' + obj.description.price );
    createElement('img', div, '', {src: obj.description.src} );
}


function createElement(elementType, parent, innerHtml, custom) {
    var element = document.createElement(elementType);

    if ( parent ) { parent.appendChild(element); }

    if ( innerHtml ) { element.innerHTML = innerHtml; }

    if ( typeof custom !== 'undefined' ) {
        for ( var prop in custom ) {
            element.setAttribute( prop, custom[prop] );
        }
    }

    return element;
}

/*
var urls = [1, 2, 3, 4].map(function(page) {
    return  'http://www.amazon.com/gp/bestsellers/books/ref=sv_b#' + page;
});

var books = [
    'http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dstripbooks&field-keywords=best+sellers+2015&rh=n%3A283155%2Ck%3Abest+sellers+2015',
    'http://www.amazon.com/s/ref=sr_pg_2?rh=n%3A283155%2Ck%3Abest+sellers+2015&page=2&keywords=best+sellers+2015&ie=UTF8&qid=1430351187',
    'http://www.amazon.com/s/ref=sr_pg_3?rh=n%3A283155%2Ck%3Abest+sellers+2015&page=3&keywords=best+sellers+2015&ie=UTF8&qid=1430351244'
];
*/
/*
function createAjaxPromises(url) {
    return new Promise( function(resolve, reject) {
        try {
            var xhr = new XMLHttpRequest(url);

            xhr.open('GET', url);

            xhr.addEventListener('readystatechange', function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) resolve(xhr);
                    else reject(xhr);
                }
            });

            xhr.send();
        }

        catch (err) {
            reject(err);
        }
    });
}

var factoryPromises = books.map( function(url) {
    var query = '/gateway/download?url=' + url;
    return createAjaxPromises(query);
});

Promise.all(factoryPromises).then(function(data) {
        console.log(data);
    },

    function(xhr) {
        console.log('Wrong ' + xhr.status + ' in ' + xhr.statusText);
    });
*/




