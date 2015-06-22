
var router = require('express').Router();
var request = require('request');
var cheerio = require('cheerio');

var ProductModel = require('../models/product_model');

var books = [
    'http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dstripbooks&field-keywords=best+sellers+2015&rh=n%3A283155%2Ck%3Abest+sellers+2015',
    'http://www.amazon.com/s/ref=sr_pg_2?rh=n%3A283155%2Ck%3Abest+sellers+2015&page=2&keywords=best+sellers+2015&ie=UTF8&qid=1430351187',
    'http://www.amazon.com/s/ref=sr_pg_3?rh=n%3A283155%2Ck%3Abest+sellers+2015&page=3&keywords=best+sellers+2015&ie=UTF8&qid=1430351244'
];

var clothes = [
    'http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dfashion-womens-clothing&field-keywords=best+sellers&rh=i%3Afashion-womens-clothing%2Ck%3Abest+sellers',
    'http://www.amazon.com/s/ref=sr_pg_2?rh=n%3A7141123011%2Cn%3A7147440011%2Cn%3A1040660%2Ck%3Abest+sellers&page=2&keywords=best+sellers&ie=UTF8&qid=1430415300&spIA=B00FG8WZUE,B00THN6X66,B00KQPPVX0',
    'http://www.amazon.com/s/ref=sr_pg_3?rh=n%3A7141123011%2Cn%3A7147440011%2Cn%3A1040660%2Ck%3Abest+sellers&page=3&keywords=best+sellers&ie=UTF8&qid=1430415350&spIA=B00THN6P7I,B00FG8WZUE,B00THN6X66,B00KQPPVX0'
];

var beauties = [
    'http://www.amazon.com/s/ref=nb_sb_ss_c_0_7?url=search-alias%3Dbeauty&field-keywords=best+sellers&rh=n%3A3760911%2Ck%3Abest+sellers',
    'http://www.amazon.com/s/ref=sr_pg_2?rh=n%3A3760911%2Ck%3Abest+sellers&page=2&keywords=best+sellers&ie=UTF8&qid=1430410797&spIA=B001MA0QY2,B001DKGJQU,B00JVXVCS6',

];

var toys = [
    'http://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Dtoys-and-games&field-keywords=best+sellers&rh=n%3A165793011%2Ck%3Abest+sellers',
    'http://www.amazon.com/s/ref=sr_pg_2?rh=n%3A165793011%2Ck%3Abest+sellers&page=2&keywords=best+sellers&ie=UTF8&qid=1430414259&spIA=B00LXIYMMK,B00MEOW7R4,B004RDL13G',
    'http://www.amazon.com/s/ref=sr_pg_3?rh=n%3A165793011%2Ck%3Abest+sellers&page=3&keywords=best+sellers&ie=UTF8&qid=1430414463&spIA=B000UL99AQ,B004P93XZ6,B00E4YMYIO,B00LXIYMMK,B00MEOW7R4,B004RDL13G'
];

router.get('/search/:q?', function(req, res) {
    var obj = JSON.parse(req.query.q);
    //console.log(obj + " " + obj.category + " " + obj.title);

    /*
    var query = ProductModel.find({title: new RegExp(obj.title, 'i')}).where(category).equals(obj.category);
    query.exec(function(err, result){
        if (err) res.status(500).json(err);

        else res.status(200).json(result);

    });  */

    /*
    ProductModel.find({title: new RegExp(obj.title, 'i'), category: obj.category}, function(err, result) {
        if (err) res.status(500).json(err);

        else res.status(200).json(result);
    });  */

    ProductModel.find({title: new RegExp(obj.title, 'i')}, function(err, result){
        if (err) res.status(500).json(err);

        else res.status(200).json(result);
    });

    //res.status(200).json({message: "success"});
});

router.get('/download', function(req, res) {
    //var url = req.query.url;

    //download(beauties, parseProduct, 'beauties');
    //download(clothes, parseProduct, 'clothes');
    download(books, parseBooks, 'Books');


    res.status(200).json({message: 'success'});
});

function download(urls, fn, category) {
    urls.forEach(function (url) {
        request(url, function (error, response, body) {
            if (!error && response.statusCode === 200) {
                $ = cheerio.load(body);

                //fn.call(this, $, category);
                fn($, category);
            }
        });
    });
}

function parseBooks($, category) {
    var li = 'li.s-result-item';

    var images = $(li).find($('img.s-access-image')).map(function() {
        return this.attribs.src;
        //return $(img).attr('src');
    });
    images = Array.prototype.slice.call(images);

    var titles = $(li).find($('h2.s-access-title')).map(function() {
        return $(this).text();
    });
    titles = Array.prototype.slice.call(titles);

    var authors = $(li).find($('div.a-spacing-small>div.a-row.a-spacing-none')).find($('span')).map(function(){
        if ($(this).text() != 'by ')
            return $(this).text();
    });
    authors = Array.prototype.slice.call(authors);

    var prices = $(li).find($('span.s-price')).map(function() {
        return $(this).text();
    });
    prices = Array.prototype.slice.call(prices);

    //var array = [];

    for ( var i = 0, len = prices.length; i < len; i++ ) {
        var obj = {};
        obj.category = category;
        obj.title = titles[i];
        obj.description = { author: authors[i], price: prices[i], src: images[i] };

        if ( obj.title !== undefined && obj.description.price !== undefined &&
             obj.description.src !== undefined && obj.description.author !== undefined ) {
            //array.push(obj);
            (new ProductModel(obj)).save( function(err, result) {});
            //var product = new ProductModel(obj);
            //product.save( function(err, result) {});
        }
    }

    //console.log(array);
}

function parseProduct($, category) {
    var li = 'li.s-result-item';

    var details = $(li).find($('h2.s-access-title')).map(function() {
        return $(this).text();
    });
    details = Array.prototype.slice.call(details);

    var images = $(li).find($('img.s-access-image')).map(function() {
        return this.attribs.src;
        //return $(img).attr('src');
    });
    images = Array.prototype.slice.call(images);

    var prices = $(li).find($('span.s-price')).map(function() {
        return $(this).text();
    });
    prices = Array.prototype.slice.call(prices);

    //var array = [];

    for ( var i = 0, len = prices.length; i < len; i++ ) {
        var obj = {};
        obj.category = category;
        obj.title = details[i];
        obj.description = { price: prices[i], src: images[i] };

        if ( obj.title !== undefined && obj.description.price !== undefined && obj.description.src !== undefined) {
            //array.push(obj);
            //(new BeautyModel(objects[i])).save( function(err, result) {});
            var product = new ProductModel(obj);
            product.save( function(err, result) {});
        }
    }

    //console.log(array);
}

module.exports = router;