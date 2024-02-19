using System;
using System.Reflection;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Runtime.CompilerServices;

using HarmonyLib;

using Couchbase.Lite;
using Couchbase.Lite.Sync;
using Couchbase.Lite.Logging;
using Couchbase.Lite.Query;

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using Capacitor;

namespace IonicCouchbaseLite {
    using Doc = Dictionary<string, object>;

    public class XQueryPatch {
        public static string Json { get; set; }
        public static string DbName { get; set; }

        private string EncodeAsJSON() {
            return Json;
        }

        private unsafe Dictionary<string, int> CreateColumnNames(object q) {
            string json = EncodeAsJSON();
            var parsed = JObject.Parse(json);
            JArray what = (JArray)parsed["WHAT"];
            var columns = new Dictionary<string, int>();

            int i = -1;
            foreach (var item in what) {
                i++;
                try {
                    JArray entry = (JArray)(item);
                    string column = (string)entry[0];
                    if (column != null) {
                        string columnName;
                        if (column == ".") {
                            columnName = DbName;
                        } else if (column.Equals("AS")) {
                            columnName = entry[2].Value<string>();
                        } else {
                            columnName = column.Substring(1);
                        }
                        columns[columnName] = i;
                    }
                } catch {
                    continue;
                }
            }

            return columns;
        }
    }



    public static class DictUtils {
        public static TV GetValue<TK, TV>(this IDictionary<TK, TV> dict, TK key, TV defaultValue = default(TV)) {
            TV value;
            return dict.TryGetValue(key, out value) ? value : defaultValue;
        }
    }

    [HarmonyPatch]
    class MyXQueryPatchEncodeAsJSON {
        public static string Json { get; set; }

        public static MethodBase TargetMethod() {
            var DLL = Assembly.Load("Couchbase.Lite");
            Type native = DLL.GetType("Couchbase.Lite.Internal.Query.XQuery");
            var xqpType = typeof(XQueryPatch);
            return native.GetMethod("EncodeAsJSON", BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);
        }

        public static bool Prefix(ref string __result) {
            __result  = Json;
            return false;
        }
    }

    /*
    [HarmonyPatch]
    class MyXQueryPatchExecute {
        public static MethodBase TargetMethod() {
            var DLL = Assembly.Load("Couchbase.Lite");
            Type native = DLL.GetType("Couchbase.Lite.Internal.Query.XQuery");
            var xqpType = typeof(XQueryPatch);
            return native.GetMethod("Execute", BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);
        }
        public static void Prefix(dynamic __instance) {
            var DLL = Assembly.Load("Couchbase.Lite");
            // Type native = DLL.GetType("Couchbase.Lite.Internal.Query.XQuery");
        }
    }
    */

    [HarmonyPatch]
    class MyXQueryPatchCreateColumnNames {
        public static string Json { get; set; }
        public static string DbName { get; set; }

        public static MethodBase TargetMethod() {
            var DLL = Assembly.Load("Couchbase.Lite");
            Type native = DLL.GetType("Couchbase.Lite.Internal.Query.XQuery");
            var xqpType = typeof(XQueryPatch);
            return native.GetMethod("CreateColumnNames", BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);
        }

        public static bool Prefix(ref Dictionary<string, int> __result) {
            var parsed = JObject.Parse(Json);
            JArray what = (JArray)parsed["WHAT"];
            var columns = new Dictionary<string, int>();

            int i = -1;
            foreach (var item in what) {
                i++;
                try {
                    JArray entry = (JArray)(item);
                    string column = (string)entry[0];
                    if (column != null) {
                        string columnName;
                        if (column == ".") {
                            columnName = DbName;
                        } else if (column.Equals("AS")) {
                            columnName = entry[2].Value<string>();
                        } else {
                            columnName = column.Substring(1);
                        }
                        columns[columnName] = i;
                    }
                } catch {
                    continue;
                }
            }

            __result  = columns;
            return false;
        }
    }

