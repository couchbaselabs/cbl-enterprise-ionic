#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(IonicCouchbaseLite, "IonicCouchbaseLite",
           CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Plugin_Configure, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_Open, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_Exists, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_Save, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_GetCount, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_GetPath, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_Copy, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_CreateIndex, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_DeleteIndex, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_GetIndexes, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_AddChangeListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(Database_Close, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_Delete, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_DeleteDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_PurgeDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_Compact, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_GetDocument, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_SetLogLevel, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_GetLogLevel, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_GetLogDomain, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Database_SetFileLoggingConfig, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Document_GetBlobContent, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Query_Execute, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(ResultSet_Next, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(ResultSet_NextBatch, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(ResultSet_AllResults, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(ResultSet_AllResults2, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(ResultSet_Cleanup, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Replicator_Create, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Replicator_Start, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Replicator_Stop, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Replicator_ResetCheckpoint, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Replicator_GetStatus, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Replicator_AddChangeListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(Replicator_AddDocumentListener, CAPPluginReturnCallback);
           CAP_PLUGIN_METHOD(Replicator_Cleanup, CAPPluginReturnPromise);
           CAP_PLUGIN_METHOD(Replicator_Restart, CAPPluginReturnPromise);
)
