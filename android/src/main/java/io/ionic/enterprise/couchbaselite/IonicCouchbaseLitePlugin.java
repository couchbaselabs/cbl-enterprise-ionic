package io.ionic.enterprise.couchbaselite;

import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.content.Context;

import androidx.annotation.NonNull;

import com.couchbase.lite.AbstractReplicator;
import com.couchbase.lite.Authenticator;
import com.couchbase.lite.BasicAuthenticator;
import com.couchbase.lite.Blob;
import com.couchbase.lite.ConcurrencyControl;
import com.couchbase.lite.CouchbaseLite;
import com.couchbase.lite.CouchbaseLiteException;
import com.couchbase.lite.DataSource;
import com.couchbase.lite.Database;
import com.couchbase.lite.DatabaseChange;
import com.couchbase.lite.DatabaseChangeListener;
import com.couchbase.lite.DatabaseConfiguration;
import com.couchbase.lite.Document;
import com.couchbase.lite.DocumentFlag;
import com.couchbase.lite.DocumentReplication;
import com.couchbase.lite.DocumentReplicationListener;
import com.couchbase.lite.EncryptionKey;
import com.couchbase.lite.Endpoint;
import com.couchbase.lite.Expression;
import com.couchbase.lite.FullTextIndexItem;
import com.couchbase.lite.Index;
import com.couchbase.lite.IndexBuilder;
import com.couchbase.lite.Join;
import com.couchbase.lite.ListenerToken;
import com.couchbase.lite.LogDomain;
import com.couchbase.lite.LogFileConfiguration;
import com.couchbase.lite.LogLevel;
import com.couchbase.lite.MaintenanceType;
import com.couchbase.lite.Meta;
import com.couchbase.lite.MutableArray;
import com.couchbase.lite.MutableDictionary;
import com.couchbase.lite.MutableDocument;
import com.couchbase.lite.Query;
import com.couchbase.lite.QueryBuilder;
import com.couchbase.lite.ReplicatedDocument;
import com.couchbase.lite.Replicator;
import com.couchbase.lite.ReplicatorActivityLevel;
import com.couchbase.lite.ReplicatorChange;
import com.couchbase.lite.ReplicatorChangeListener;
import com.couchbase.lite.ReplicatorConfiguration;
import com.couchbase.lite.ReplicatorProgress;
import com.couchbase.lite.ReplicatorStatus;
import com.couchbase.lite.Result;
import com.couchbase.lite.ResultSet;
import com.couchbase.lite.SelectResult;
import com.couchbase.lite.SessionAuthenticator;
import com.couchbase.lite.URLEndpoint;
import com.couchbase.lite.ValueIndexItem;
import com.couchbase.lite.internal.core.C4ReplicatorStatus;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import io.ionic.enterprise.couchbaselite.JsonQueryBuilder;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.net.URI;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@CapacitorPlugin(name = "IonicCouchbaseLite")
public class IonicCouchbaseLitePlugin extends Plugin {

    private static final String TAG = "IonicCouchbaseLite";

    private Map<String, Database> openDatabases = new HashMap<>();
    private Map<Number, ResultSet> queryResultSets = new HashMap<>();
    private Map<Number, Replicator> replicators = new HashMap<>();
    private Map<Number, ListenerToken> replicatorListeners = new HashMap<>();
    private Map<Number, ListenerToken> documentListeners = new HashMap<>();
    private Map<String, ListenerToken> databaseChangeListeners = new HashMap<>();

    private int queryCount = 0;
    private int replicatorCount = 0;
    private int allResultsChunkSize = 256;

    @Override
    public void load() {
        CouchbaseLite.init(bridge.getContext());
    }

    private Database getDatabase(String name) {
        return this.openDatabases.get(name);
    }

    private JSObject documentToMap(Document d) {
        // Map<String, Object> docMap = new HashMap<>();
        try {
            JSONObject docJson = new JSONObject(d.toMap());

            //for (String key : documentAsMap.keySet()) {
            Iterator keys = docJson.keys();
            while (keys.hasNext()) {
                String key = (String) keys.next();
                Object value = docJson.get(key);
                if (value instanceof Blob) {
                    JSONObject blobProps = new JSONObject(((Blob) value).getProperties());
                    // JSObject blobProperties = JSObject.fromJSONObject(blobProps);
                    // finalDocumentMap.put(key, blobProps);
                    docJson.put(key, blobProps);
                }
            }

            JSObject docMap = new JSObject();
            docMap.put("_data", docJson);
            docMap.put("_id", d.getId());
            docMap.put("_sequence", d.getSequence());
            return (JSObject) docMap;
        } catch (Exception ex) {
            return null;
        }
    }

    private JSONObject json(Map<String, Object> data) {
        return new JSONObject(data);
    }

    private JSONArray jsonArray(List<Map<String, Object>> data) {
        return new JSONArray(data);
    }

