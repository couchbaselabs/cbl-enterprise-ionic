//
//  IonicCBL.m
//  demo
//
//  Created by Max Lynch on 11/8/18.
//

#import <objc/runtime.h>
#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>
#import <Capacitor/Capacitor-Swift.h>
#import <Capacitor/CAPBridgedPlugin.h>
#import <Capacitor/CAPBridgedJSTypes.h>

#import "IonicCouchbaseLite.h"

@implementation CustomQuery

-(instancetype) initWithJson:(NSData *)jsonData database:(CBLDatabase*)database {
  SEL sel = NSSelectorFromString(@"initWithDatabase:JSONRepresentation:");
  id queryInstance = [CBLQuery alloc];

  Ivar ivar = class_getInstanceVariable(CBLQuery.self, "_from");
  object_setIvar(queryInstance, ivar, [CBLQueryDataSource database:database]);
  
  id (*method)(id, SEL, id, id) = (void *)[queryInstance methodForSelector:sel];
  return method(queryInstance, sel, database, jsonData);
}


@end


@implementation IonicCouchbaseLite {
  NSMutableDictionary<NSString*, CBLDatabase*> *openDatabases;
  NSMutableDictionary<NSString*, CBLQueryResultSet*> *queryResultSets;
  NSMutableDictionary<NSString*, CBLReplicator*> *replicators;
  NSMutableDictionary<NSString*, id> *replicatorChangeListeners;
  NSMutableDictionary<NSString*, id> *replicatorDocumentListeners;
  NSInteger _queryCount;
  NSInteger _replicatorCount;
  NSInteger _allResultsChunkSize;
}

-(void)load {
  openDatabases = [NSMutableDictionary new];
  queryResultSets = [NSMutableDictionary new];
  replicators = [NSMutableDictionary new];
  replicatorChangeListeners = [[NSMutableDictionary alloc] init];
  replicatorDocumentListeners = [[NSMutableDictionary alloc] init];
  _queryCount = 0;
  _replicatorCount = 0;
  _allResultsChunkSize = 256;
}

-(CBLDatabase*)getDatabase:(NSString *)name {
  @synchronized (openDatabases) {
    return [openDatabases objectForKey:name];
  }
}

-(BOOL)checkError:(CAPPluginCall*)call error:(NSError *)error message:(NSString *)message {
  if (error != NULL) {
    NSString *msg = [message stringByAppendingString:@": "];
    msg = [msg stringByAppendingString:error.localizedDescription];

    [call reject:msg :NULL :error :@{}];
    return TRUE;
  }
  return FALSE;
}

-(NSDictionary *)documentToMap:(CBLDocument *)d {
  NSMutableDictionary *docMap = [[NSMutableDictionary alloc] init];
  NSDictionary *documentAsMap = [d toDictionary];
  for(NSString *key in documentAsMap) {
    id value = documentAsMap[key];
    if ([value isKindOfClass:[CBLBlob class]]) {
      CBLBlob *blobEntry = (CBLBlob *)value;
      [docMap setObject:[blobEntry properties] forKey:key];
    } else {
      [docMap setObject:value forKey:key];
    }
  }
  return docMap;
}

-(NSDictionary *)resultToMap:(CBLQueryResult *)d dbName:(NSString *)dbName {
  NSMutableDictionary *dm = [[d toDictionary] mutableCopy];

    if ([dm objectForKey:@"_id"]) {
        [dm setObject:[dm objectForKey:@"_id"] forKey:@"id"];
        [dm removeObjectForKey:@"_id"];
    }
   if ([dm objectForKey:@"_doc"]) {
       [dm setObject:[dm objectForKey:@"_doc"] forKey:dbName];
      [dm removeObjectForKey:@"_doc"];
   }
  return [self resultDictionaryToMap:dm dbName:dbName];
}

-(NSDictionary *)resultDictionaryToMap:(NSDictionary *)d dbName:(NSString *)dbName {
  NSMutableDictionary *docMap = [[NSMutableDictionary alloc] init];
  for(NSString *key in d) {
    NSString *finalKey = [key isEqualToString:@"*"] ? dbName : key;
    id value = d[key];
    if ([value isKindOfClass:[CBLBlob class]]) {
      CBLBlob *blobEntry = (CBLBlob *)value;
      [docMap setObject:[blobEntry properties] forKey:finalKey];
    } else if ([value isKindOfClass:[NSDictionary class]]) {
      [docMap setObject:[self resultDictionaryToMap:value dbName:dbName] forKey:finalKey];
    } else {
      [docMap setObject:value forKey:finalKey];
    }
  }
  return docMap;
}

-(void)Plugin_Configure:(CAPPluginCall*)call {
  NSDictionary *config = [call getObject:@"config" defaultValue:NULL];
  id chunkSizeVal = [config objectForKey:@"allResultsChunkSize"];
  if (chunkSizeVal != NULL) {
    _allResultsChunkSize = [chunkSizeVal intValue];
  }
}

