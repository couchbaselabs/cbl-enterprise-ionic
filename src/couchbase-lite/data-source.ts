import { Database } from "./database";

export class DataSource {
  private alias: string = null;

  constructor(private source: any) {
  }

  static database(database: Database): DataSourceAs {
    return new DataSourceAs(database);
  }

  getSource() {
    return this.source;
  }

  getAlias() {
    return this.alias;
  }

  setAlias(alias: string) {
    this.alias = alias;
  }

  getColumnName() {
    if (this.alias) {
      return this.alias;
    }

    if (this.source && (this.source as Database).getName) {
      return (this.source as Database).getName();
    }
    return null;
  }

  asJSON() {
    if (this.alias) {
      return {
        "AS": this.alias
      }
    }

    return {};
  }
}

export class DataSourceAs extends DataSource {
  constructor(source: Database) {
    super(source);
  }

  as(alias: string): DataSource {
    this.setAlias(alias);
    return this;
  }
}