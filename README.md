# Netflix Edge Developer Experience Applicant Exercise
Developed by Mike Sheldon for submission 10/9/2017

## Deployment 


## Problem Description
https://tweet-service.herokuapp.com/

## Solution Approach
While the basic description of the problem can be solved with only a UI layer and a simple javascript method, I chose to infer a desire to see a more robust architecture that included an edge API that optimized query processing and only passed relevant tweets along to the client.

### Principles
  - Minimize the amount of traffic to the client
  - Minimize duplicate query processing on the server
  - Do not introduce a lot of unnecessary dependencies
  - Protect the server by only opening a connection when I need it

### Assumptions
  - Only the string fields "tweet", "user", and "language" need to be supported for queries
  - UI design is not a primary evaluation criteria

### Service
The service was developed in Node with Express.supports the concept of a "session" that is used to communicate queries to the server and tweets back to the client. For the sake of this project that session is determined by the client as a unique string.  Each browser/instance of the UI loaded will be handled as a separate session.

#### API

##### GET /connection/:sid
Opens a SSE event stream.

##### GET /connection/:sid/queries
Returns the list of queries that are being managed for this session.

##### POST /connection/:sid/queries
Add a new query for this connection

##### DELETE /connection/:sid/queries/:qid
Remove a query by id from this connection



### User Interface
The UI was developed 

### Limitations
  - Queries that have the same criteria but different orders will not be combined.  This would be fairly easy to optimize by changing how query signatures are determined.
  - I focussed on providing unit tests for the most complex logic pieces.  Unit tests and API tests would be appropriate were this a true production application.
  - The repository class could be implemented differently to possibly simplify the somewhat relational data structure that is being used to store state, but this would 
  - The repository class could be backed by a more permanant storgage.
  - While it would be fairly easy to scale out the service layer should more traffic need to be handled, sessions would need to be pinned to a single server to get the full benefit of having a single connection.
  - Reconnecting from the client to the server or from the server to the supplied firehose service should utilize some kind of backoff timer following a circuit breaker pattern.


