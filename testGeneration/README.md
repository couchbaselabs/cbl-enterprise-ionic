# Test Generation for Ionic Example App
Test data needs to be generated in order to test our apps with SQL++ support.  The Couchbase Server team provides a standard set of SQL++ tests in the query repo found here:

https://github.com/couchbase/query/tree/master/test/filestore/test_cases

The mobile team uses these tests to verify that the SQL++ support in Couchbase Lite is working correctly.  The tests are run against the Couchbase Lite database and the results are compared to the expected results from the query repo.

In order to do the same thing, we must parse out the INSERT statements from the query repo because the SQL++ version in Couchbase Lite doesn't support the insert statement.  

In each of the directories contains a insert.json file.  This file must be parsed and the data must be inserted into the Couchbase Lite database.  The data is then queried and the results are compared to the expected results.

In the directory also contains x amount of JSON files each with a query and then expected results.  This also must code generated into tests cases that we can run in the example mobile app.

The code in this directory is a tool that will generate the test data and test cases for the example mobile app. 