    [CapacitorPlugin]
    public class IonicCouchbaseLite : Plugin {
        Dictionary<string, Database> openDatabases = new Dictionary<string, Database>();
        Dictionary<string, IResultSet> queryResultSets = new Dictionary<string, IResultSet>();
        Dictionary<string, IEnumerator<Result>> queryResultSetEnumerators = new Dictionary<string, IEnumerator<Result>>();
        Dictionary<string, Replicator> replicators = new Dictionary<string, Replicator>();
        Dictionary<string, ListenerToken> replicatorChangeListeners = new Dictionary<string, ListenerToken>();
        Dictionary<string, ListenerToken> replicatorDocumentListeners = new Dictionary<string, ListenerToken>();

        private int queryCount = 0;
        private int replicatorCount = 0;

        private int allResultsChunkSize = 256;

        public override void Load() {
            base.Load();
            Activator.Activate();
            Logger.debug("Loading IonicCouchbaseLitePlugin");
            // Couchbase.Lite.Enterprise.Support.NetDesktop.Activate();
            // Couchbase.Lite.Support.NetDesktop.Activate();
        }

        public IonicCouchbaseLite() {
            PatchQuery();
            // Database.SetLogLevel(LogDomain.All, LogLevel.Verbose);
        }

        private Database getDatabase(string name) {
            if (openDatabases.ContainsKey(name)) {
                return openDatabases[name];
            }
            return null;
        }

