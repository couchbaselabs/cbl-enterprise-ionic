import { TestCase } from './test-case';
import { ITestResult } from './test-result.types';
import { assert, expect } from 'chai';
//import the database in order to create/open a database
import { 
  IndexBuilder, 
  ValueIndexItem, 
  FullTextIndexItem,
  FullTextExpression,
  QueryBuilder,
  DataSource,
  ResultSet,
  SelectResult
 } from 'cblite';

/**
 * IndexingTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class IndexingTests extends TestCase {
  constructor() {
    super();
  }

  /**
   * This is a test that creates an index and then verifies that the index
   * was created.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateIndex(): Promise<ITestResult> {
    try {
      let indexName = 'idx1';
      await this.database.createIndex(
        indexName,
        IndexBuilder
          .valueIndex(
              ValueIndexItem.property('name'), ValueIndexItem.property('documentType')
              )
      );
      let indexes = await this.database.getIndexes();
      expect(indexes).to.have.lengthOf(1);
      assert.equal(indexes[0], indexName);
    } catch (error) {
      return {
        testName: 'testCreateIndex',
        success: false,
        message: error.toString(),
        data: undefined,
      };
    }
    return {
      testName: 'testCreateIndex',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  /**
   * This is a test that creates an FTS index and then verifies that the index
   * was created.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testFullTextIndexExpression(): Promise<ITestResult> {
    try {
      //create index
      let indexName = 'idxFTS';
      let index = IndexBuilder
      .fullTextIndex(FullTextIndexItem.property('quote')).setIgnoreAccents(true); 
      await this.database.createIndex(indexName, index);

      //validate index created
      let indexes = await this.database.getIndexes();
      expect(indexes).to.have.lengthOf(1);
      assert.equal(indexes[0], indexName);

      //create document to search
      let doc = this.createDocumentWithIdAndData('doc1', { quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat', documentType: 'quote'});
      let doc2 = this.createDocumentWithIdAndData('doc2', { quote: 'hello world', documentType: 'quote'}); 
      await this.database.save(doc);
      await this.database.save(doc2);

      //search the database for the term eiusmod 
      let whereClause =
            FullTextExpression.index(indexName).match("eiusmod");
      let ftsQuery = QueryBuilder.select(
          SelectResult.all())
            .from(DataSource.database(this.database))
            .where(whereClause);
      let queryResults = await (await ftsQuery.execute()).allResults();
      let resultDoc = queryResults[0][this.database.getName()];
      expect(queryResults).to.have.lengthOf(1);
      expect(resultDoc.quote).to.equal('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat');
    } catch (error) {
      return {
        testName: 'testFullTextIndexExpression',
        success: false,
        message: error.toString(),
        data: undefined,
      };
    }
    return {
      testName: 'testFullTextIndexExpression',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  /**
   * This is a test that test making an index twice and making sure
   * that we get an error and don't crash the app.
   * was created.
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testCreateSameIndexTwice(): Promise<ITestResult> {
    try {
      let indexName = 'idx1';
      await this.database.createIndex(
        indexName,
        IndexBuilder
          .valueIndex(
              ValueIndexItem.property('name'), ValueIndexItem.property('documentType')
              )
      );
      let indexes = await this.database.getIndexes();
      expect(indexes).to.have.lengthOf(1);
      assert.equal(indexes[0], indexName);
      await this.database.createIndex(
        indexName,
        IndexBuilder
          .valueIndex(
              ValueIndexItem.property('name'), ValueIndexItem.property('documentType')
              )
      ); 
    } catch (error) {
      return {
        testName: 'testCreateSameIndexTwice',
        success: false,
        message: error,
        data: undefined,
      };
    }
    return {
      testName: 'testCreateSameIndexTwice',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  /**
   * This is a test that tests deleting an index
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDeleteIndex(): Promise<ITestResult> {
    try {
      let indexName = 'idx1';
      await this.database.createIndex(
        indexName,
        IndexBuilder
          .valueIndex(
              ValueIndexItem.property('name'), ValueIndexItem.property('documentType')
              )
      );
      let indexes = await this.database.getIndexes();
      expect(indexes).to.have.lengthOf(1);
      assert.equal(indexes[0], indexName);
      await this.database.deleteIndex(indexName);
      let newIndexes = await this.database.getIndexes();
      expect(newIndexes).to.have.lengthOf(0);
    } catch (error) {
      return {
        testName: 'testDeleteIndex',
        success: false,
        message: error.toString(),
        data: undefined,
      };
    }
    return {
      testName: 'testDeleteIndex',
      success: true,
      message: 'success',
      data: undefined,
    };
  }
}