-(void)File_GetDefaultPath:(CAPPluginCall*)call {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES);
    NSString *defaultDirectory = [paths firstObject];
    [call resolve:@{ @"path": defaultDirectory }];
}

-(void)Database_Open:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
  NSString *name = [call getString:@"name" defaultValue:NULL];
  NSDictionary *configValue = [call getObject:@"config" defaultValue:NULL];
      
  
  CBLDatabaseConfiguration *config = [self buildDBConfig:configValue];
  NSError *error;
  CBLDatabase *database = [[CBLDatabase alloc] initWithName:name config:config error:&error];
  
  if ([self checkError:call error:error message:@"Unable to open database"]) {
    return;
  }
    
   if([openDatabases objectForKey:name] != nil){
      [openDatabases removeObjectForKey:name];
   }
   [openDatabases setObject:database forKey:name];
   [call resolve];
  });
}

-(void)Database_Close:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    
    NSError *error;
    [db close:&error];
    
    if ([self checkError:call error:error message:@"Unable to close database"]) {
      return;
    }
    [call resolve];
  });
}

-(CBLDatabaseConfiguration *)buildDBConfig:(NSDictionary *)config {
  CBLDatabaseConfiguration *c = [[CBLDatabaseConfiguration alloc] init];
  NSString *encKey = [config objectForKey:@"encryptionKey"];
  NSString *directory = [config objectForKey:@"directory"];
  if (directory != NULL) {
      //used to auto set the database to be in the documents folder,  otherwise the directory won't work because we need a full path
    [c setDirectory:directory];
  }
  if (encKey != NULL) {
    CBLEncryptionKey *key = [[CBLEncryptionKey alloc] initWithPassword:encKey];
    [c setEncryptionKey:key];
  }
  return c;
}

-(void)Database_Exists:(CAPPluginCall*)call {
  NSString *existsName = [call getString:@"existsName" defaultValue:NULL];
  NSString *directory = [call getString:@"directory" defaultValue:NULL];
  dispatch_async(dispatch_get_main_queue(), ^{

    [call resolve:@{
      @"exists": @([CBLDatabase databaseExists:existsName inDirectory:directory])
    }];
  });
}

-(void)Database_Save:(CAPPluginCall*)call {
  NSString *name = [call getString:@"name" defaultValue:NULL];
  NSString *docId = [call getString:@"id" defaultValue:NULL];
  NSDictionary *document = [call getObject:@"document" defaultValue:NULL];
  NSNumber *concurrencyControlValue = [call getNumber:@"concurrencyControl" defaultValue:NULL];
  
  dispatch_async(dispatch_get_main_queue(), ^{
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    CBLMutableDocument *m = nil;
    
    if (docId != NULL) {
      m = [[CBLMutableDocument alloc] initWithID:docId data:[self toMap:document]];
    } else {
      m = [[CBLMutableDocument alloc] initWithData:[self toMap:document]];
    }
    
    NSError *error;
      
    if (concurrencyControlValue != NULL) {
      [db saveDocument:m concurrencyControl:[concurrencyControlValue intValue] error:&error];
    } else {
      [db saveDocument:m error:&error];
    }
    
    if ([self checkError:call error:error message:@"Unable to save document"]) {
      return;
    }
    
    [call resolve:@{
      @"_id": m.id
    }];
  });
}

-(NSDictionary *)toMap:(NSDictionary *)o {
  NSMutableDictionary *doc = [[NSMutableDictionary alloc] initWithCapacity:[o count]];
  for (NSString *key in o) {
    id value = o[key];
    if ([value isKindOfClass:[NSDictionary class]]) {
      NSDictionary *object = (NSDictionary *) value;
      NSString *type = [object valueForKey:@"_type"];
      if (type != NULL && [type isEqualToString:@"blob"]) {
        NSDictionary *blobData = object[@"data"];
        NSString *contentType = blobData[@"contentType"];
        NSArray *bytes = blobData[@"data"];
        NSRange copyRange = NSMakeRange(0, [bytes count]);
        unsigned char bytesCArray[[bytes count]];
        int i = 0;
        for (NSNumber *item in bytes) {
          bytesCArray[i++] = [item unsignedCharValue];
        }
        
        NSData *data = [NSData dataWithBytes:bytesCArray  length:copyRange.length];
        CBLBlob *blob = [[CBLBlob alloc] initWithContentType:contentType data:data];
        [doc setObject:blob forKey:key];
        continue;
      }
    }
    
    [doc setObject:value forKey:key];
  }
  return doc;
}

