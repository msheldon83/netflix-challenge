# Netflix Edge Developer Experience Applicant Exercise
Developed by Mike Sheldon for submission 10/9/2017

## Live Demo

https://netflix-challenge-flmjfmykgf.now.sh/

Hosted on https://zeit.co/now platform.

NOTE: This could take a few seconds if waking up from an extended time of no use.

## Deployment 

Build and deploy with docker:

```
git clone https://github.com/msheldon83/netflix-challenge.git
cd netflix-challenge/
docker build -t msheldon-challenge .
docker run -p 8888:3000 msheldon-challenge
```

Browse to http://localhost:8888

## Suggested Queries
The stream of "tweets" has a limited range of words so not everything you'd see on twitter is gonna show up here.  Here are a few suggested queries:

 - tweet contains amazing
 - language equals es

## Problem Description
https://tweet-service.herokuapp.com/

## Solution Approach
While the basic description of the problem can be solved with only a UI layer and a simple javascript method, I chose to infer a desire to see a more robust architecture. I built an edge API to optimize query processing and then only pass relevant tweets along to the client(s).

### Principles
  - Minimize the amount of traffic to the client
  - Minimize duplicate query processing on the server (including across multiple clients)
  - Do not introduce a lot of unnecessary dependencies
  - Protect the server by only opening a connection when it is needed

### Assumptions
  - Only the string fields "tweet", "user", and "language" need to be supported for queries
  - UI design is not a primary evaluation criteria

### Service
The service was developed in Node with Express. It supports the concept of a "session" that is used to communicate queries to the server and tweets back to the client. For the sake of this project that session is determined by the client as a unique string.  Each browser/instance of the UI loaded will use a new uuid, however this is not meant at all to be secure.

### API

#### GET /connection/:sid
Opens a SSE event stream.

Response: eventsource

#### GET /connection/:sid/queries
Returns the list of queries that are being managed for this session.

Response: application/json
```json
[{
  "id": "string",
  "conditions": [{
    "field": "tweet|language|user",
    "operator": "equals|contains|regex",
    "value": "string"
  }]
}]
```

#### POST /connection/:sid/queries
Add a new query (array of conditions) for this connection

Request Body: application/json
```json
[{
    "field": "tweet|language|user",
    "operator": "equals|contains|regex",
    "value": "string"
}]
```

Response: text

#### DELETE /connection/:sid/queries/:qid
Remove a query by id from this connection

Response: application/json
```json
{
  "id": "string",
  "conditions": [{
    "field": "tweet|language|user",
    "operator": "equals|contains|regex",
    "value": "string"
  }]
}
```

### User Interface
The UI was developed using Vue.js and allows for multiple queries to be submitted from the same browser session.  

#### Notes about performance
Depending on the conditions, the tweet stream will update at a rate faster than the UI can refresh. In the case that you have been running one query and then add a second card, the second one may take some time before it starts updating.

Only the most recent 50 tweets for each card will be maintained on the UI.  This is currently configured in a constant called MAX_VISIBLE_TWEETS in /src/client/appService.js.

Try to add more than 5 query cards on the screen :-)

### Thoughts not implemented
  - I focussed on providing unit tests for the most complex logic pieces of the server.  Additonal unit tests and API tests would be appropriate were this a true production application.
  - The repository class could be implemented differently to possibly simplify the somewhat relational data structure that is being used to store state, but this would 
  - The repository class could be backed by a more permanant storage.
  - While it would be fairly easy to scale out the service layer should more traffic need to be handled, sessions would need to be pinned to a single server to get the full benefit of having a single connection.
  - Reconnecting from the client to the server or from the server to the supplied firehose service should utilize some kind of backoff timer following a circuit breaker pattern.
  - I did not have the time to use the data at the /languages endpoint to either provide a dropdown or validate values being tested against language.  
  - Possible interesting features that I didn't have time to implement
    - Username lookup API for autocompletion of user equals conditions
    - Popular searches API based on queries that have been submitted by more than one client


