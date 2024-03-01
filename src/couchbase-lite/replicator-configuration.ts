import { Authenticator } from './authenticator';
import { Database } from "./database";
import { Endpoint } from "./endpoint";

export enum ReplicatorType {
  PUSH_AND_PULL = 'PUSH_AND_PULL',
  PUSH = 'PUSH',
  PULL = 'PULL'
}

export class ReplicatorConfiguration {
  static readonly ReplicatorType = ReplicatorType;

  // Replicator option dictionary keys:
  static kC4ReplicatorOptionExtraHeaders = "headers";  // Extra HTTP headers; string[]
  static kC4ReplicatorOptionCookies = "cookies";  // HTTP Cookie header value; string
  static kCBLReplicatorAuthOption = "auth";       // Auth settings; Dict
  static kC4ReplicatorOptionPinnedServerCert = "pinnedCert";  // Cert or public key; data
  static kC4ReplicatorOptionDocIDs = "docIDs";   // Docs to replicate; string[]
  static kC4ReplicatorOptionChannels = "channels";// SG channel names; string[]
  static kC4ReplicatorOptionFilter = "filter";   // Filter name; string
  static kC4ReplicatorOptionFilterParams = "filterParams";  // Filter params; Dict[string]
  static kC4ReplicatorOptionSkipDeleted = "skipDeleted"; // Don't push/pull tombstones; bool
  static kC4ReplicatorOptionNoConflicts = "noConflicts"; // Puller rejects conflicts; bool
  static kC4ReplicatorCheckpointInterval = "checkpointInterval"; // How often to checkpoint, in seconds; number
  static kC4ReplicatorOptionRemoteDBUniqueID = "remoteDBUniqueID"; // How often to checkpoint, in seconds; number
  static kC4ReplicatorResetCheckpoint = "reset"; // reset remote checkpoint

  // Auth dictionary keys:
  static kC4ReplicatorAuthType = "type"; // Auth property; string
  static kCBLReplicatorAuthUserName = "username"; // Auth property; string
  static kCBLReplicatorAuthPassword = "password"; // Auth property; string
  static kC4ReplicatorAuthClientCert = "clientCert"; // Auth property; value platform-dependent

  // auth.type values:
  static kC4AuthTypeBasic = "Basic"; // HTTP Basic (the default)
  static kC4AuthTypeSession = "Session"; // SG session cookie
  static kC4AuthTypeOpenIDConnect = "OpenID Connect";
  static kC4AuthTypeFacebook = "Facebook";
  static kC4AuthTypeClientCert = "Client Cert";

  private readonly = false;
  private continuous = false;
  private replicatorType: ReplicatorType;
  private authenticator: Authenticator;
  private pinnedServerCertificate: Int8Array;
  private channels: string[];
  private documentIds: string[];
  private headers: { [name:string]: string };

  constructor(private database: Database, private target: Endpoint) {
    this.readonly = false;
    this.replicatorType = ReplicatorType.PUSH_AND_PULL;
    this.database = database;
    this.target = target;
  }

  getDatabase() {
    return this.database;
  }

  setReplicatorType(replicatorType: ReplicatorType) {
    this.replicatorType = replicatorType;
  }

  setContinuous(continuous: boolean) {
    this.continuous = continuous;
  }

  setAuthenticator(authenticator: Authenticator) {
    this.authenticator = authenticator;
  }

  setPinnedServerCertificate(pinnedServerCertificate: Int8Array) {
    this.pinnedServerCertificate = pinnedServerCertificate;
  }

  setHeaders(headers: { [name:string]: string }) {
    this.headers = headers;
  }

  setChannels(channels: string[]) {
    this.channels = channels;
  }

  setDocumentIDs(documentIds: string[]) {
    this.documentIds = documentIds;
  }
  
  toJson() {
    return {
      replicatorType: this.replicatorType,
      continuous: this.continuous,
      authenticator: { type: this.authenticator.getType(), data: this.authenticator.toJson() },
      target: this.target.toJson(),
      headers: this.headers,
      pinnedServerCertificate: this.pinnedServerCertificate,
      channels: this.channels,
      documentIds: this.documentIds
    }
  }
}