-(void)Database_GetCount:(CAPPluginCall*)call {
  NSString *name = [call getString:@"name" defaultValue:NULL];
  dispatch_async(dispatch_get_main_queue(), ^{
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
        [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    [call resolve:@{
      @"count": @([db count])
    }];
  });
}

-(void)Database_GetPath:(CAPPluginCall*)call {
  NSString *name = [call getString:@"name" defaultValue:NULL];
  dispatch_async(dispatch_get_main_queue(), ^{
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    [call resolve:@{
      @"path": [db path]
    }];
  });
}

-(void)Database_Copy:(CAPPluginCall*)call {

  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *path = [call getString:@"path" defaultValue:NULL];
    NSString *name2 = [call getString:@"newName" defaultValue:NULL];
    NSDictionary *configValue = [call getObject:@"config" defaultValue:NULL];
    
    CBLDatabaseConfiguration *config = [self buildDBConfig:configValue];
    
    NSError *error;
    [CBLDatabase copyFromPath:path toDatabase:name2 withConfig:config error:&error];
    
    [call resolve];
  });
}

-(void)Database_CreateIndex:(CAPPluginCall*)call {
  
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    NSString *indexName = [call getString:@"indexName" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    NSDictionary *indexData = [call getObject:@"index" defaultValue:NULL];
    
    NSString *type = [indexData objectForKey:@"type"];
    NSArray *items = [indexData objectForKey:@"items"];
    
    CBLIndex *index;
    
    if ([type isEqualToString:@"value"]) {
      index = [CBLIndexBuilder valueIndexWithItems:[self makeValueIndexItems:items]];
    } else if ([type isEqualToString:@"full-text"]) {
      index = [CBLIndexBuilder fullTextIndexWithItems:[self makeFullTextIndexItems:items]];
    }
    
    NSError *error;
    [db createIndex:index withName:indexName error:&error];
    
    [call resolve];
  });
}

-(NSArray<CBLValueIndexItem *> *)makeValueIndexItems:(NSArray *)items {
  NSMutableArray<CBLValueIndexItem *> *valueItems = [[NSMutableArray alloc] init];
  [items enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
    NSArray *entry = (NSArray *) obj;
    NSString *strEntry = (NSString *) entry[0];
    NSString *propName = [strEntry substringFromIndex:1];
    [valueItems addObject:[CBLValueIndexItem property:propName]];
  }];
  return valueItems;
}

-(NSArray<CBLFullTextIndexItem *> *)makeFullTextIndexItems:(NSArray *)items {
  NSMutableArray<CBLFullTextIndexItem *> *valueItems = [[NSMutableArray alloc] init];
  [items enumerateObjectsUsingBlock:^(id  _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
    NSArray *entry = (NSArray *) obj;
    NSString *strEntry = (NSString *) entry[0];
    NSString *propName = [strEntry substringFromIndex:1];
    [valueItems addObject:[CBLFullTextIndexItem property:propName]];
  }];
  return valueItems;
}

-(void)Database_DeleteIndex:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    NSString *indexName = [call getString:@"indexName" defaultValue:NULL];
    
    NSError *error;
    [db deleteIndexForName:indexName error:&error];
    [call resolve];
  });
}

-(void)Database_GetIndexes:(CAPPluginCall*)call {
  NSString *name = [call getString:@"name" defaultValue:NULL];
  CBLDatabase *db = [self getDatabase:name];
  if (db == NULL) {
    [call reject:@"No such open database" :NULL :NULL :@{}];
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    [call resolve:@{
      @"indexes": [db indexes]
    }];
  });
}

-(void)Database_AddChangeListener:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }

    [call setKeepAlive:YES];
    
    [db addChangeListener:^(CBLDatabaseChange *change) {
      NSArray<NSString *> *docIds = [change documentIDs];
      NSDictionary *data = @{
        @"documentIDs": docIds
      };
      [call resolve:data];
    }];
  });
}



-(void)Database_Delete:(CAPPluginCall*)call {
  NSString *name = [call getString:@"name" defaultValue:NULL];
  CBLDatabase *db = [self getDatabase:name];
  if (db == NULL || db == nil) {
    [call reject:@"No such open database" :NULL :NULL :@{}];
    return;
  }
  NSError *error; 
  //FIX TO TRY AND STOP BOMBING
  //this happens when databases that are closed and then tried to delete will cause the app to bomb out
  @try {
      [db delete:&error];
  } @catch(NSException *exception) {
      [call reject:@"Uncatch Exception: probably tried to delete a database that wasn't open" :NULL :NULL :@{}];
  }
  
  if ([self checkError:call error:error message:@"Unable to delete database"]) {
    return;
  } else {
      //UPDATED to remove the database from the managed database stack because it was removed from disk
      [openDatabases removeObjectForKey:name];
  }
  
  [call resolve];
}