    private Map<String, Object> toMap(JSONObject o) throws JSONException {
        Map<String, Object> items = new HashMap<>();

        Iterator<String> keys = o.keys();
        while (keys.hasNext()) {
            String key = keys.next();
            Object value = o.get(key);
            if (value.equals(null)) {
                items.put(key, null);
            } else if (value instanceof JSONObject) {
                JSONObject subValue = (JSONObject) value;
                String type = subValue.optString("_type");

                // Handle blobs
                if (type != null && type.equals("blob")) {
                    JSONObject blobData = subValue.getJSONObject("data");
                    String contentType = blobData.getString("contentType");
                    JSONArray byteData = blobData.getJSONArray("data");
                    byte[] data = new byte[byteData.length()];
                    for (int i = 0; i < byteData.length(); i++) {
                        data[i] = ((Integer) byteData.get(i)).byteValue();
                    }
                    items.put(key, new Blob(contentType, data));
                } else {
                    MutableDictionary d = new MutableDictionary(toMap((JSONObject) value));
                    items.put(key, d);
                }
            } else if (value instanceof JSONArray) {
                JSONArray a = (JSONArray) value;
                MutableArray ma = new MutableArray();
                for (int i = 0; i < a.length(); i++) {
                    Object ov = a.get(i);
                    if (ov.equals(null)) {
                        ma.addValue(null);
                    } else if (ov instanceof JSONObject) {
                        MutableDictionary d = new MutableDictionary(toMap((JSONObject) ov));
                        ma.addDictionary(d);
                    } else {
                        ma.addValue(ov);
                    }
                }
                items.put(key, ma);
            } else {
                items.put(key, o.get(key));
            }
        }
        return items;
    }

    private <T> String getQueryJson(T q) {
        try {
            Method method = (q.getClass().getSuperclass()).getDeclaredMethod("encodeAsJSON");
            method.setAccessible(true);
            return (String) method.invoke(q);
        } catch (Exception ex) {
        }
        return null;
    }

    public static boolean areEqual(String s1, String s2) {
        try {
            JSONObject obj1 = new JSONObject(s1);
            JSONObject obj2 = new JSONObject(s2);
            Object obj1Converted = convertJsonElement(obj1);
            Object obj2Converted = convertJsonElement(obj2);
            return obj1Converted.equals(obj2Converted);
        } catch (JSONException ex) {
        }
        return false;
    }

    private static Object convertJsonElement(Object elem) throws JSONException {
        if (elem instanceof JSONObject) {
            JSONObject obj = (JSONObject) elem;
            Iterator<String> keys = obj.keys();
            Map<String, Object> jsonMap = new HashMap<>();
            while (keys.hasNext()) {
                String key = keys.next();
                jsonMap.put(key, convertJsonElement(obj.get(key)));
            }
            return jsonMap;
        } else if (elem instanceof JSONArray) {
            JSONArray arr = (JSONArray) elem;
            Set<Object> jsonSet = new HashSet<>();
            for (int i = 0; i < arr.length(); i++) {
                jsonSet.add(convertJsonElement(arr.get(i)));
            }
            return jsonSet;
        } else {
            return elem;
        }
    }

    @PluginMethod
    public void Plugin_Configure(PluginCall call) throws JSONException, CouchbaseLiteException {
        JSObject config = call.getObject("config");
        int chunkSize = config.optInt("allResultsChunkSize", 256);
        this.allResultsChunkSize = chunkSize;
    }

    @PluginMethod
    public void File_GetDefaultPath(PluginCall call) throws JSONException {
        new Handler(Looper.getMainLooper())
                .post(() -> {
                            try {
                                Context context = bridge.getContext();
                                String defaultDirectory = context.getFilesDir().getCanonicalPath();
                                call.resolve(
                                        new JSObject() {
                                            {
                                                put("path", defaultDirectory);
                                            }
                                        }
                                );
                            } catch (Exception ex) {
                                call.reject("Unable to get default path from context", ex);
                            }
                        }
                );
    }

    @PluginMethod
    public void Database_Open(PluginCall call) throws JSONException, CouchbaseLiteException, IOException {
        String name = call.getString("name");
        JSONObject config = call.getObject("config");
        Log.d(TAG, "Opening database: " + name);

        DatabaseConfiguration c = new DatabaseConfiguration();

        if (config != null) {
            String directory = config.optString("directory", null);
            String encKey = config.optString("encryptionKey", null);
            if (directory == null) {
                Context context = bridge.getContext();
                String defaultDirectory = context.getFilesDir().getCanonicalPath();
                c.setDirectory(defaultDirectory);
            } else {
                c.setDirectory(directory);
            }
            if (encKey != null && !encKey.isBlank() && !encKey.isBlank()) {
                c.setEncryptionKey(new EncryptionKey(encKey));
            }
        }
        new Handler(Looper.getMainLooper())
                .post(
                        () -> {
                            try {
                                Database d = new Database(name, c);
                                this.openDatabases.put(name, d);
                                call.resolve();
                            } catch (Exception ex) {
                                call.reject("Unable to open database", ex);
                            }
                        }
                );
    }

