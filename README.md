couchdb-put-interceptor
=======================

A dumb CouchDB mock that listens for a PUT and writes the doc to file

## Why?!
I [wanted](//github.com/kanso/kanso/issues/394) Kanso (a build and deployment tool for CouchApps) to build my project to a file so that I could:

* create a build artifact in my company's CI system for maintaining a crumb trail;
* use WebStorm LiveEdit to see my changes appear 'live' in the browser.

The second aspiration isn't really achieved through doing this but I've sure as hell managed to get a snapshot of my app compiled neatly into a single file along with its dependencies. I'll now be able to drop this in storage and rest peacefully in knowing that I can easily roll back to a previous version of my project on demand.

## Usage
```bash
$ ./interceptor.js 5983
Waiting for ze payload...
GET /_session?
 .. handling session request
HEAD /backstage/
 .. handling db HEAD request
HEAD /backstage/_design/backstage
 .. handling db HEAD request
PUT /backstage/_design/backstage
 .. handling doc PUT request
Creating payload output stream to file: captured.json
Finished receiving the payload; winding down server
```
Your goodies are written to `captured.json` in your pwd, like so:

```bash
$ ls -lah
-rw-r--r--   1 luke  staff   3.5M 21 Oct 15:58 captured.json
```