-(void)Database_DeleteDocument:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    NSString *docId = [call getString:@"docId" defaultValue:NULL];
    NSNumber *concurrencyControlValue = [call getNumber:@"concurrencyControl" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
      
    NSError *error;
    @try {
        CBLDocument *doc = [db documentWithID:docId];
        if (concurrencyControlValue != NULL) {
            [db deleteDocument:doc concurrencyControl:[concurrencyControlValue intValue] error:&error];
        } else {
            [db deleteDocument:doc error:&error];
        }
        if ([self checkError:call error:error message:@"Unable to delete document"]) {
            return;
        }
    } @catch(NSException *exception) {
        [call reject:@"Uncatch Exception: documentId is probably invalid" :NULL :NULL :@{}];
        return;
    }
    [call resolve];
  });
}

-(void)Database_PurgeDocument:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    NSString *docId = [call getString:@"docId" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
        
    NSError *error;
    [db purgeDocumentWithID:docId error:&error];
    
    if ([self checkError:call error:error message:@"Unable to purge document"]) {
      return;
    }
    
    [call resolve];
  });
}

-(void)Database_Compact:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    
    NSError *error;
    /* TODO change out to Database Maintenance instead of compact
     https://docs.couchbase.com/mobile/3.1.3/couchbase-lite-objc/Classes/CBLDatabase.html#/c:objc(cs)CBLDatabase(im)performMaintenance:error:
     */
    @try {
        [db performMaintenance:kCBLMaintenanceTypeCompact error:&error];
    } @catch(NSException *exception) {
        if ([self checkError:call error:error message:@"Unable to compact database"]) {
          return;
        } else {
            NSString *errorMessage = [NSString stringWithFormat:@"Unknown error trying to compact database: %@", exception.reason];
            [call reject:errorMessage :NULL :NULL :@{}];
        }
    }
    
    if ([self checkError:call error:error message:@"Unable to compact database"]) {
      return;
    }
    
    [call resolve];
  });
}

-(void)Database_GetDocument:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    NSString *docId = [call getString:@"docId" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    
    CBLDocument *doc = [db documentWithID:docId];
    
    if (doc != NULL) {
      NSMutableDictionary *data = [NSMutableDictionary new];
      NSDictionary *documentMap = [self documentToMap:doc];
      [data setObject:documentMap forKey:@"_data"];
      [data setObject:docId forKey:@"_id"];
      [data setObject:@([doc sequence]) forKey:@"_sequence"];
      [call resolve:data];
      return;
    }
    
    [call resolve:@{}];
  });
}

-(void)Database_SetLogLevel:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *domainValue = [call getString:@"domain" defaultValue:nil];
    NSNumber *logLevelValue = [call getNumber:@"logLevel" defaultValue:nil];
      
    if (logLevelValue == nil) {
      [call reject:@"No log level supplied" :NULL :NULL :@{}];
      return;
    }
      
    if (domainValue == nil) {
      [call reject:@"No domain supplied" :NULL :NULL :@{}];
      return;
    }
      
    CBLLogDomain domain = kCBLLogDomainAll;
    
    if ([domainValue isEqualToString:@"ALL"]) domain = kCBLLogDomainAll;
    else if ([domainValue isEqualToString:@"DATABASE"]) domain = kCBLLogDomainDatabase;
    else if ([domainValue isEqualToString:@"NETWORK"]) domain = kCBLLogDomainNetwork;
    else if ([domainValue isEqualToString:@"QUERY"]) domain = kCBLLogDomainQuery;
    else if ([domainValue isEqualToString:@"REPLICATOR"]) domain = kCBLLogDomainReplicator;
   
    /* fix logging by using this syntax https://docs.couchbase.com/couchbase-lite/current/objc/troubleshooting-logs.html */
    CBLLogLevel logValue = (CBLLogLevel)[logLevelValue integerValue];
    CBLDatabase.log.console.domains = domain;
    CBLDatabase.log.console.level = logValue;
    
    return [call resolve];
  });
}

-(void)Database_SetFileLoggingConfig:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    NSDictionary *configObject = [call getObject:@"config" defaultValue:NULL];
    id logLevelValue = [configObject objectForKey:@"level"];
    NSString *directory = [configObject objectForKey:@"directory"];
    NSString *rawDir = [directory stringByReplacingOccurrencesOfString:@"file://" withString:@""];
    CBLLogFileConfiguration* config = [[CBLLogFileConfiguration alloc] initWithDirectory:rawDir];
    
    id maxRotateCount = [configObject objectForKey:@"maxRotateCount"];
    id maxSize = [configObject objectForKey:@"maxSize"];
    id usePlaintext = [configObject objectForKey:@"usePlaintext"];
    
    [CBLDatabase.log.file setConfig:config];
    
    if (maxRotateCount != NULL) {
      [config setMaxRotateCount:(NSInteger) maxRotateCount];
    }
    if (maxSize != NULL) {
      [config setMaxSize:(NSInteger) maxSize];
    }
    if (usePlaintext != NULL) {
      [config setUsePlainText:(NSInteger) maxRotateCount];
    }
    if (logLevelValue != NULL) {
      [CBLDatabase.log.file setLevel:(NSInteger) logLevelValue];
    }
    return [call resolve];
  });
}

