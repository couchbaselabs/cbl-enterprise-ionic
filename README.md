# Couchbase Lite for Ionic
This is a fork of the original @ionic-enterprise/couchbase-lite plugin.  The original plugin was not working with the latest version of Couchbase Lite.  This fork is a work in progress and is not yet ready for production use.

# Integration for Couchbase Lite Enterprise in Ionic apps

## Install

TODO:  change installation instructions

```bash
npm install @ionic-enterprise/couchbase-lite
npx cap sync
```

## API

<docgen-index>

* [`Plugin_Configure(...)`](#plugin_configure)
* [`Database_Open(...)`](#database_open)
* [`Database_Save(...)`](#database_save)
* [`Database_GetCount(...)`](#database_getcount)
* [`Database_GetPath(...)`](#database_getpath)
* [`Database_Copy(...)`](#database_copy)
* [`Database_CreateIndex(...)`](#database_createindex)
* [`Database_DeleteIndex(...)`](#database_deleteindex)
* [`Database_GetIndexes(...)`](#database_getindexes)
* [`Database_Exists(...)`](#database_exists)
* [`Database_Close(...)`](#database_close)
* [`Database_Compact(...)`](#database_compact)
* [`Database_Delete(...)`](#database_delete)
* [`Database_PurgeDocument(...)`](#database_purgedocument)
* [`Database_DeleteDocument(...)`](#database_deletedocument)
* [`Database_GetDocument(...)`](#database_getdocument)
* [`Database_AddChangeListener(...)`](#database_addchangelistener)
* [`Database_SetLogLevel(...)`](#database_setloglevel)
* [`Database_SetFileLoggingConfig(...)`](#database_setfileloggingconfig)
* [`Document_GetBlobContent(...)`](#document_getblobcontent)
* [`Query_Execute(...)`](#query_execute)
* [`ResultSet_Next(...)`](#resultset_next)
* [`ResultSet_NextBatch(...)`](#resultset_nextbatch)
* [`ResultSet_AllResults(...)`](#resultset_allresults)
* [`ResultSet_Cleanup(...)`](#resultset_cleanup)
* [`Replicator_Create(...)`](#replicator_create)
* [`Replicator_Start(...)`](#replicator_start)
* [`Replicator_Restart(...)`](#replicator_restart)
* [`Replicator_AddChangeListener(...)`](#replicator_addchangelistener)
* [`Replicator_AddDocumentListener(...)`](#replicator_adddocumentlistener)
* [`Replicator_Stop(...)`](#replicator_stop)
* [`Replicator_ResetCheckpoint(...)`](#replicator_resetcheckpoint)
* [`Replicator_GetStatus(...)`](#replicator_getstatus)
* [`Replicator_Cleanup(...)`](#replicator_cleanup)
* [Interfaces](#interfaces)
* [Type Aliases](#type-aliases)
* [Enums](#enums)

</docgen-index>

<docgen-api>
<!--Update the source file JSDoc comments and rerun docgen to update the docs below-->

### Plugin_Configure(...)

```typescript
Plugin_Configure(args: PluginConfigureArgs) => Promise<void>
```

| Param      | Type                                                                |
| ---------- | ------------------------------------------------------------------- |
| **`args`** | <code><a href="#pluginconfigureargs">PluginConfigureArgs</a></code> |

--------------------


### Database_Open(...)

```typescript
Database_Open(args: DatabaseOpenArgs) => Promise<void>
```

| Param      | Type                                                          |
| ---------- | ------------------------------------------------------------- |
| **`args`** | <code><a href="#databaseopenargs">DatabaseOpenArgs</a></code> |

--------------------


### Database_Save(...)

```typescript
Database_Save(args: DatabaseSaveArgs) => Promise<{ _id: string; }>
```

| Param      | Type                                                          |
| ---------- | ------------------------------------------------------------- |
| **`args`** | <code><a href="#databasesaveargs">DatabaseSaveArgs</a></code> |

**Returns:** <code>Promise&lt;{ _id: string; }&gt;</code>

--------------------


### Database_GetCount(...)

```typescript
Database_GetCount(args: DatabaseArgs) => Promise<{ count: number; }>
```

| Param      | Type                                                  |
| ---------- | ----------------------------------------------------- |
| **`args`** | <code><a href="#databaseargs">DatabaseArgs</a></code> |

**Returns:** <code>Promise&lt;{ count: number; }&gt;</code>

--------------------


### Database_GetPath(...)

```typescript
Database_GetPath(args: DatabaseArgs) => Promise<{ path: string; }>
```

| Param      | Type                                                  |
| ---------- | ----------------------------------------------------- |
| **`args`** | <code><a href="#databaseargs">DatabaseArgs</a></code> |

**Returns:** <code>Promise&lt;{ path: string; }&gt;</code>

--------------------


### Database_Copy(...)

```typescript
Database_Copy(args: DatabaseCopyArgs) => Promise<void>
```

| Param      | Type                                                          |
| ---------- | ------------------------------------------------------------- |
| **`args`** | <code><a href="#databasecopyargs">DatabaseCopyArgs</a></code> |

--------------------


### Database_CreateIndex(...)

```typescript
Database_CreateIndex(args: DatabaseCreateIndexArgs) => Promise<void>
```

| Param      | Type                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| **`args`** | <code><a href="#databasecreateindexargs">DatabaseCreateIndexArgs</a></code> |

--------------------


### Database_DeleteIndex(...)

```typescript
Database_DeleteIndex(args: DatabaseDeleteIndexArgs) => Promise<void>
```

| Param      | Type                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| **`args`** | <code><a href="#databasedeleteindexargs">DatabaseDeleteIndexArgs</a></code> |

--------------------


### Database_GetIndexes(...)

```typescript
Database_GetIndexes(args: DatabaseArgs) => Promise<{ indexes: string[]; }>
```

| Param      | Type                                                  |
| ---------- | ----------------------------------------------------- |
| **`args`** | <code><a href="#databaseargs">DatabaseArgs</a></code> |

**Returns:** <code>Promise&lt;{ indexes: string[]; }&gt;</code>

--------------------


### Database_Exists(...)

```typescript
Database_Exists(args: DatabaseExistsArgs) => Promise<{ exists: boolean; }>
```

| Param      | Type                                                              |
| ---------- | ----------------------------------------------------------------- |
| **`args`** | <code><a href="#databaseexistsargs">DatabaseExistsArgs</a></code> |

**Returns:** <code>Promise&lt;{ exists: boolean; }&gt;</code>

--------------------


### Database_Close(...)

```typescript
Database_Close(args: DatabaseArgs) => Promise<void>
```

| Param      | Type                                                  |
| ---------- | ----------------------------------------------------- |
| **`args`** | <code><a href="#databaseargs">DatabaseArgs</a></code> |

--------------------


### Database_Compact(...)

```typescript
Database_Compact(args: DatabaseArgs) => Promise<void>
```

| Param      | Type                                                  |
| ---------- | ----------------------------------------------------- |
| **`args`** | <code><a href="#databaseargs">DatabaseArgs</a></code> |

--------------------


### Database_Delete(...)

```typescript
Database_Delete(args: DatabaseArgs) => Promise<void>
```

| Param      | Type                                                  |
| ---------- | ----------------------------------------------------- |
| **`args`** | <code><a href="#databaseargs">DatabaseArgs</a></code> |

--------------------


### Database_PurgeDocument(...)

```typescript
Database_PurgeDocument(args: DatabasePurgeDocumentArgs) => Promise<void>
```

| Param      | Type                                                                            |
| ---------- | ------------------------------------------------------------------------------- |
| **`args`** | <code><a href="#databasepurgedocumentargs">DatabasePurgeDocumentArgs</a></code> |

--------------------


### Database_DeleteDocument(...)

```typescript
Database_DeleteDocument(args: DatabaseDeleteDocumentArgs) => Promise<void>
```

| Param      | Type                                                                              |
| ---------- | --------------------------------------------------------------------------------- |
| **`args`** | <code><a href="#databasedeletedocumentargs">DatabaseDeleteDocumentArgs</a></code> |

--------------------


### Database_GetDocument(...)

```typescript
Database_GetDocument(args: DatabaseGetDocumentArgs) => Promise<{ document: Document; }>
```

| Param      | Type                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| **`args`** | <code><a href="#databasegetdocumentargs">DatabaseGetDocumentArgs</a></code> |

**Returns:** <code>Promise&lt;{ document: Document; }&gt;</code>

--------------------


### Database_AddChangeListener(...)

```typescript
Database_AddChangeListener(args: DatabaseArgs, cb: PluginCallback) => Promise<PluginListenerHandle>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`args`** | <code><a href="#databaseargs">DatabaseArgs</a></code>     |
| **`cb`**   | <code><a href="#plugincallback">PluginCallback</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### Database_SetLogLevel(...)

```typescript
Database_SetLogLevel(args: DatabaseSetLogLevelArgs) => Promise<void>
```

| Param      | Type                                                                        |
| ---------- | --------------------------------------------------------------------------- |
| **`args`** | <code><a href="#databasesetloglevelargs">DatabaseSetLogLevelArgs</a></code> |

--------------------


### Database_SetFileLoggingConfig(...)

```typescript
Database_SetFileLoggingConfig(args: DatabaseSetFileLoggingConfigArgs) => Promise<void>
```

| Param      | Type                                                                                          |
| ---------- | --------------------------------------------------------------------------------------------- |
| **`args`** | <code><a href="#databasesetfileloggingconfigargs">DatabaseSetFileLoggingConfigArgs</a></code> |

--------------------


### Document_GetBlobContent(...)

```typescript
Document_GetBlobContent(args: DocumentGetBlobContentArgs) => Promise<{ data: any; }>
```

| Param      | Type                                                                              |
| ---------- | --------------------------------------------------------------------------------- |
| **`args`** | <code><a href="#documentgetblobcontentargs">DocumentGetBlobContentArgs</a></code> |

**Returns:** <code>Promise&lt;{ data: any; }&gt;</code>

--------------------


### Query_Execute(...)

```typescript
Query_Execute(args: QueryExecuteArgs) => Promise<{ id: string; }>
```

| Param      | Type                                                          |
| ---------- | ------------------------------------------------------------- |
| **`args`** | <code><a href="#queryexecuteargs">QueryExecuteArgs</a></code> |

**Returns:** <code>Promise&lt;{ id: string; }&gt;</code>

--------------------


### ResultSet_Next(...)

```typescript
ResultSet_Next(args: ResultSetNextArgs) => Promise<{ result: Result; }>
```

| Param      | Type                                                            |
| ---------- | --------------------------------------------------------------- |
| **`args`** | <code><a href="#resultsetnextargs">ResultSetNextArgs</a></code> |

**Returns:** <code>Promise&lt;{ result: <a href="#result">Result</a>; }&gt;</code>

--------------------


### ResultSet_NextBatch(...)

```typescript
ResultSet_NextBatch(args: ResultSetNextBatchArgs) => Promise<{ results: Result[]; }>
```

| Param      | Type                                                                      |
| ---------- | ------------------------------------------------------------------------- |
| **`args`** | <code><a href="#resultsetnextbatchargs">ResultSetNextBatchArgs</a></code> |

**Returns:** <code>Promise&lt;{ results: Result[]; }&gt;</code>

--------------------


### ResultSet_AllResults(...)

```typescript
ResultSet_AllResults(args: ResultSetAllResultsArgs, callback: PluginCallback) => Promise<PluginListenerHandle>
```

| Param          | Type                                                                        |
| -------------- | --------------------------------------------------------------------------- |
| **`args`**     | <code><a href="#resultsetallresultsargs">ResultSetAllResultsArgs</a></code> |
| **`callback`** | <code><a href="#plugincallback">PluginCallback</a></code>                   |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### ResultSet_Cleanup(...)

```typescript
ResultSet_Cleanup(args: ResultSetCleanupArgs) => Promise<void>
```

| Param      | Type                                                                  |
| ---------- | --------------------------------------------------------------------- |
| **`args`** | <code><a href="#resultsetcleanupargs">ResultSetCleanupArgs</a></code> |

--------------------


### Replicator_Create(...)

```typescript
Replicator_Create(args: ReplicatorCreateArgs) => Promise<{ replicatorId: string; }>
```

| Param      | Type                                                                  |
| ---------- | --------------------------------------------------------------------- |
| **`args`** | <code><a href="#replicatorcreateargs">ReplicatorCreateArgs</a></code> |

**Returns:** <code>Promise&lt;{ replicatorId: string; }&gt;</code>

--------------------


### Replicator_Start(...)

```typescript
Replicator_Start(args: ReplicatorArgs) => Promise<void>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`args`** | <code><a href="#replicatorargs">ReplicatorArgs</a></code> |

--------------------


### Replicator_Restart(...)

```typescript
Replicator_Restart(args: ReplicatorArgs) => Promise<void>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`args`** | <code><a href="#replicatorargs">ReplicatorArgs</a></code> |

--------------------


### Replicator_AddChangeListener(...)

```typescript
Replicator_AddChangeListener(args: ReplicatorArgs, cb: PluginCallback) => Promise<PluginListenerHandle>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`args`** | <code><a href="#replicatorargs">ReplicatorArgs</a></code> |
| **`cb`**   | <code><a href="#plugincallback">PluginCallback</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### Replicator_AddDocumentListener(...)

```typescript
Replicator_AddDocumentListener(args: ReplicatorArgs, cb: PluginCallback) => Promise<PluginListenerHandle>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`args`** | <code><a href="#replicatorargs">ReplicatorArgs</a></code> |
| **`cb`**   | <code><a href="#plugincallback">PluginCallback</a></code> |

**Returns:** <code>Promise&lt;<a href="#pluginlistenerhandle">PluginListenerHandle</a>&gt;</code>

--------------------


### Replicator_Stop(...)

```typescript
Replicator_Stop(args: ReplicatorArgs) => Promise<void>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`args`** | <code><a href="#replicatorargs">ReplicatorArgs</a></code> |

--------------------


### Replicator_ResetCheckpoint(...)

```typescript
Replicator_ResetCheckpoint(args: ReplicatorArgs) => Promise<void>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`args`** | <code><a href="#replicatorargs">ReplicatorArgs</a></code> |

--------------------


### Replicator_GetStatus(...)

```typescript
Replicator_GetStatus(args: ReplicatorArgs) => Promise<void>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`args`** | <code><a href="#replicatorargs">ReplicatorArgs</a></code> |

--------------------


### Replicator_Cleanup(...)

```typescript
Replicator_Cleanup(args: ReplicatorArgs) => Promise<void>
```

| Param      | Type                                                      |
| ---------- | --------------------------------------------------------- |
| **`args`** | <code><a href="#replicatorargs">ReplicatorArgs</a></code> |

--------------------


### Interfaces


#### PluginConfigureArgs

| Prop         | Type             |
| ------------ | ---------------- |
| **`config`** | <code>any</code> |


#### DatabaseOpenArgs

| Prop         | Type                               |
| ------------ | ---------------------------------- |
| **`config`** | <code>DatabaseConfiguration</code> |


#### DatabaseSaveArgs

| Prop           | Type                                              |
| -------------- | ------------------------------------------------- |
| **`id`**       | <code>string</code>                               |
| **`document`** | <code><a href="#dictionary">Dictionary</a></code> |


#### DatabaseArgs

| Prop       | Type                |
| ---------- | ------------------- |
| **`name`** | <code>string</code> |


#### DatabaseCopyArgs

| Prop          | Type                               |
| ------------- | ---------------------------------- |
| **`path`**    | <code>string</code>                |
| **`newName`** | <code>string</code>                |
| **`config`**  | <code>DatabaseConfiguration</code> |


#### DatabaseCreateIndexArgs

| Prop            | Type                |
| --------------- | ------------------- |
| **`indexName`** | <code>string</code> |
| **`index`**     | <code>any</code>    |


#### DatabaseDeleteIndexArgs

| Prop            | Type                |
| --------------- | ------------------- |
| **`indexName`** | <code>string</code> |


#### DatabaseExistsArgs

| Prop             | Type                |
| ---------------- | ------------------- |
| **`existsName`** | <code>string</code> |
| **`directory`**  | <code>string</code> |


#### DatabasePurgeDocumentArgs

| Prop        | Type                |
| ----------- | ------------------- |
| **`docId`** | <code>string</code> |


#### DatabaseDeleteDocumentArgs

| Prop                     | Type                                                              |
| ------------------------ | ----------------------------------------------------------------- |
| **`docId`**              | <code>string</code>                                               |
| **`document`**           | <code><a href="#dictionary">Dictionary</a></code>                 |
| **`concurrencyControl`** | <code><a href="#concurrencycontrol">ConcurrencyControl</a></code> |


#### DatabaseGetDocumentArgs

| Prop        | Type                |
| ----------- | ------------------- |
| **`docId`** | <code>string</code> |


#### PluginListenerHandle

| Prop         | Type                                      |
| ------------ | ----------------------------------------- |
| **`remove`** | <code>() =&gt; Promise&lt;void&gt;</code> |


#### PluginResultData


#### PluginResultError

| Prop          | Type                |
| ------------- | ------------------- |
| **`message`** | <code>string</code> |


#### DatabaseSetLogLevelArgs

| Prop           | Type                |
| -------------- | ------------------- |
| **`domain`**   | <code>string</code> |
| **`logLevel`** | <code>number</code> |


#### DatabaseSetFileLoggingConfigArgs

| Prop         | Type                                                                                          |
| ------------ | --------------------------------------------------------------------------------------------- |
| **`config`** | <code><a href="#databasefileloggingconfiguration">DatabaseFileLoggingConfiguration</a></code> |


#### DatabaseFileLoggingConfiguration

| Prop                 | Type                 |
| -------------------- | -------------------- |
| **`level`**          | <code>number</code>  |
| **`directory`**      | <code>string</code>  |
| **`maxRotateCount`** | <code>number</code>  |
| **`maxSize`**        | <code>number</code>  |
| **`usePlaintext`**   | <code>boolean</code> |


#### DocumentGetBlobContentArgs

| Prop             | Type                |
| ---------------- | ------------------- |
| **`documentId`** | <code>string</code> |
| **`key`**        | <code>string</code> |


#### QueryExecuteArgs

| Prop              | Type                                  |
| ----------------- | ------------------------------------- |
| **`query`**       | <code>any</code>                      |
| **`columnNames`** | <code>{ [name: string]: any; }</code> |


#### ResultSetNextArgs

| Prop              | Type                |
| ----------------- | ------------------- |
| **`resultSetId`** | <code>string</code> |


#### ResultSetNextBatchArgs

| Prop              | Type                |
| ----------------- | ------------------- |
| **`resultSetId`** | <code>string</code> |


#### ResultSetAllResultsArgs

| Prop              | Type                |
| ----------------- | ------------------- |
| **`resultSetId`** | <code>string</code> |


#### ResultSetCleanupArgs

| Prop              | Type                |
| ----------------- | ------------------- |
| **`resultSetId`** | <code>string</code> |


#### ReplicatorCreateArgs

| Prop         | Type             |
| ------------ | ---------------- |
| **`config`** | <code>any</code> |


#### ReplicatorArgs

| Prop               | Type                |
| ------------------ | ------------------- |
| **`replicatorId`** | <code>string</code> |


### Type Aliases


#### Dictionary

<code>{ [key:string]: any }</code>


#### PluginCallback

<code>(data: <a href="#pluginresultdata">PluginResultData</a>, error?: <a href="#pluginresulterror">PluginResultError</a>): void</code>


#### Result

<code>{ [key:string]: any }</code>


### Enums


#### ConcurrencyControl

| Members                | Value          |
| ---------------------- | -------------- |
| **`LAST_WRITE_WINS`**  | <code>0</code> |
| **`FAIL_ON_CONFLICT`** | <code>1</code> |

</docgen-api>
