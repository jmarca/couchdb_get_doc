# couchdb_get_doc

This is a utility to put a get a doc from couchdb

It uses superagent.

it is really simple.  just avoids some repeated code.

The program is a function generator.  You call it with the name of the
options object, including (required) the name of the db

The program expects that the url, port, username, password are in
environment variables.  If not, put them in the initialization object


The code says it all:


```javascript
function  get_doc(opts){

    if(opts.cdb === undefined)
        throw new Error('must define the {"cdb":"dbname"} option')
    var cuser = env.COUCHDB_USER
    var cpass = env.COUCHDB_PASS
    var chost = env.COUCHDB_HOST  || '127.0.0.1'
    var cport = env.COUCHDB_PORT || 5984
    //  override env. vars
    if(opts.cuser !== undefined) cuser = opts.cuser
    if(opts.cpass !== undefined) cpass = opts.cpass
    if(opts.chost !== undefined) chost = opts.chost
    if(opts.cport !== undefined) cport = +opts.cport
```

calling get_doc will return a function.  you can get dos with that
function, one by one, by calling the function with a document id as
the first argument, and a callback as the second.  The callback will
be called with an error value, if any, and the requested document.  If
there is no such doc in the db, then the second argument will contain
the response from the db saying so.