-(void)Document_GetBlobContent:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    NSString *documentId = [call getString:@"documentId" defaultValue:NULL];
    NSString *key = [call getString:@"key" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    
    CBLDocument *d = [db documentWithID:documentId];
    if (d != NULL) {
      CBLBlob *blob = [d blobForKey:key];
      NSData *data = [blob content];

      NSMutableArray *content = [[NSMutableArray alloc] initWithCapacity:[data length]];
      const char *bytes = [data bytes];
      for (int i = 0; i < [data length]; i++) {
        [content addObject:@(bytes[i])];
      }
      [call resolve:@{
        @"data": content
      }];
    } else {
      [call resolve:@{
        @"data": @[]
      }];
    }
  });
}

-(void)Query_Execute:(CAPPluginCall*)call {

    //dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    CBLDatabase *db = [self getDatabase:name];
    if (db == NULL) {
      [call reject:@"No such open database" :NULL :NULL :@{}];
      return;
    }
    
    NSDictionary *queryJson = [call getObject:@"query" defaultValue:NULL];
    NSError *jsonError;
    
    @try {
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:queryJson options:0 error:&jsonError];
        CustomQuery *query = [[CustomQuery alloc] initWithJson:jsonData database:db];
        NSError *error;
        CBLQueryResultSet *result = [query execute:&error];
        
        if (error != NULL) {
            [call reject:@"Unable to execute query" :NULL :error :@{}];
            return;
        }
        
        [queryResultSets setObject:result forKey: [@(_queryCount) stringValue]];
        NSInteger queryId = _queryCount;
        _queryCount++;
        [call resolve:@{ @"id": @(queryId) }];
    }
    @catch (NSException *exception){
        NSDictionary *userInfo = @{
            NSLocalizedDescriptionKey: [exception reason],
            NSLocalizedFailureReasonErrorKey: [exception name]
        };
        NSError *error = [NSError errorWithDomain:@"com.couchbaseLite" code:100 userInfo:userInfo];
        NSString *errorMessage = [NSString stringWithFormat:@"Unable to execute query - jsonValue was: %@", queryJson];
        [call reject:errorMessage :NULL :error :@{}];
    }
}

-(void)ResultSet_Next:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    NSNumber *queryId = [call getNumber:@"resultSetId" defaultValue:NULL];
    if (queryId == NULL) {
      [call reject:@"No resultSetId supplied" :NULL :NULL :@{}];
      return;
    }
    CBLQueryResultSet *rs = [self->queryResultSets objectForKey:[queryId stringValue]];
    if (rs == NULL) {
      [call reject:@"No such result set" :NULL :NULL :@{}];
      return;
    }
    CBLQueryResult *result = [rs nextObject];
    
    if (result == NULL) {
      return [call resolve];
    }
    
    return [call resolve:[self resultToMap:result dbName:name]];
  });
}

-(void)ResultSet_NextBatch:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    NSNumber *queryId = [call getNumber:@"resultSetId" defaultValue:NULL];
    if (queryId == NULL) {
      [call reject:@"No resultSetId supplied" :NULL :NULL :@{}];
      return;
    }
    CBLQueryResultSet *rs = [self->queryResultSets objectForKey:[queryId stringValue]];
    if (rs == NULL) {
      [call reject:@"No such result set" :NULL :NULL :@{}];
      return;
    }
    long chunkSize = self->_allResultsChunkSize;
    NSMutableArray<NSDictionary *> *resultsChunk = [[NSMutableArray alloc] initWithCapacity:chunkSize];
    
    
    CBLQueryResult *result;
    int i = 0;
    while(i++ < chunkSize && (result = [rs nextObject]) != NULL) {
      [resultsChunk addObject:[self resultToMap:result dbName:name]];
    };
    
    return [call resolve:@{
      @"results": resultsChunk
    }];
  });
}

