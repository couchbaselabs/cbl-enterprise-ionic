import { TestCase, ITestResult } from 'cblite-tests';
import { MutableDocument } from 'cblite';
import { ChangeListeners } from 'cblite-ionic';

import { expect } from 'chai';

/**
 * NotificationTests - reminder all test cases must start with 'test' in the name of the method or they will not run
 * */
export class NotificationTests extends TestCase {
  constructor() {
    super();
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDatabaseChange(): Promise<ITestResult> {
    let results: string[] = [];
    let docId1 = 'doc1';
    let docId2 = 'doc2';
    try {
      let cl = new ChangeListeners(this.database);
      // Create a promise that resolves when the listener is added
      const addChangeListenerAndWait = () => {
        return new Promise<void>(resolve => {
          cl.addChangeListener(change => {
            for (let doc of change.documentIDs) {
              results.push(doc);
            }
            resolve();
          });
        });
      };

      //create documents to trigger the change listener
      let doc1 = new MutableDocument();
      let doc2 = new MutableDocument();
      doc1.setId(docId1);
      doc1.setString('name', 'Alice');
      doc2.setId(docId2);
      doc2.setString('name', 'tdbgamer');

      // Create a promise that resolves when the listener is added
      await Promise.all([
        addChangeListenerAndWait(),
        this.database.save(doc1)
      ]);

      await Promise.all([
        addChangeListenerAndWait(),
        this.database.save(doc2)
      ]);
      // Verify that the listener was called
      expect(results).contain(docId1);
      expect(results).contain(docId2);

      //validate the change listner is removed and the token changes so we don't get any more notifications and conflicts by adding the same listener
      let token = cl.getDatabaseChangeListenerToken();
      await cl.removeChangeListener();
      let newToken = cl.getDatabaseChangeListenerToken();
      expect(token).not.equal(newToken);

    } catch (error) {
      return {
        testName: 'testDatabaseChange',
        success: false,
        message: error,
        data: undefined,
      };
    }
    return {
      testName: 'testDatabaseChange',
      success: true,
      message: 'success',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testDocumentChange(): Promise<ITestResult> {
    return {
      testName: 'testDocumentChange',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testAddSameChangeListeners(): Promise<ITestResult> {
    return {
      testName: 'testAddSameChangeListeners',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }

  /**
   *
   * @returns {Promise<ITestResult>} A promise that resolves to an ITestResult object which contains the result of the verification.
   */
  async testRemoveDocumentChangeListener(): Promise<ITestResult> {
    return {
      testName: 'testRemoveDocumentChangeListener',
      success: false,
      message: 'Not implemented',
      data: undefined,
    };
  }
}
