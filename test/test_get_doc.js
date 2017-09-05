/* global require console process describe it before after */

const tap = require('tap')

const superagent = require('superagent')

const make_getter = require('../.')

const utils = require('./utils.js')

const path    = require('path')
const rootdir = path.normalize(__dirname)
const config_okay = require('config_okay')
const config_file = rootdir+'/../test.config.json'
const config={}

const date = new Date()
const inprocess_string = date.toISOString()+' inprocess'

let cdb
const test_db ='test%2fget%2fdocs'


/**
 * create a test db, and populate it with data
 * and with a view
 *
 * Instead, because I want to get some real work done, this test is
 * going to just use an exsiting db that I have with existing views
 *
 * If your name is not James E. Marca, you should change this
 *
 */

const doc = {"_id": "801245",
                     "2006": {
                     },
                     "2007": {
                         "vdsimputed": "todo",
                         "wim_neigbors_ready": {
                             "wim_id": 77,
                             "distance": 14788,
                             "direction": "east"
                         },
                         "wim_neigbors": {
                             "wim_id": 77,
                             "distance": 14788,
                             "direction": "east"
                         },
                         "truckimputed": "2013-04-06T04:45:11.832Z finish",
                         "paired_wim": null,
                         "vdsdata": "0",
                         "rawdata": "1",
                         "row": 1,
                         "vdsraw_chain_lengths": [2,2,2,2,2],
                         "vdsraw_max_iterations": 0,
                         "occupancy_averaged": 1,
                         "truckimputation_chain_lengths": [
                             145,
                             147,
                             144,
                             139,
                             143
                         ],
                         "truckimputation_max_iterations": 0
                     },
                     "2008": {
                         "vdsimputed": "todo",
                         "wim_neigbors_ready": {
                             "wim_id": 77,
                             "distance": 14788,
                             "direction": "east"
                         },
                         "wim_neigbors": {
                             "wim_id": 77,
                             "distance": 14788,
                             "direction": "east"
                         },
                         "vdsdata": "0",
                         "rawdata": "1",
                         "row": 1,
                         "truckimputed": "2012-05-21 inprocess",
                         "vdsraw_chain_lengths": [2,2,2,2,2],
                         "vdsraw_max_iterations": 0
                     }}

const docs  = {'docs':[{'_id':'doc1'
                        ,foo:'bar'}
                       ,{'_id':'doc2'
                         ,'baz':'bat'}
                       ,doc
                   ]}


function test_cb (t) {

    const task = Object.assign({}
                               ,config.couchdb
                              )
    const getter = make_getter(task)

    return new Promise((resolve,reject)=>{
        return getter(doc._id
                      ,function(e,r){
                          t.plan(4)
                          console.log(e)
                          console.log(r)
                          t.notOk(e,'should not get error')
                          t.ok(r,'got response')
                          t.is(r._id,doc._id,'got the right doc id')
                          // the only thing that doesn't match is the rev
                          t.same(r,Object.assign(doc,{'_rev':r._rev})
                                 ,'the whole doc matches except for revision number')
                          resolve()
                          return t.end()
                      })
    })

}

function test_promise (t) {
    const localdoc = docs.docs[0]
    const task = Object.assign({},config.couchdb)
    const getter = make_getter(task)
    return getter(localdoc._id)
        .then( r => {
            t.ok(r,'got a response')
            const gotdoc = r.body
            t.is(gotdoc._id,localdoc._id,'got right doc id')
            t.same(gotdoc,Object.assign(localdoc,{'_rev':gotdoc._rev}),'the whole doc matches except for revision number')
            t.end()
            return null
        })
}


config_okay(config_file)
    .then(function(c){
        config.couchdb = c.couchdb
        return utils.create_tempdb(config)
    })
    .then(()=>{
        return utils.populate_tempdb(config,docs)
    })
    .then( r => {
        return tap.test('test getting a doc',test_promise)
    })

    .then( r => {
        return tap.test('test getting a doc',test_cb)
    })

    .then(function(tt){
        console.log('done, tearing down')
        utils.teardown(config,function(eeee,rrrr){
            return tap.end()
        })
        return null
    })
    .catch( function(e){
        throw e
    })