-(void)ResultSet_AllResults:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    NSNumber *queryId = [call getNumber:@"resultSetId" defaultValue:NULL];
    if (queryId == NULL) {
      [call reject:@"No resultSetId supplied" :NULL :NULL :@{}];
      return;
    }
    long chunkSize = self->_allResultsChunkSize;
    CBLQueryResultSet *rs = [self->queryResultSets objectForKey:[queryId stringValue]];
    
    if (rs == NULL) {
      [call reject:@"No such result set" :NULL :NULL :@{}];
      return;
    }
    NSMutableArray *resultsChunk = NULL;

    [call setKeepAlive:YES];
    
    int i = 0;
    CBLQueryResult *queryResult;
    while ((queryResult = [rs nextObject]) != NULL) {
      if (i % chunkSize == 0) {
        if (resultsChunk != NULL) {
          [call resolve:@{
            @"results": resultsChunk
          }];
          [resultsChunk removeAllObjects];
        } else {
          resultsChunk = [[NSMutableArray alloc] initWithCapacity:chunkSize];
        }
      }
      [resultsChunk addObject:[self resultToMap:queryResult dbName:name]];
      i++;
    }
    
    if (resultsChunk != NULL && [resultsChunk count] > 0) {
      [call resolve:@{
        @"results": resultsChunk
      }];
    }
    [call resolve:@{
      @"results": @[]
    }];
  });
}

-(void)ResultSet_AllResults2:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *name = [call getString:@"name" defaultValue:NULL];
    NSNumber *queryId = [call getNumber:@"resultSetId" defaultValue:NULL];
    if (queryId == NULL) {
      [call reject:@"No resultSetId supplied" :NULL :NULL :@{}];
      return;
    }
    int chunkSize = (int) self->_allResultsChunkSize;
    CBLQueryResultSet *rs = [self->queryResultSets objectForKey:[queryId stringValue]];
    
    if (rs == NULL) {
      [call reject:@"No such result set" :NULL :NULL :@{}];
      return;
    }

    [call setKeepAlive:YES];
    
    NSArray<CBLQueryResult *> *results = [rs allResults];
    //NSMutableArray *resultsMapped = [NSMutableArray new];
    NSMutableArray *resultsChunk = NULL;
    for (int i = 0; i < [results count]; i++) {
      if (i % chunkSize == 0) {
        if (resultsChunk != NULL) {
          [call resolve:@{
            @"results": resultsChunk
          }];
        }
        resultsChunk = [NSMutableArray new];
      }
      CBLQueryResult *result = [results objectAtIndex:i];
      [resultsChunk addObject:[self resultToMap:result dbName:name]];
    }
    
    if (resultsChunk != NULL && [resultsChunk count] > 0) {
      [call resolve:@{
        @"results": resultsChunk
      }];
    }
    [call resolve:@{
      @"results": @[]
    }];
  });
}

-(void)ResultSet_Cleanup:(CAPPluginCall*)call {
  dispatch_async(dispatch_get_main_queue(), ^{
    NSNumber *queryId = [call getNumber:@"resultSetId" defaultValue:NULL];
    if (queryId == NULL) {
      [call reject:@"No resultSetId supplied" :NULL :NULL :@{}];
      return;
    }
    CBLQueryResultSet *rs = [self->queryResultSets objectForKey:[queryId stringValue]];

    if (rs != NULL) {
      [self->queryResultSets removeObjectForKey:[queryId stringValue]];
    }
  });
}

-(void)Replicator_Create:(CAPPluginCall*)call {
  NSString *name = [call getString:@"name" defaultValue:NULL];
  NSDictionary *config = [call getObject:@"config" defaultValue:NULL];

  CBLDatabase *db = [self getDatabase:name];
  if (db == NULL) {
    [call reject:@"No such open database" :NULL :NULL :@{}];
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    CBLReplicatorConfiguration *replicatorConfig = [self replicatorConfigFromJson:db data:config];
    CBLReplicator *replicator = [[CBLReplicator alloc] initWithConfig:replicatorConfig];
        
    NSInteger replicatorId = self->_replicatorCount++;
    [self->replicators setObject:replicator forKey:[@(replicatorId) stringValue]];
    return [call resolve:@{ @"replicatorId": @(replicatorId) }];
  });
}

-(void)Replicator_Start:(CAPPluginCall*)call {
  NSNumber *replicatorId = [call getNumber:@"replicatorId" defaultValue:NULL];
  if (replicatorId == NULL) {
    [call reject:@"No replicatorId supplied" :NULL :NULL :@{}];
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    CBLReplicator *replicator = [self->replicators objectForKey:[replicatorId stringValue]];
    if (replicator == NULL) {
      return [call reject:@"No such replicator" :NULL :NULL :@{}];
    }
    
    [replicator start];
    
    [call resolve];
  });
}

