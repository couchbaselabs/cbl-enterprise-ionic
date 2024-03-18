import { DataSource } from './data-source';
import { Expression } from './expression';

export class Join {
  static kCBLInnerJoin = "INNER";
  static kCBLOuterJoin = "OUTER";
  static kCBLLeftOuterJoin = "LEFT OUTER";
  static kCBLCrossJoin = "CROSS";

  constructor(protected type: string, protected dataSource: DataSource) {
  }

  static join(dataSource: DataSource) {
    return this.innerJoin(dataSource);
  }

  static leftJoin(dataSource: DataSource) {
    return new JoinOn(Join.kCBLLeftOuterJoin, dataSource);
  }

  static leftOuterJoin(dataSource: DataSource) {
    return new JoinOn(Join.kCBLLeftOuterJoin, dataSource);
  }

  static innerJoin(dataSource: DataSource) {
    return new JoinOn(Join.kCBLInnerJoin, dataSource);
  }

  static crossJoin(dataSource: DataSource) {
    return new JoinOn(Join.kCBLCrossJoin, dataSource);
  }

  asJSON(): any {
    return {
      "JOIN": this.type,
      ...this.dataSource.asJSON()
    };
  }
}

export class JoinOn extends Join {
  private _on: Expression;

  constructor(_type: string, _dataSource: DataSource) {
    super(_type, _dataSource);
  }

  on(expression: Expression) {
    this._on = expression;
    return this;
  }

  asJSON() {
    return {
      'JOIN': this.type,
      'ON': this._on.asJSON(),
      ...this.dataSource.asJSON()
    }
  }
}