        void PatchQuery() {
            var harmony = new Harmony("Couchbase.Lite");

            harmony.PatchAll();

            /*
            var DLL = Assembly.Load("Couchbase.Lite");
            Type native = DLL.GetType("Couchbase.Lite.Internal.Query.XQuery");
            var xqpType = typeof(XQueryPatch);

            var methodToReplace = native.GetMethod("EncodeAsJSON", BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);
            var methodToInject = xqpType.GetMethod("EncodeAsJSON", BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);
            DynamicMojo.SwapMethodBodies(methodToReplace, methodToInject);

            var methodToReplace2 = native.GetMethod("CreateColumnNames", BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);
            var methodToInject2 = xqpType.GetMethod("CreateColumnNames", BindingFlags.Instance | BindingFlags.Static | BindingFlags.NonPublic | BindingFlags.Public);
            DynamicMojo.SwapMethodBodies(methodToReplace2, methodToInject2);
            */
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Plugin_Configure(PluginCall call) {
            var config = call.GetObject("config");
            var chunkSizeVal = (long)config.GetValueOrDefault("allResultsChunkSize", 256L);
            allResultsChunkSize = Convert.ToInt32(chunkSizeVal);
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_Open(PluginCall call) {
            var name = call.GetString("name");
            var config = call.GetObject("config");

            DatabaseConfiguration dbConfig = buildDBConfig(config);

            try {
                var db = new Database(name, dbConfig);
                openDatabases[name] = db;
            } catch (Exception e) {
                call.Reject("Unable to open database", e);
                Logger.error(e.ToString());
                return;
            }
            call.Resolve();
        }

        private DatabaseConfiguration buildDBConfig(Doc config) {
            DatabaseConfiguration c = new DatabaseConfiguration();

            var encKey = DictUtils.GetValue(config, "encryptionKey") as string;
            var directory = DictUtils.GetValue(config, "directory") as string;
            if (directory != null) {
                c.Directory = directory;
            }
            if (encKey != null) {
                c.EncryptionKey = new EncryptionKey(encKey);
            }
            return c;
        }


        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_Exists(PluginCall call) {
            var dbName = call.GetString("name");
            var existsName = call.GetString("existsName");
            var directory = call.GetString("directory");

            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            call.Resolve(new JSObject() {
                {  "exists", Database.Exists(existsName, directory) }
            });
        }


        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_Save(PluginCall call) {
            var dbName = call.GetString("name");
            var id = call.GetString("id");
            var document = call.GetObject("document");
            var db = getDatabase(dbName);

            Logger.debug($"Saving document: {JsonConvert.SerializeObject(document)}");
            if (db == null) {
                call.Reject("Database not found");
                return;
            }

            MutableDocument m;
            if (id != null) {
                m = new MutableDocument(id, jsonWithCBLObjects(document));
            } else {
                m = new MutableDocument(jsonWithCBLObjects(document));
            }

            db.Save(m);

            call.Resolve(new JSObject() {
                { "_id", m.Id }
            });
        }

        private JSObject jsonWithCBLObjects(Doc document) {
            var items = new JSObject();
            foreach (var item in document) {
                var key = item.Key;
                var value = item.Value;


                // var t = value.GetType();
                if (value is DateTime) {
                    items[key] = new DateTimeOffset((DateTime)value);
                    continue;
                } else if (value is Newtonsoft.Json.Linq.JObject) {
                    items[key] = jsonWithCBLObjects(((Newtonsoft.Json.Linq.JObject)value).ToObject<JSObject>());
                    continue;
                }

                    /*
                var subValue = (JObject) value;
                var typeToken = subValue["_type"];

                if (typeToken != null) {
                  var type = typeToken.ToObject<string>();

                  if (type == "blob") {
                    var blobData = (Doc) subValue["data"].ToObject<Dictionary<string, object>>();
                    var contentType = blobData["contentType"];
                    var byteData = ((JArray) blobData["data"]).ToObject<byte[]>();
                    var blob = new Blob((string) contentType, byteData);
                    items[key] = blob;
                    continue;
                  }
                }
                    */

                items[key] = value;
            }


            return items;
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_Close(PluginCall call) {
            var dbName = call.GetString("name");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            db.Close();
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_Compact(PluginCall call) {
            var dbName = call.GetString("name");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            // db.Compact();
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_Delete(PluginCall call) {
            var dbName = call.GetString("name");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            db.Delete();
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_GetPath(PluginCall call) {
            var dbName = call.GetString("name");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            call.Resolve(new JSObject() {
                { "path", db.Path }
            });
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_GetCount(PluginCall call) {
            var dbName = call.GetString("name");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            call.Resolve(new JSObject() {
                { "count", db.Count }
            });
        }

        [PluginMethod(PluginMethodReturnType.Callback)]
        public void Database_AddChangeListener(PluginCall call) {
            var dbName = call.GetString("name");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }

            call.KeepAlive = true;

            db.AddChangeListener((object sender, DatabaseChangedEventArgs e) => {
                call.Resolve(new JSObject() {
                  { "documentIDs", e.DocumentIDs }
                });
            });
        }


        void HandleEventHandler(object sender, DatabaseChangedEventArgs e) {
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_Copy(PluginCall call) {
            var dbName = call.GetString("name");
            var path = call.GetString("path");
            var newName = call.GetString("newName");
            var config = call.GetObject("config");
            DatabaseConfiguration dbConfig = buildDBConfig(config);

            Database.Copy(path, newName, dbConfig);

            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_DeleteDocument(PluginCall call) {
            var dbName = call.GetString("name");
            var id = call.GetString("docId");
            var document = call.GetObject("document");
            // TODO: Concurrency control
            // var concurrencyControl = call.GetObject("concurrencyControl")

            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            Document d = db.GetDocument(id);

            if (d == null) {
                // TODO: throw
                return;
            }

            db.Delete(d);
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_PurgeDocument(PluginCall call) {
            var dbName = call.GetString("name");
            var docId = call.GetString("docId");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            db.Purge(docId);
            call.Resolve();
        }


        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_GetDocument(PluginCall call) {
            var dbName = call.GetString("name");
            var documentId = call.GetString("docId");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            Document d = db.GetDocument(documentId);

            if (d != null) {
                string docId = d.Id;

                var docDict = new JSObject();
                docDict["_sequence"] = d.Sequence;
                docDict["_data"] = documentToJson(d);
                docDict["_id"] = docId;
                call.Resolve(docDict);
            } else {
                call.Resolve();
            }
        }

        private Doc documentToJson(Document d) {
            return documentDictToJson(d.ToDictionary());
        }

        private Doc documentDictToJson(Doc documentAsMap) {
            return documentAsMap;
            /*
            var docMap = new Doc();
            foreach (var item in documentAsMap) {
              var key = item.Key;
              var value = item.Value;

              if (value != null) {
                var t = value.GetType();

                if (value is Blob) {
                  docMap[key] = ((Blob) value).Properties;
                } else if(t.IsGenericType && t.GetGenericTypeDefinition() == typeof(Dictionary<,>)) {
                  docMap[key] = documentDictToJson((Doc) value);
                } else {
                  docMap[key] = value;
                }
              } else {
                docMap[key] = null;
              }
            }
            return docMap;
            */
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_SetLogLevel(PluginCall call) {
            var dbName = call.GetString("name");
            var domainValue = call.GetString("domain");
            var logLevelValue = call.GetInt("logLevel");
            LogLevel logLevel = (LogLevel)logLevelValue;
            LogDomain domain = LogDomain.All;

            switch (domainValue) {
                case "ALL": domain = LogDomain.All; break;
                case "DATABASE": domain = LogDomain.Database; break;
                case "QUERY": domain = LogDomain.Query; break;
                case "NETWORK": domain = LogDomain.Network; break;
                case "REPLICATOR": domain = LogDomain.Replicator; break;
            }

            // Database.SetLogLevel(domain, logLevel);
            call.Resolve();
        }

        private LogLevel GetLogLevel(int logLevelValue) {
            switch (logLevelValue) {
                case 0: return LogLevel.Debug;
                case 1: return LogLevel.Verbose;
                case 2: return LogLevel.Info;
                case 3: return LogLevel.Warning;
                case 4: return LogLevel.Error;
                case 5: return LogLevel.None;
            }
            return LogLevel.Debug;
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_SetFileLoggingConfig(PluginCall call) {
            var dbName = call.GetString("name");
            var config = call.GetObject("config");
            Console.WriteLine($"Setting file logging config");
            Console.WriteLine(config);
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }

            var levelValue = DictUtils.GetValue(config, "level") as int?;

            var directory = DictUtils.GetValue(config, "directory") as string;
            var maxRotateCount = DictUtils.GetValue(config, "maxRotateCount") as int? ?? -1;
            var maxSize = DictUtils.GetValue(config, "maxSize") as int? ?? -1;
            var usePlaintext = DictUtils.GetValue(config, "usePlaintext");

            LogFileConfiguration fileConfig = new LogFileConfiguration(directory);
            if (maxRotateCount >= 0) {
                fileConfig.MaxRotateCount = maxRotateCount;
            }
            if (maxSize >= 0) {
                fileConfig.MaxSize = maxSize;
            }
            if (usePlaintext != null) {
                fileConfig.UsePlaintext = (Boolean)usePlaintext;
            }

            Database.Log.File.Config = fileConfig;

            if (levelValue != null) {
                LogLevel logLevel = GetLogLevel((int)levelValue);
                Database.Log.File.Level = logLevel;
            }

            Console.WriteLine("Set config!");
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_CreateIndex(PluginCall call) {
            var dbName = call.GetString("name");
            var indexName = call.GetString("indexName");
            var indexData = call.GetObject("index");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            string type = DictUtils.GetValue(indexData, "type") as string;
            var itemType = DictUtils.GetValue(indexData, "items") as JArray;
            var items = itemType.Select(jv => jv.ToObject<object[]>()).ToArray();

            IIndex index = null;
            if (type == "value") {
                index = IndexBuilder.ValueIndex(makeValueIndexItems(items));
            } else if (type == "full-text") {
                index = IndexBuilder.FullTextIndex(makeFullTextIndexItems(items));
            }

            db.CreateIndex(indexName, index);
            call.Resolve();
        }

        private IValueIndexItem[] makeValueIndexItems(object[] items) {
            var valueItems = new List<IValueIndexItem>();
            foreach (object[] item in items) {
                //var itemDict = item as object[];
                var strEntry = item[0] as string;
                var propName = strEntry.Substring(1);
                valueItems.Add(ValueIndexItem.Property(propName));
            }
            return valueItems.ToArray();
        }

        private IFullTextIndexItem[] makeFullTextIndexItems(object[] items) {
            var valueItems = new List<IFullTextIndexItem>();
            foreach (object[] item in items) {
                var strEntry = item[0] as string;
                var propName = strEntry.Substring(1);
                valueItems.Add(FullTextIndexItem.Property(propName));
            }
            return valueItems.ToArray();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_DeleteIndex(PluginCall call) {
            var dbName = call.GetString("name");
            var indexName = call.GetString("indexName");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            db.DeleteIndex(indexName);
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Database_GetIndexes(PluginCall call) {
            var dbName = call.GetString("name");
            var db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            call.Resolve(new JSObject() {
                { "indexes", db.GetIndexes() }
            });
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Document_GetBlobContent(PluginCall call) {
            var dbName = call.GetString("name");
            var documentId = call.GetString("documentId");
            var key = call.GetString("key");
            Database db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }

            Document d = db.GetDocument(documentId);

            if (d == null) {
                call.Reject("No such document");
                return;
            }

            var blob = d.GetBlob(key);
            if (blob == null) {
                call.Reject("No blob found in document");
                return;
            }

            var content = blob.Content;
            call.Resolve(new JSObject() {
                { "data", new List<Byte>(content) }
            });
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Query_Execute(PluginCall call) {
            var dbName = call.GetString("name");
            var json = call.GetObject("query");
            Database db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }
            var jsonString = JsonConvert.SerializeObject(json);
            // MyXQueryPatchEncodeAsJSON.DbName = dbName;
            MyXQueryPatchEncodeAsJSON.Json = jsonString;
            MyXQueryPatchCreateColumnNames.DbName = dbName;
            MyXQueryPatchCreateColumnNames.Json = jsonString;
            XQueryPatch.Json = jsonString;
            XQueryPatch.DbName = dbName;
            // var query = QueryBuilder.Select().From(DataSource.Database(db));
            /*
            var selectArgs = MakeSelectArgs(jsonString, dbName);
            var selectMethod = typeof(QueryBuilder).GetMethod("Select", BindingFlags.Static | BindingFlags.Public);
            var select = selectMethod.Invoke(null, new ISelectResult[][] { selectArgs }) as ISelect;
            var query = select.From(DataSource.Database(db));
            */
            var query = QueryBuilder.Select().From(DataSource.Database(db));
            var rs = query.Execute();

            queryResultSets["" + queryCount] = rs;

            var queryId = queryCount;
            queryCount++;

            call.Resolve(new JSObject() {
                { "id", queryId }
            });
        }

        private ISelectResult[] MakeSelectArgs(string json, string dbName) {
            var args = new List<ISelectResult>();

            var parsed = JObject.Parse(json);
            JArray what = (JArray)parsed["WHAT"];

            foreach (var item in what) {
                try {
                    JArray entry = (JArray)(item);
                    string column = (string)entry[0];
                    if (column != null) {
                        string columnName;
                        if (column == ".") {
                            columnName = dbName;
                        } else {
                            columnName = column.Substring(1);
                        }

                        if (columnName == null) {
                            continue;
                        }

                        if (column.Equals(".")) {
                            args.Add(SelectResult.All());
                        } else if (columnName.Equals("_id")) {
                            args.Add(SelectResult.Expression(Meta.ID));
                        } else if (columnName.Equals("_sequence")) {
                            args.Add(SelectResult.Expression(Meta.Sequence));
                        } else {
                            args.Add(SelectResult.Property(columnName));
                        }
                    }
                } catch {
                    continue;
                }
            }
            return args.ToArray();
        }


        [PluginMethod(PluginMethodReturnType.Promise)]
        public void ResultSet_Next(PluginCall call) {
            var dbName = call.GetString("name");
            var resultSetId = "" + call.Data["resultSetId"];
            Database db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }

            IEnumerator<Result> e = null;
            var rsId = resultSetId;

            if (queryResultSets.ContainsKey(rsId)) {
                if (queryResultSetEnumerators.ContainsKey(rsId)) {
                    e = queryResultSetEnumerators[rsId];
                } else {
                    var rs = queryResultSets[rsId];
                    e = rs.GetEnumerator();
                    queryResultSetEnumerators[rsId] = e;
                }

                if (e.MoveNext()) {
                    var result = e.Current;
                    if (result != null) {
                        var resultDict = ProcessResultMap(result.ToDictionary());

                        var jsObject = new JSObject(resultDict);

                        call.Resolve(jsObject);
                        return;
                    }
                }
            }

            call.Resolve();
        }

        private Dictionary<string, object> ProcessResultMap(Dictionary<string, object> map) {
            var newMap = new Dictionary<string, object>();
            string commonAlias = null;
            Regex commonPattern = new Regex("(.*)\\.$");

            foreach (var key in map.Keys) {
                var m = commonPattern.Match(key);
                if (m.Success) {
                    var foundAlias = m.Groups[1].Value;
                    newMap.Add(foundAlias, map[key]);
                } else {
                    newMap.Add(key, map[key]);
                }
            }

            return newMap;
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void ResultSet_NextBatch(PluginCall call) {
            var dbName = call.GetString("name");
            var resultSetId = "" + call.Data["resultSetId"];
            Database db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }

            IEnumerator<Result> e = null;
            var rsId = resultSetId;

            if (queryResultSets.ContainsKey(rsId)) {
                if (queryResultSetEnumerators.ContainsKey(rsId)) {
                    e = queryResultSetEnumerators[rsId];
                } else {
                    var rs = queryResultSets[rsId];
                    e = rs.GetEnumerator();
                    queryResultSetEnumerators[rsId] = e;
                }

                var i = 0;
                int chunkSize = allResultsChunkSize;
                var resultsChunk = new List<Doc>(chunkSize);

                Result result = null;
                while (i++ < chunkSize && e.MoveNext()) {
                    result = e.Current;
                    if (result != null) {
                        var resultDict = documentDictToJson(result.ToDictionary());
                        resultsChunk.Add(resultDict);
                    }
                }
                call.Resolve(new JSObject() {
                    { "results", resultsChunk }
                });
            } else {
                call.Resolve(new JSObject() {
                    { "results", new List<Doc>() }
                });
            }

        }

        [PluginMethod(PluginMethodReturnType.Callback)]
        public void ResultSet_AllResults(PluginCall call) {
            try {
                var dbName = call.GetString("name");
                var resultSetId = "" + call.Data["resultSetId"];
                var db = getDatabase(dbName);
                if (db == null)
                {
                    call.Reject("Database not found");
                    return;
                }

                var docs = new List<Doc>();

                var rsId = resultSetId;

                if (queryResultSets.ContainsKey(rsId))
                {
                    var rs = queryResultSets[resultSetId];
                    foreach (var r in rs.AllResults())
                    {
                        docs.Add(documentDictToJson(r.ToDictionary()));
                    }
                }

                call.KeepAlive = true;
                call.Resolve(new JSObject() {
                    { "results", docs.ToArray() }
                });

                // call.KeepAlive = false;

                // Send empty list to end the response
                call.Resolve(new JSObject() {
                    { "results", new List<Doc>() }
                });
            } catch (Exception ex) {
                call.Reject("Unable to execute query", ex);
            }
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void ResultSet_Cleanup(PluginCall call) {
            var resultSetId = "" + call.Data["resultSetId"];
            var rsId = "" + resultSetId;

            if (queryResultSets.ContainsKey(rsId)) {
                queryResultSets.Remove(rsId);
            }
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Replicator_Create(PluginCall call) {
            var dbName = call.GetString("name");
            var config = call.GetObject("config");
            Console.WriteLine("Replicator Create!");
            Database db = getDatabase(dbName);
            if (db == null) {
                call.Reject("Database not found");
                return;
            }

            var replicatorConfig = replicatorConfigFromJson(db, config);
            var replicator = new Replicator(replicatorConfig);

            var id = replicatorCount++;

            replicators["" + id] = replicator;
            call.Resolve(new JSObject() {
                { "replicatorId", "" + id }
            });
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Replicator_Start(PluginCall call) {
            var replicatorId = call.GetString("replicatorId");
            Console.WriteLine("Replicator Start!");
            if (replicators.ContainsKey(replicatorId)) {
                Replicator r = replicators[replicatorId];
                r.Start();
            }
            call.Resolve();
        }

        private ReplicatorConfiguration replicatorConfigFromJson(Database db, Doc json) {
            var authenticatorDataJ = json["authenticator"] as JObject;
            var authenticatorData = authenticatorDataJ.ToObject<Dictionary<string, object>>();

            var authenticatorType = authenticatorData["type"] as string;
            var targetJ = json["target"] as JObject;
            if (targetJ == null) {
                // TODO: Throw
                throw new IonicCouchbaseLiteException("Missing target");
            }

            var target = targetJ.ToObject<Dictionary<string, object>>();

            var url = target["url"] as string;
            var replicatorType = json["replicatorType"] as string;
            var continuous = json["continuous"] as bool?;

            var endpoint = new URLEndpoint(new Uri(url));

            var config = new ReplicatorConfiguration(db, endpoint);

            if (json.ContainsKey("channels")) {
                var channels = json["channels"] as string[];

                if (channels != null) {
                    config.Channels = channels;
                }
            }

            if (replicatorType == "PUSH_AND_PULL") {
                config.ReplicatorType = ReplicatorType.PushAndPull;
            } else if (replicatorType == "PULL") {
                config.ReplicatorType = ReplicatorType.Pull;
            } else if (replicatorType == "PUSH") {
                config.ReplicatorType = ReplicatorType.Push;
            }

            if (continuous.HasValue) {
                config.Continuous = continuous.Value;
            }


            Authenticator authenticator = this.replicatorAuthenticatorFromConfig(authenticatorData);
            if (authenticator != null) {
                config.Authenticator = authenticator;
            }
            return config;
        }

        private Authenticator replicatorAuthenticatorFromConfig(Doc config) {
            var type = config["type"] as string;
            var dataJ = config["data"] as JObject;
            var data = dataJ.ToObject<Dictionary<string, object>>();
            if (type == "session") {
                var sessionID = data["sessionID"] as string;
                var cookieName = data["cookieName"] as string;
                return new SessionAuthenticator(sessionID, cookieName);
            } else if (type == "basic") {
                var username = data["username"] as string;
                var password = data["password"] as string;
                return new BasicAuthenticator(username, password);
            }
            return null;
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Replicator_Restart(PluginCall call) {
            var replicatorId = call.GetString("replicatorId");
            Console.WriteLine($"Restarting. {replicatorId}");
            if (replicators.ContainsKey(replicatorId)) {
                Replicator r = replicators[replicatorId];
                Console.WriteLine($"Restart got it {replicatorId}");
                r.Start();
            }
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Replicator_Stop(PluginCall call) {
            var replicatorId = call.GetString("replicatorId");
            Console.WriteLine($"Stopping replicator. {replicatorId}");
            if (replicators.ContainsKey(replicatorId)) {
                Replicator r = replicators[replicatorId];
                Console.WriteLine($"Stop got it {replicatorId}");
                r.Stop();
            }
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Replicator_ResetCheckpoint(PluginCall call) {
            var replicatorId = call.GetString("replicatorId");
            Console.WriteLine($"Resetting replicator checkpoint. {replicatorId}");
            if (replicators.ContainsKey(replicatorId)) {
                Replicator r = replicators[replicatorId];
                Console.WriteLine($"Got it here");
                // r.ResetCheckpoint();
            }
            call.Resolve();
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Replicator_GetStatus(PluginCall call) {
            var replicatorId = call.GetString("replicatorId");
            if (replicators.ContainsKey(replicatorId)) {
                Replicator r = replicators[replicatorId];
                var status = r.Status;
                var statusJson = generateStatusJson(status);
                call.Resolve(statusJson);
            } else {
                call.Resolve();
            }
        }

        private JSObject generateStatusJson(ReplicatorStatus status) {
            var error = status.Error;
            var errorJson = new Dictionary<string, dynamic>();
            if (error != null) {
                CouchbaseException ex = (CouchbaseException)error;
                errorJson = new JSObject() {
                  { "code", ex.Error },
                  { "domain", ex.Domain},
                  { "info", ex.Data }
                };
            }

            return new JSObject() {
                { "activityLevel", status.Activity },
                { "error", errorJson },
                {
                  "progress", new JSObject() {
                    { "completed", status.Progress.Completed },
                    { "total", status.Progress.Total }
                  }
                }
            };
        }

        [PluginMethod(PluginMethodReturnType.Callback)]
        public void Replicator_AddChangeListener(PluginCall call) {
            var replicatorId = call.GetString("replicatorId");
            Replicator r;
            if (replicators.ContainsKey(replicatorId)) {
                r = replicators[replicatorId];
            } else {
                call.Reject("No such replicator");
                return;
            }

            call.KeepAlive = true;
            var listener = r.AddChangeListener((object sender, ReplicatorStatusChangedEventArgs e) => {
                call.Resolve(generateStatusJson(e.Status));
            });

            replicatorChangeListeners.Add(replicatorId, listener);
        }

        private JSObject generateReplicationJson(DocumentReplicationEventArgs replication) {
            var docs = new List<JSObject>();

            foreach (var doc in replication.Documents) {
                var flags = new List<string>();

                if (doc.Flags.HasFlag(DocumentFlags.Deleted)) {
                    flags.Add("DELETED");
                }
                if (doc.Flags.HasFlag(DocumentFlags.AccessRemoved)) {
                    flags.Add("ACCESS_REMOVED");
                }

                var documentDictionary = new JSObject();
                documentDictionary["id"] = doc.Id;
                documentDictionary["flags"] = flags;

                if (doc.Error != null) {
                    var ex = doc.Error;
                    documentDictionary["error"] = new JSObject() {
                        { "code", ex.Error },
                        { "domain", ex.Domain},
                        { "message", ex.Data }
                    };
                }

                docs.Add(documentDictionary);
            }

            var direction = replication.IsPush ? "PUSH" : "PULL";
            return new JSObject() {
                { "direction", direction },
                { "documents", docs }
            };
        }

        [PluginMethod(PluginMethodReturnType.Callback)]
        public void Replicator_AddDocumentListener(PluginCall call) {
            var replicatorId = call.GetString("replicatorId");
            Replicator r;
            if (replicators.ContainsKey(replicatorId)) {
                r = replicators[replicatorId];
            } else {
                call.Reject("No such replicator");
                return;
            }

            call.KeepAlive = true;

            var listener = r.AddDocumentReplicationListener((object sender, DocumentReplicationEventArgs e) => {
                call.Resolve(generateReplicationJson(e));
            });

            replicatorDocumentListeners.Add(replicatorId, listener);
        }

        [PluginMethod(PluginMethodReturnType.Promise)]
        public void Replicator_Cleanup(PluginCall call) {
            var replicatorId = call.GetString("replicatorId");
            Replicator r;
            if (replicators.ContainsKey(replicatorId)) {
                r = replicators[replicatorId];
            } else {
                call.Reject("No such replicator");
                return;
            }

            if (replicatorChangeListeners.ContainsKey(replicatorId)) {
                var token = replicatorChangeListeners[replicatorId];
                r.RemoveChangeListener(token);
                replicatorChangeListeners.Remove(replicatorId);
            }

            if (replicatorDocumentListeners.ContainsKey(replicatorId)) {
                var token = replicatorDocumentListeners[replicatorId];
                r.RemoveChangeListener(token);
                replicatorDocumentListeners.Remove(replicatorId);
            }

            replicators.Remove(replicatorId);
            call.Resolve();
        }

    }

    class IonicCouchbaseLiteException : Exception {
        //public string message;
        internal IonicCouchbaseLiteException(string message) : base(message) { }
    }
}