const superagent = require('superagent')
const config={'couchdb':{}}
const config_okay = require('config_okay')


/**
 * cb_or_promise
 *
 * return either a promise, or if the callback function is not null,
 * do the query and then call the callback
 * @param {} cb
 * @param {} req
 * @returns {}
 * @private
 */
function cb_or_promise( cb, req ) {
    if(!cb || cb === undefined){
        return req // send back the promise object
    }else{
        // wait here for promise object
        req.then(res =>{
            return cb(null,res.body)
        }).catch(e =>{
            return cb(e)
        })
        return null
    }
}


function get_query(c){
    const db = c.db
    if(db === undefined ){
        throw('db is required in options object under \'db\' key')
    }
    const cport = c.port || 5984
    const host = c.host || '127.0.0.1'
    let cdb = host+':'+cport
    if(! /http/.test(cdb)){
        cdb = 'http://'+cdb
    }
    return cdb+'/'+db
}
const  auth_check = (r,opts)=>{
    if(opts.auth.username && opts.auth.password){
        r.auth(opts.auth.username,opts.auth.password)
    }
    return r
}



/**
 * get_doc
 * initialize with the couchdb to get doc from
 *
 * expects that the url, port, username, password are in the config
 * object username and password are optional if you db doesn't need
 * them for get requests.
 *
 * Options:
 *
 * opts = {'db': the couchdb holding the document,
 *         'host': the host, like 127.0.0.1 or http://myhost.com
 *         'port': defaults to 5984
 *         'auth':{'username': the cdb username, optional
 *                 'password': the password, required if username is required
 *                             by your database
 *                }
 * }
 *
 * If you don't need user/pass to create docs, feel free to skip
 * these.  I only try to use credentials if these are truthy
 *
 * returns a function that will get docs directly
 *
 * input arguments to that  are the doc id, and a callback
 *
 * The first argument to the callback is whether there is an error in
 * the requqest, the second is the retrieved doc
 *
 */
function  make_getter(opts){
    var c = {}
    Object.assign(c,config.couchdb,opts)

    //var id = c.doc

    function get(id,next){
        const cdb = get_query(opts)
        const uri = cdb+ '/'+id
        console.log(uri)
        const req = superagent.get(uri)
        .type('json')
        .set('accept','application/json')
        auth_check(req,opts)
        return cb_or_promise(next,req)
    }
    return get
}
module.exports=make_getter
