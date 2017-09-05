# couchdb_get_doc

This is a utility to put a get a doc from couchdb

It uses superagent.

It is really simple---just avoids some repeated code.

The program is a function generator.  You call it with an
options object, including (required) the name of the db

The program expects that the url, port, username, password are in
the options object.  Alternately, you can rely on a configuration
file.

The generated function can be used with a callback style, or with a
promise style.

The callback style looks like this:


```javascript

const configuration = {
    "couchdb": {
        "host": "127.0.0.1",
        "port":5984,
        "db":"bitchin_camaros",
        "auth":{"username":"milkman",
                "password":"drove it over from the bahamas"
               }
    }
}

const make_getter = require('couchdb_get_doc')

const get_docs = make_getter(config.couchdb)

... now you can use the getter to get docs ...

get_docs("myid",function(e,doc){
   if (e) { throw "die a horrible death" }
   return do_stuff_with_document(doc)
})

// or using promise style

get_docs("another_id")
.then( doc => {
   return do_stuff_with_document(doc)
})

// or async/await, if you're in an async function
const doc = await get_docs("yadayada")
return await do_stuff_with_document(doc)

```

See the tests for exact details.  The basic utility of this code is
that the document getter wraps up the couchdb database stuff just
once, and then you can get documents all day long.  Because CouchDB
isn't a stateful database, you don't have a connection or anything,
I'm just saving the details about the host, port, database name, and
optionally the username and password.
