#import <UIKit/UIKit.h>
#import <Capacitor/CAPPlugin.h>
#import <Capacitor/CAPBridgedPlugin.h>
#import <CouchbaseLite/CouchbaseLite.h>

@class CAPPluginCall;

@interface IonicCouchbaseLite : CAPPlugin <CAPBridgedPlugin>

@end

@interface CustomQuery : CBLQuery {
}
@end