-(CBLReplicatorConfiguration *)replicatorConfigFromJson:(CBLDatabase *)db data:(NSDictionary *)data {
  NSDictionary *authenticatorData = [data objectForKey:@"authenticator"];
  NSDictionary *target = [data objectForKey:@"target"];
  NSString *url = [target objectForKey:@"url"];
  NSString *replicatorType = [data objectForKey:@"replicatorType"];
  BOOL continuous = [data objectForKey:@"continuous"];
  
  CBLURLEndpoint *endpoint = [[CBLURLEndpoint alloc] initWithURL:[NSURL URLWithString:url]];
  
  CBLReplicatorConfiguration *replConfig = [[CBLReplicatorConfiguration alloc] initWithDatabase:db target:endpoint];
  
  if ([replicatorType isEqualToString:@"PUSH_AND_PULL"]) {
    [replConfig setReplicatorType:kCBLReplicatorTypePushAndPull];
  } else if ([replicatorType isEqualToString:@"PULL"]) {
    [replConfig setReplicatorType:kCBLReplicatorTypePull];
  } else if ([replicatorType isEqualToString:@"PUSH"]) {
    [replConfig setReplicatorType:kCBLReplicatorTypePush];
  }
    
  NSArray *channels = [data objectForKey:@"channels"];
  if (channels != NULL) {
    [replConfig setChannels:channels];
  }
    
  [replConfig setContinuous:continuous];
  
  CBLAuthenticator *authenticator = [self replicatorAuthenticatorFromConfig:authenticatorData];
  
  if (authenticator != NULL) {
    [replConfig setAuthenticator:authenticator];
  }
  
  return replConfig;
}

-(CBLAuthenticator *)replicatorAuthenticatorFromConfig:(NSDictionary *)config {
  NSString *type = [config objectForKey:@"type"];
  NSDictionary *data = [config objectForKey:@"data"];
  if ([type isEqualToString:@"session"]) {
    NSString *sessionID = [data objectForKey:@"sessionID"];
    NSString *cookieName = [data objectForKey:@"cookieName"];
    CBLSessionAuthenticator *auth = [[CBLSessionAuthenticator alloc] initWithSessionID:sessionID cookieName:cookieName];
    return auth;
  } else if ([type isEqualToString:@"basic"]) {
    NSString *username = [data objectForKey:@"username"];
    NSString *password = [data objectForKey:@"password"];
    CBLBasicAuthenticator *auth = [[CBLBasicAuthenticator alloc] initWithUsername:username password:password];
    return auth;
  }
  return NULL;
}

-(void)Replicator_Stop:(CAPPluginCall*)call {
  NSNumber *replicatorId = [call getNumber:@"replicatorId" defaultValue:NULL];
  if (replicatorId == NULL) {
    [call reject:@"No replicatorId supplied" :NULL :NULL :@{}];
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    CBLReplicator *replicator = [self->replicators objectForKey:[replicatorId stringValue]];
    if (replicator == NULL) {
      return [call reject:@"No such replicator" :NULL :NULL :@{}];
    }
    
    [replicator stop];
    
    [call resolve];
  });
}
-(void)Replicator_ResetCheckpoint:(CAPPluginCall*)call {
  NSNumber *replicatorId = [call getNumber:@"replicatorId" defaultValue:NULL];
  if (replicatorId == NULL) {
    [call reject:@"No replicatorId supplied" :NULL :NULL :@{}];
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    CBLReplicator *replicator = [self->replicators objectForKey:[replicatorId stringValue]];
    if (replicator == NULL) {
      return [call reject:@"No such replicator" :NULL :NULL :@{}];
    }
    
    //TODO fix checkpoint for 3.1
    CBLReplicatorStatus *replicatorStatus =  replicator.status;
    CBLReplicatorActivityLevel activityLevel = replicatorStatus.activity;
    if (activityLevel == kCBLReplicatorStopped ||
        activityLevel == kCBLReplicatorIdle ||
        activityLevel == kCBLReplicatorOffline){
        [replicator startWithReset:true];
        [call resolve];
    }
      [call reject:@"Invalid replicator state for create checkpoint" :NULL :NULL :@{}];
  });
}

-(void)Replicator_GetStatus:(CAPPluginCall*)call {
  NSNumber *replicatorId = [call getNumber:@"replicatorId" defaultValue:NULL];
  if (replicatorId == NULL) {
    [call reject:@"No replicatorId supplied" :NULL :NULL :@{}];
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    CBLReplicator *replicator = [self->replicators objectForKey:[replicatorId stringValue]];
    if (replicator == NULL) {
      return [call reject:@"No such replicator" :NULL :NULL :@{}];
    }
    
    CBLReplicatorStatus *status = [replicator status];

    NSDictionary *statusJson = [self generateStatusJson:status];
    
    [call resolve:statusJson];
  });
}

-(NSDictionary *)generateStatusJson:(CBLReplicatorStatus *)status {
    NSDictionary *errorJson = nil;
    NSError *error = status.error;
    if (error != nil) {
      errorJson = @{
        @"code": @(error.code),
        @"domain": error.domain,
        @"message": error.localizedDescription
      };
    }
    
    CBLReplicatorProgress progress = status.progress;
    NSDictionary *progressJson = @{
      @"completed": @(progress.completed),
      @"total": @(progress.total)
    };
  if (errorJson != nil) {
    return @{
      @"activityLevel": @(status.activity),
      @"error": errorJson,
      @"progress": progressJson
    };
  }
  else {
    return @{
      @"activityLevel": @(status.activity),
      @"progress": progressJson
    };
  }
}