    @PluginMethod
    public void Database_Exists(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }
        try {
            String existsName = call.getString("existsName");
            String directory = call.getString("directory");
            boolean exists = d.exists(existsName, new File(directory));
            call.resolve(
                    new JSObject() {
                        {
                            put("exists", exists);
                        }
                    }
            );
        } catch (Exception ex) {
            call.reject("Unable to check if database exists", ex);
        }
    }

    @SuppressWarnings("unused")
    @PluginMethod
    public void Database_Save(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        String id = call.getString("id");
        JSObject document = call.getObject("document");
        int concurrencyControlValue = call.getInt("concurrencyControl", ConcurrencyControl.LAST_WRITE_WINS.getValue());
        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }

        try {
            ConcurrencyControl concurrencyControl = makeConcurrencyControl(concurrencyControlValue);

            MutableDocument m;
            if (id != null) {
                m = new MutableDocument(id, toMap(document));
            } else {
                m = new MutableDocument(toMap(document));
            }

            d.save(m, concurrencyControl);

            call.resolve(
                    new JSObject() {
                        {
                            put("_id", m.getId());
                        }
                    }
            );
        } catch (Exception ex) {
            call.reject("Unable to save document", ex);
        }
    }

    private ConcurrencyControl makeConcurrencyControl(int concurrencyControlValue) {
        switch (concurrencyControlValue) {
            case 0:
                return ConcurrencyControl.LAST_WRITE_WINS;
            case 1:
                return ConcurrencyControl.FAIL_ON_CONFLICT;
        }
        return ConcurrencyControl.LAST_WRITE_WINS;
    }

    @SuppressWarnings("unused")
    @PluginMethod
    public void Database_GetCount(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }
        try {
            call.resolve(
                    new JSObject() {
                        {
                            put("count", d.getCount());
                        }
                    }
            );
        } catch (Exception ex) {
            call.reject("Error getting count", ex);
        }
    }

    @PluginMethod
    public void Database_GetPath(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }
        try {
            call.resolve(
                    new JSObject() {
                        {
                            put("path", d.getPath());
                        }
                    }
            );
        } catch (Exception ex) {
            call.reject("Error getting path", ex);
        }
    }

    @PluginMethod
    public void Database_Copy(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }
        String path = call.getString("path");
        String name2 = call.getString("newName");
        Database targetDb = null;
        JSONObject config = call.getObject("config");

        DatabaseConfiguration c = new DatabaseConfiguration();

        String directory = config.optString("directory", null);

        String encKey = config.optString("encryptionKey", null);
        if (directory != null) {
            c.setDirectory(directory);
        }
        if (encKey != null) {
            c.setEncryptionKey(new EncryptionKey(encKey));
        }

        try {
            Database.copy(new File(path), name2, c);
            call.resolve();
        } catch (Exception ex) {
            call.reject("Error copying database", ex);
        }
    }

    @PluginMethod
    public void Database_CreateIndex(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }

        try {
            String indexName = call.getString("indexName");
            JSONObject indexData = call.getObject("index");

            String type = indexData.getString("type");
            JSONArray items = indexData.getJSONArray("items");

            Index index = null;

            if (type.equals("value")) {
                index = IndexBuilder.valueIndex(makeValueIndexItems(items));
            } else if (type.equals("full-text")) {
                index = IndexBuilder.fullTextIndex(makeFullTextIndexItems(items));
            }
            d.createIndex(indexName, index);
            call.resolve();
        } catch (Exception ex) {
            call.reject("Error creating index", ex);
        }
    }

    ValueIndexItem[] makeValueIndexItems(JSONArray items) throws JSONException {
        List<ValueIndexItem> valueItems = new ArrayList<>();

        for (int i = 0; i < items.length(); i++) {
            JSONArray item = items.getJSONArray(i);
            String strEntry = item.getString(0);
            String propName = strEntry.substring(1);
            valueItems.add(ValueIndexItem.property(propName));
        }
        return valueItems.toArray(new ValueIndexItem[0]);
    }

    FullTextIndexItem[] makeFullTextIndexItems(JSONArray items) throws JSONException {
        List<FullTextIndexItem> valueItems = new ArrayList<>();

        for (int i = 0; i < items.length(); i++) {
            JSONArray item = items.getJSONArray(i);
            String strEntry = item.getString(0);
            String propName = strEntry.substring(1);
            valueItems.add(FullTextIndexItem.property(propName));
        }
        return valueItems.toArray(new FullTextIndexItem[0]);
    }

    @PluginMethod
    public void Database_DeleteIndex(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }
        try {
            String indexName = call.getString("indexName");
            d.deleteIndex(indexName);
            call.resolve();
        } catch (Exception ex) {
            call.reject("Error deleting index", ex);
        }
    }

    @PluginMethod
    public void Database_GetIndexes(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }
        try {
            call.resolve(
                    new JSObject() {
                        {
                            put("indexes", new JSArray(d.getIndexes()));
                        }
                    }
            );
        } catch (Exception ex) {
            call.reject("Error getting indexes", ex);
        }
    }

    @SuppressWarnings("unused")
    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void Database_AddChangeListener(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        String token = call.getString("changeListenerToken");

        if (name == null || token == null) {
            call.reject("error: arguments missing");
            return;
        }

        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }

        call.setKeepAlive(true);

        try {
        ListenerToken listenerToken = d.addChangeListener(
                    new DatabaseChangeListener() {
                        @Override
                        public void changed(DatabaseChange change) {
                            JSObject ret = new JSObject();
                            ret.put("documentIDs", new JSONArray(change.getDocumentIDs()));
                            call.resolve(ret);
                        }
                    }
            );
        //keep track of listener so we can remove it in the remove method
        this.databaseChangeListeners.put(token, listenerToken);
        } catch (Exception ex) {
            call.reject("Unable to add listener", ex);
        }
    }

    @PluginMethod
    public void Database_RemoveChangeListener(PluginCall call) {
        String name = call.getString("name");
        String token = call.getString("changeListenerToken");

        if (name == null || token == null) {
            call.reject("error: arguments missing");
            return;
        }

        Database database = getDatabase(name);
        if (database == null) {
            call.reject("No such database");
            return;
        }
        try {
            ListenerToken listenerToken = this.databaseChangeListeners.get(token);
            if (listenerToken != null) {
                database.removeChangeListener(listenerToken);
            }
        }catch (Exception ex){
            call.reject("Unable to remove listener", ex);
        }
       call.resolve();
    }

    @PluginMethod
    public void Database_Close(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }

        try {
            d.close();
        } finally {
            openDatabases.remove(d);
        }

        call.resolve();
    }

    @PluginMethod
    public void Database_Delete(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database d = getDatabase(name);
        if (d == null) {
            call.reject("No such database");
            return;
        }

        new Handler(Looper.getMainLooper())
                .post(
                        () -> {
                            try {
                                d.delete();
                                this.openDatabases.remove(d);
                                call.resolve();
                            } catch (Exception ex) {
                                call.reject("Unable to delete database", ex);
                            }
                        }
                );
    }

    @PluginMethod
    public void Database_DeleteDocument(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        String id = call.getString("docId");
        Database db = this.openDatabases.get(name);
        JSObject document = call.getObject("document");
        int concurrencyControlValue = call.getInt("concurrencyControl", ConcurrencyControl.LAST_WRITE_WINS.getValue());
        ConcurrencyControl concurrencyControl = makeConcurrencyControl(concurrencyControlValue);

        Document d = db.getDocument(id);

        if (d == null) {
            call.reject("No such document");
            return;
        }

        try {
            db.delete(d, concurrencyControl);
            call.resolve();
        } catch (Exception ex) {
            call.reject("Unable to delete document", ex);
        }
    }

    @PluginMethod
    public void Database_PurgeDocument(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        String id = call.getString("docId");
        Database db = this.openDatabases.get(name);

        try {
            db.purge(id);
        } catch (Exception ex) {
            call.reject("Unable to purge document", ex);
        }

        call.resolve();
    }

    @SuppressWarnings("unused")
    @PluginMethod
    public void Database_Compact(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database db = this.openDatabases.get(name);

        try {
            if (db != null) {
                //Fix for 3.x call
                db.performMaintenance(MaintenanceType.COMPACT);
            }
        } catch (Exception ex) {
            call.reject("Unable to compact", ex);
        }

        call.resolve();
    }

    @PluginMethod
    public void Database_GetDocument(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database db = this.openDatabases.get(name);
        String documentId = call.getString("docId");
        try {
            Document d = db.getDocument(documentId);
            if (d != null) {
                JSObject doc = documentToMap(d);
                call.resolve(doc);
            } else {
                call.resolve(null);
            }
        } catch (Exception ex) {
            call.reject("Unable to get document", ex);
        }
    }

    @PluginMethod
    public void Database_SetLogLevel(PluginCall call) throws JSONException, CouchbaseLiteException {
        String domain = call.getString("domain");
        int logLevelValue = call.getInt("logLevel");
        LogLevel logLevel = getLogLevel(logLevelValue);

        try {
            //TODO fix logging for 3.x
            if (domain.equals("ALL")){
                Database.log.getConsole().setDomains(LogDomain.ALL_DOMAINS);
            } else {
                Database.log.getConsole().setDomains(LogDomain.valueOf(domain));
            }
            Database.log.getConsole().setLevel(logLevel);
            call.resolve(null);
        } catch (Exception ex) {
            call.reject("Unable to get document", ex);
        }
    }

    private LogLevel getLogLevel(int logLevelValue) {
        switch (logLevelValue) {
            case 0:
                return LogLevel.DEBUG;
            case 1:
                return LogLevel.VERBOSE;
            case 2:
                return LogLevel.INFO;
            case 3:
                return LogLevel.WARNING;
            case 4:
                return LogLevel.ERROR;
            case 5:
                return LogLevel.NONE;
        }
        return LogLevel.DEBUG;
    }

    @PluginMethod
    public void Database_SetFileLoggingConfig(PluginCall call) throws JSONException, CouchbaseLiteException {
        try {
            String name = call.getString("name");
            Database db = this.openDatabases.get(name);

            JSObject config = call.getObject("config");

            Object levelValue = config.opt("level");

            String directory = config.getString("directory");
            Integer maxRotateCount = config.optInt("maxRotateCount", -1);
            Integer maxSize = config.optInt("maxSize", -1);
            Object usePlaintext = config.opt("usePlaintext");

            LogFileConfiguration fileConfig = new LogFileConfiguration(directory);
            if (maxRotateCount >= 0) {
                fileConfig.setMaxRotateCount(maxRotateCount);
            }
            if (maxSize >= 0) {
                fileConfig.setMaxSize(maxSize);
            }
            if (usePlaintext != null) {
                fileConfig.setUsePlaintext((Boolean) usePlaintext);
            }

            db.log.getFile().setConfig(fileConfig);

            if (levelValue != null) {
                LogLevel logLevel = getLogLevel((int) levelValue);
                db.log.getFile().setLevel(logLevel);
            }
        } catch (Exception ex) {
            call.reject("Unable to set file logging config", ex);
        }
        call.resolve(null);
    }

    @PluginMethod
    public void Document_GetBlobContent(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database db = this.openDatabases.get(name);
        String documentId = call.getString("documentId");
        String key = call.getString("key");

        try {
            Document d = db.getDocument(documentId);

            if (d != null) {
                Blob b = d.getBlob(key);
                byte[] content = b.getContent();
                JSObject ret = new JSObject();
                ret.put("data", new JSONArray(content));
                call.resolve(ret);
            } else {
                call.resolve(null);
            }
        } catch (Exception ex) {
            call.reject("Unable to get blob content", ex);
        }
    }

    private Map<String, Object> blobToDictionary(Blob b) {
        Map<String, Object> data = new HashMap<>();
        data.put("contentType", b.getContentType());
        data.put("data", b.getContent());
        return data;
    }

    @SuppressWarnings("unused")
    @PluginMethod
    public void Query_Execute(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        JSObject query = call.getObject("query");
        String queryJson = query.toString();
        Database db = this.openDatabases.get(name);

        try {
            Query q = JsonQueryBuilder.buildQuery(db, queryJson);
            ResultSet rs = q.execute();
            Log.d(TAG, "Built query: " + q);

            int id = queryCount++;

            this.queryResultSets.put(id, rs);

            call.resolve(
                    new JSObject() {
                        {
                            put("id", id);
                        }
                    }
            );
        } catch (Exception ex) {
            call.reject("Unable to execute query", ex);
        }
    }

    @PluginMethod
    public void ResultSet_Next(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        int id = call.getInt("resultSetId");

        try {
            ResultSet r = this.queryResultSets.get(id);
            if (r == null) {
                call.resolve(new JSObject());
                return;
            }
            Log.d(TAG, "Moving to next result...");
            Result result = r.next();
            if (result == null) {
                Log.d(TAG, "No results");
                call.resolve(null);
                return;
            }
            Map<String, Object> resultsMap = result.toMap();
            Map<String, Object> data = processResultMap(resultsMap);
            if (data.containsKey("_id")) {
                data.put("id", data.get("_id"));
                data.remove("_id");
            }
            if (data.containsKey("_sequence")) {
                data.put("sequence", data.get("_sequence"));
                data.remove("_sequence");
            }
            if (data.containsKey("_deleted")) {
                data.put("deleted", data.get("_deleted"));
                data.remove("_deleted");
            }
            if (data.containsKey("_expiration")) {
                data.put("expiration", data.get("_expiration"));
                data.remove("_expiration");
            }

            JSObject ret = JSObject.fromJSONObject(new JSONObject(data));
            call.resolve(ret);
        } catch (Exception ex) {
            call.reject("Unable to move result set next", ex);
        }
    }

    private Map<String, Object> processResultMap(Map<String, Object> map) {
        Map<String, Object> newMap = new HashMap<>();
        String commonAlias = null;
        Pattern commonPattern = Pattern.compile("(.*)\\.$");

        for (String key : map.keySet()) {
            Matcher m = commonPattern.matcher(key);
            if (m.find()) {
                String foundAlias = m.group(1);
                newMap.put(foundAlias, map.get(key));
            } else {
                newMap.put(key, map.get(key));
            }
        }

        return newMap;
    }

    @PluginMethod
    public void ResultSet_NextBatch(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        int id = call.getInt("resultSetId");
        ResultSet r = this.queryResultSets.get(id);
        if (r == null) {
            call.resolve(new JSObject());
            return;
        }
        try {
            int chunkSize = allResultsChunkSize;
            List<Map<String, Object>> resultsChunk = new ArrayList<>(chunkSize);

            Log.d(TAG, "Moving to next result...");
            Result result;
            int i = 0;
            while (i++ < chunkSize && ((result = r.next()) != null)) {
                Map<String, Object> resultMap = result.toMap();
                Map<String, Object> data = processResultMap(resultMap);
                if (data.containsKey("_id")) {
                    data.put("id", data.get("_id"));
                    data.remove("_id");
                }
                if (data.containsKey("_sequence")) {
                    data.put("sequence", data.get("_sequence"));
                    data.remove("_sequence");
                }
                if (data.containsKey("_deleted")) {
                    data.put("deleted", data.get("_deleted"));
                    data.remove("_deleted");
                }
                if (data.containsKey("_expiration")) {
                    data.put("expiration", data.get("_expiration"));
                    data.remove("_expiration");
                }
                resultsChunk.add(data);
            }

            call.resolve(
                    new JSObject() {
                        {
                            put("results", new JSArray(resultsChunk));
                        }
                    }
            );
        } catch (Exception ex) {
            call.reject("Unable to move result set next", ex);
        }
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void ResultSet_AllResults(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        int id = call.getInt("resultSetId");
        ResultSet r = this.queryResultSets.get(id);
        if (r == null) {
            call.resolve(new JSObject());
            return;
        }

        call.setKeepAlive(true);

        int chunkSize = this.allResultsChunkSize;

        List<Map<String, Object>> resultsChunk = null;

        int i = 0;
        Result queryResult;
        while ((queryResult = r.next()) != null) {
            if (i % chunkSize == 0) {
                if (resultsChunk != null) {
                    JSArray results = new JSArray(resultsChunk);
                    call.resolve(
                            new JSObject() {
                                {
                                    put("results", results);
                                }
                            }
                    );
                    resultsChunk.clear();
                } else {
                    resultsChunk = new ArrayList<>(chunkSize);
                }
            }
            Map<String, Object> queryResultMap = queryResult.toMap();
            Map<String, Object> data = processResultMap(queryResultMap);
            if (data.containsKey("_id")) {
                data.put("id", data.get("_id"));
                data.remove("_id");
            }
            if (data.containsKey("_sequence")) {
                data.put("sequence", data.get("_sequence"));
                data.remove("_sequence");
            }
            if (data.containsKey("_deleted")) {
                data.put("deleted", data.get("_deleted"));
                data.remove("_deleted");
            }
            if (data.containsKey("_expiration")) {
                data.put("expiration", data.get("_expiration"));
                data.remove("_expiration");
            }

            resultsChunk.add(data);
            i++;
        }

        if (resultsChunk != null && resultsChunk.size() > 0) {
            JSArray results = new JSArray(resultsChunk);
            call.resolve(
                    new JSObject() {
                        {
                            put("results", results);
                        }
                    }
            );
        }

        call.resolve(
                new JSObject() {
                    {
                        put("results", new JSArray());
                    }
                }
        );
    }

    @PluginMethod
    public void ResultSet_Cleanup(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        int id = call.getInt("resultSetId");
        ResultSet r = this.queryResultSets.get(id);
        if (r == null) {
            call.resolve(new JSObject());
            return;
        }

        this.queryResultSets.remove(r);

        call.resolve();
    }

    @PluginMethod
    public void Replicator_Create(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database db = this.openDatabases.get(name);
        JSObject config = call.getObject("config");
        try {
            ReplicatorConfiguration replicatorConfig = replicatorConfigFromJson(db, config);
            Replicator r = new Replicator(replicatorConfig);

            int id = replicatorCount++;
            this.replicators.put(id, r);
            call.resolve(
                    new JSObject() {
                        {
                            put("replicatorId", id);
                        }
                    }
            );
        } catch (Exception ex) {
            call.reject("Error creating replicator: " + ex.getMessage());
        }
    }

    @PluginMethod
    public void Replicator_Start(PluginCall call) throws JSONException, CouchbaseLiteException {
        int replicatorId = call.getInt("replicatorId");
        Replicator r = this.replicators.get(replicatorId);
        if (r == null) {
            call.reject("No such replicator");
            return;
        }
        r.start();
        call.resolve();
    }

    @PluginMethod
    public void Replicator_Stop(PluginCall call) throws JSONException, CouchbaseLiteException {
        int replicatorId = call.getInt("replicatorId");
        Replicator r = this.replicators.get(replicatorId);
        if (r == null) {
            call.reject("No such replicator");
            return;
        }
        r.stop();
        call.resolve();
    }

    @PluginMethod
    public void Replicator_ResetCheckpoint(PluginCall call) throws JSONException, CouchbaseLiteException {
        int replicatorId = call.getInt("replicatorId");
        Replicator r = this.replicators.get(replicatorId);
        if (r == null) {
            call.reject("No such replicator");
            return;
        }
        //make sure we don't kill the replicator in order to reset a checkpoint.
        //TODO fix for 3.0 support
        ReplicatorStatus status = r.getStatus();
        ReplicatorActivityLevel activityLevel = status.getActivityLevel();
        if (activityLevel == ReplicatorActivityLevel.IDLE ||
                activityLevel == ReplicatorActivityLevel.OFFLINE ||
                activityLevel == ReplicatorActivityLevel.STOPPED) {
            r.stop();
            r.start(true);
            call.resolve();
        }
        call.reject("Invalid replicator state to create checkpoint");
    }

    @PluginMethod
    public void Replicator_GetStatus(PluginCall call) throws JSONException, CouchbaseLiteException {
        int replicatorId = call.getInt("replicatorId");
        Replicator r = this.replicators.get(replicatorId);
        if (r == null) {
            call.reject("No such replicator");
            return;
        }

        //
        //TODO fix for 3.0 support as replicator status API has changed
        ReplicatorStatus status = r.getStatus();
        JSObject statusJson = generateStatusJson(status);

        call.resolve(statusJson);
    }

    private JSObject generateStatusJson(ReplicatorStatus status) {
        CouchbaseLiteException error = status.getError();
        JSObject errorJson = new JSObject();
        if (error != null) {
            try {
                errorJson.put("code", error.getCode());
                errorJson.put("domain", error.getDomain());
                errorJson.put("info", error.getInfo());
            } catch (Exception ex) {
            }
        }
        //
        ReplicatorProgress progress = status.getProgress();
        JSONObject progressJson = new JSONObject();
        if (progress != null) {
            try {
                progressJson.put("completed", progress.getCompleted());
                progressJson.put("total", progress.getTotal());
            } catch (Exception ex) {
            }
        }

        int activityLevel = 0;
        ReplicatorActivityLevel av = status.getActivityLevel();
        activityLevel = av.ordinal();

        final int activityLevelVal = activityLevel;

        return new JSObject() {
            {
                put("activityLevel", activityLevelVal);
                put("error", errorJson);
                put("progress", progressJson);
            }
        };
    }

    private JSObject generateDocumentReplicationJson(DocumentReplication replication) {
        JSObject replicationJson = new JSObject();

        try {
            replicationJson.put("direction", replication.isPush() ? "PUSH" : "PULL");

            JSONArray documentsJson = new JSONArray();
            for (ReplicatedDocument replicatedDocument : replication.getDocuments()) {
                JSONObject document = new JSONObject();

                CouchbaseLiteException error = replicatedDocument.getError();
                if (error != null) {
                    JSONObject errorJson = new JSONObject();

                    try {
                        errorJson.put("code", error.getCode());
                        errorJson.put("domain", error.getDomain());
                        errorJson.put("message", error.getMessage());
                    } catch (Exception ex) {
                    }

                    document.put("error", errorJson);
                }

                //TODO fix 3.0 issue with flags
                JSONArray flags = new JSONArray();
                if (replicatedDocument.getFlags().contains(DocumentFlag.DELETED)) {
                    flags.put("DELETED");
                }

                if (replicatedDocument.getFlags().contains(DocumentFlag.ACCESS_REMOVED)) {
                    flags.put("ACCESS_REMOVED");
                }

                document.put("flags", flags);
                document.put("id", replicatedDocument.getID());

                documentsJson.put(document);
            }

            replicationJson.put("documents", documentsJson);
        } catch (Exception ex) {
        }

        return replicationJson;
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void Replicator_AddChangeListener(PluginCall call) throws JSONException, CouchbaseLiteException {
        int replicatorId = call.getInt("replicatorId");
        Replicator r = this.replicators.get(replicatorId);
        if (r == null) {
            call.reject("No such replicator");
            return;
        }

        call.setKeepAlive(true);

        ListenerToken token = r.addChangeListener(
                new ReplicatorChangeListener() {
                    @Override
                    public void changed(ReplicatorChange change) {
                        JSObject statusJson = generateStatusJson(change.getStatus());
                        call.resolve(statusJson);
                    }
                }
        );

        replicatorListeners.put(replicatorId, token);
    }

    @PluginMethod(returnType = PluginMethod.RETURN_CALLBACK)
    public void Replicator_AddDocumentListener(PluginCall call) throws JSONException, CouchbaseLiteException {
        int replicatorId = call.getInt("replicatorId");
        Replicator r = this.replicators.get(replicatorId);
        if (r == null) {
            call.reject("No such replicator");
            return;
        }

        call.setKeepAlive(true);

        ListenerToken token = r.addDocumentReplicationListener(
                new DocumentReplicationListener() {
                    @Override
                    public void replication(@NonNull DocumentReplication replication) {
                        JSObject replicationJson = generateDocumentReplicationJson(replication);
                        call.resolve(replicationJson);
                    }
                }
        );

        documentListeners.put(replicatorId, token);
    }

    @PluginMethod
    public void Replicator_Cleanup(PluginCall call) throws JSONException, CouchbaseLiteException {
        int replicatorId = call.getInt("replicatorId");
        Replicator r = this.replicators.get(replicatorId);
        if (r == null) {
            call.reject("No such replicator");
            return;
        }

        ListenerToken token = replicatorListeners.get(replicatorId);

        if (token != null) {
            r.removeChangeListener(token);
            replicatorListeners.remove(replicatorId);
        }

        token = documentListeners.get(replicatorId);

        if (token != null) {
            r.removeChangeListener(token);
            documentListeners.remove(replicatorId);
        }

        replicators.remove(replicatorId);

        call.resolve();
    }

    @PluginMethod
    public void Replicator_Restart(PluginCall call) throws JSONException, CouchbaseLiteException {
        int replicatorId = call.getInt("replicatorId");
        Replicator r = this.replicators.get(replicatorId);
        if (r != null) {
            r.start();
        }

        call.resolve();
    }

    // Utilities

    private ReplicatorConfiguration replicatorConfigFromJson(Database db, JSONObject json) throws Exception {
        JSONObject authenticatorData = json.getJSONObject("authenticator");
        String authenticatorType = authenticatorData.getString("type");
        String replicatorType = json.getString("replicatorType");
        boolean continuous = json.getBoolean("continuous");

        JSONObject target = json.getJSONObject("target");
        if (target == null) {
            throw new CouchbaseLiteException("No target specified for replicator");
        }

        String url = target.getString("url");
        Endpoint endpoint = new URLEndpoint(new URI(url));
        ReplicatorConfiguration config = new ReplicatorConfiguration(db, endpoint);

        JSONArray channelJSONArray = json.optJSONArray("channels");
        if (channelJSONArray != null) {
            List<String> channels = new ArrayList<String>();
            for (int i = 0; i < channelJSONArray.length(); i++) {
                channels.add(channelJSONArray.getString(i));
            }
            config.setChannels(channels);
        }

        if (replicatorType.equals("PUSH_AND_PULL")) {
            config.setReplicatorType(ReplicatorConfiguration.ReplicatorType.PUSH_AND_PULL);
        } else if (replicatorType.equals("PUSH")) {
            config.setReplicatorType(ReplicatorConfiguration.ReplicatorType.PUSH);
        } else if (replicatorType.equals("PULL")) {
            config.setReplicatorType(ReplicatorConfiguration.ReplicatorType.PULL);
        }

        config.setContinuous(continuous);

        Authenticator authenticator = this.replicatorAuthenticatorFromConfig(authenticatorData);

        if (authenticator != null) {
            config.setAuthenticator(authenticator);
        }

        return config;
    }

    private Authenticator replicatorAuthenticatorFromConfig(JSONObject config) throws JSONException {
        String type = config.getString("type");
        JSONObject data = config.getJSONObject("data");
        if (type.equals("session")) {
            String sessionID = data.getString("sessionID");
            String cookieName = data.getString("cookieName");
            return new SessionAuthenticator(sessionID, cookieName);
        }

        if (type.equals("basic")) {
            String username = data.getString("username");
            String password = data.getString("password");
            //todo fix require password as a char array instead of a string
            return new BasicAuthenticator(username, password.toCharArray());
        }

        return null;
    }

    @PluginMethod
    public void TestJoinQuery(PluginCall call) throws JSONException, CouchbaseLiteException {
        Database db = this.getDatabase("thedb3");
        MutableDocument locationDoc = new MutableDocument()
                .setString("name", "Madison")
                .setString("type", "location");
        db.save(locationDoc);

        MutableDocument categoryDoc = new MutableDocument()
                .setString("name", "Expensive")
                .setString("type", "expensive");
        db.save(categoryDoc);

        MutableDocument hotelDoc = new MutableDocument()
                .setString("name", "Escape")
                .setString("type", "hotel")
                .setString("hotel_locations_thing", "what")
                .setString("location_id", locationDoc.getId())
                .setString("category_id", categoryDoc.getId());
        db.save(hotelDoc);

        Query query = QueryBuilder.select(
                        // SelectResult.all().from('hotel_locations'),
                        SelectResult.expression(Meta.id.from("categories")),
                        SelectResult.expression(Expression.property("name").from("locations")),
                        SelectResult.expression(Meta.id.from("locations")),
                        SelectResult.expression(Meta.id.from("hotels"))
                )
                .from(DataSource.database(db).as("hotels"))
                .join(
                        Join.join(DataSource.database(db).as("locations")).on(
                                Meta.id
                                        .from("locations")
                                        .equalTo(Expression.property("location_id").from("hotels"))
                        ),
                        Join.join(DataSource.database(db).as("categories")).on(
                                Meta.id
                                        .from("categories")
                                        .equalTo(Expression.property("category_id").from("hotels"))
                        )
                )
                .where(
                        Expression.property("type")
                                .from("hotels")
                                .equalTo(Expression.string("hotel"))
                                .and(
                                        Expression.property("type")
                                                .from("locations")
                                                .equalTo(Expression.string("location"))
                                )

                );

        ResultSet rs = query.execute();
        List<Result> results = rs.allResults();
        call.resolve();
    }
}