-(void)Replicator_AddChangeListener:(CAPPluginCall*)call {
  NSNumber *replicatorId = [call getNumber:@"replicatorId" defaultValue:NULL];
  if (replicatorId == NULL) {
    [call reject:@"No replicatorId supplied" :NULL :NULL :@{}];
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    CBLReplicator *replicator = [self->replicators objectForKey:[replicatorId stringValue]];
    if (replicator == NULL) {
      return [call reject:@"No such replicator" :NULL :NULL :@{}];
    }

    [call setKeepAlive:YES];
    
    id listener = [replicator addChangeListener:^(CBLReplicatorChange *change) {
      NSDictionary *statusJson = [self generateStatusJson:change.status];
      [call resolve:statusJson];
    }];
    
    [self->replicatorChangeListeners setObject:listener forKey:[replicatorId stringValue]];
  });
}

-(NSDictionary *)generateReplicationJson:(CBLDocumentReplication *)replication {
  NSMutableArray* docs = [[NSMutableArray alloc] init];
  
  for (CBLReplicatedDocument* document in replication.documents) {
    NSMutableArray* flags = [[NSMutableArray alloc] init];
    if ((document.flags & kCBLDocumentFlagsDeleted) != 0) {
      [flags addObject:@"DELETED"];
    }
    if ((document.flags & kCBLDocumentFlagsAccessRemoved) != 0) {
      [flags addObject:@"ACCESS_REMOVED"];
    }
    NSMutableDictionary* documentDictionary = [[NSMutableDictionary alloc] initWithDictionary:@{@"id":document.id, @"flags": flags}];
    
    NSError *error = document.error;
    if (error != nil) {
      [documentDictionary setValue:@{@"code": @(error.code), @"domain": error.domain, @"message": error.localizedDescription} forKey:@"error"];
    }
    
    [docs addObject:documentDictionary];
  }
  
  return @{
    @"direction": (replication.isPush) ? @"PUSH" : @"PULL",
    @"documents": docs
  };
}

-(void)Replicator_AddDocumentListener:(CAPPluginCall*)call {
  NSNumber *replicatorId = [call getNumber:@"replicatorId" defaultValue:NULL];
  if (replicatorId == NULL) {
    [call reject:@"No replicatorId supplied" :NULL :NULL :@{}];
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    CBLReplicator *replicator = [self->replicators objectForKey:[replicatorId stringValue]];
    if (replicator == NULL) {
      return [call reject:@"No such replicator" :NULL :NULL :@{}];
    }

    [call setKeepAlive:YES];
    
    id listener = [replicator addDocumentReplicationListener:^(CBLDocumentReplication *replication) {
      NSDictionary *eventJson = [self generateReplicationJson:replication];
      [call resolve:eventJson];
    }];
    
    [self->replicatorDocumentListeners setObject:listener forKey:[replicatorId stringValue]];
  });
}

-(void)Replicator_Cleanup:(CAPPluginCall*)call {
  NSNumber *replicatorId = [call getNumber:@"replicatorId" defaultValue:NULL];
  if (replicatorId == NULL) {
    [call reject:@"No replicatorId supplied" :NULL :NULL :@{}];
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *key = [replicatorId stringValue];
    CBLReplicator *replicator = [self->replicators objectForKey:key];
    if (replicator == NULL) {
      return [call reject:@"No such replicator" :NULL :NULL :@{}];
    }
    
    [self->replicators removeObjectForKey:key];
    
    id listener = [self->replicatorChangeListeners objectForKey:key];
    if (listener != NULL) {
      [replicator removeChangeListenerWithToken:listener];
      [self->replicatorChangeListeners removeObjectForKey:key];
    }
    
    listener = [self->replicatorDocumentListeners objectForKey:key];
    if (listener != NULL) {
      [replicator removeChangeListenerWithToken:listener];
      [self->replicatorDocumentListeners removeObjectForKey:key];
    }
    
    [call resolve];
  });
}

-(void)Replicator_Restart:(CAPPluginCall*)call {
  NSNumber *replicatorId = [call getNumber:@"replicatorId" defaultValue:NULL];
  if (replicatorId == NULL) {
    [call reject:@"No replicatorId supplied" :NULL :NULL :@{}];
    return;
  }
  dispatch_async(dispatch_get_main_queue(), ^{
    NSString *key = [replicatorId stringValue];
    CBLReplicator *replicator = [self->replicators objectForKey:key];
    if (replicator != NULL) {
      [replicator start];
    }
    [call resolve];
  });
}

@end
