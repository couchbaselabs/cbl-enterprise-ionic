import { ResultSet } from './result-set';
import { ListenerToken, Database } from './database';
import { Parameters } from './parameters';
import { DataSource } from './data-source';
import { Select } from './select';
import { OrderBy } from './order-by';
import { Having } from './having';
import { GroupBy } from './group-by';
import { Expression, PropertyExpression } from './expression';
import { Joins } from './joins';
import { Limit } from './limit';
import { From } from './from';
import { Where } from './where';

export class QueryChange {
  _error: Error;
  _query: Query;
  _results: ResultSet;

  getError(): Error {
    return this._error;
  }
  getQuery(): Query {
    return this._query;
  }
  getResults(): ResultSet {
    return this._results;
  }
}

export type QueryChangeListener = (change: QueryChange) => void;

/**
 * A database query used for querying data from the database.
 * The query statement of the Query object can be fluently constructed by calling the static select methods.
 */
export abstract class Query {
  private parameters: Parameters;

  private columnNames: { [name: string]: any } = null;

  // SELECT
  private _select: Select;
  // FROM
  private _from: DataSource; // FROM table-or-subquery
  private _joins: Joins; // FROM join-clause
  // WHERE
  private _where: Expression; // WHERE expr
  // GROUP BY
  private _groupBy: GroupBy; // GROUP BY expr(s)
  private _having: Having; // Having expr
  // ORDER BY
  private _orderBy: OrderBy; // ORDER BY ordering-term(s)
  // LIMIT
  private _limit: Limit; // LIMIT expr

  addChangeListener(listener: QueryChangeListener) {}
  removeChangeListener(token: ListenerToken) {}

  copy(query: Query) {
    this._select = query._select;
    this._from = query._from;
    this._joins = query._joins;
    this._where = query._where;
    this._groupBy = query._groupBy;
    this._having = query._having;
    this._orderBy = query._orderBy;
    this._limit = query._limit;

    this.parameters = query.parameters;
  }

  setSelect(select: Select) {
    this._select = select;
  }
  setFrom(from: DataSource) {
    this._from = from;
  }
  setJoins(joins: Joins) {
    this._joins = joins;
  }
  setWhere(where: Expression) {
    this._where = where;
  }
  setGroupBy(groupBy: GroupBy) {
    this._groupBy = groupBy;
  }
  setHaving(having: Having) {
    this._having = having;
  }
  setOrderBy(orderBy: OrderBy) {
    this._orderBy = orderBy;
  }
  setLimit(limit: Limit) {
    this._limit = limit;
  }

  getFrom() {
    return this._from;
  }

  getColumnNames() {
    return this.columnNames;
  }

  check() {
    if (!this.columnNames) {
      this.columnNames = this.generateColumnNames();
    }
  }

  execute(): Promise<ResultSet> {
    const db = this._from && (this._from.getSource() as Database);
    return db.getEngine().Engine_Query_Execute({
      name: db.getName(),
      query: this,
    });
  }

  explain(): Promise<string> {
    const json = this._asJSON();
    return Promise.reject(null);
  }

  generateColumnNames() {
    const map: { [name: string]: number } = {};
    let provisionKeyIndex = 0;

    this._select.getSelectResults().forEach((r, i) => {
      let name = r.getColumnName();

      if (name && name === PropertyExpression.kCBLAllPropertiesName) {
        name = this._from.getColumnName();
      }

      if (!name) {
        name = `\$${++provisionKeyIndex}`;
      }

      if (name in map) {
        throw new Error('Duplicate select result named ' + name);
      }

      map[name] = i;
    });
    return map;
  }

  getParameters() {
    return this.parameters;
  }

  setParameters(parameters: Parameters) {
    this.parameters = parameters;
  }

  toString() {
    return this._asJSON();
  }

  toJson() {
    return this._asJSON();
  }
  // abstract asJSON(): any;

  private _asJSON(): { [key: string]: any } {
    const json: { [key: string]: any } = {};

    // DISTINCT:
    if (this._select != null && this._select.isDistinct()) {
      json['DISTINCT'] = true;
    }

    // result-columns / SELECT-RESULTS
    if (this._select != null && this._select.hasSelectResults()) {
      json['WHAT'] = this._select.asJSON();
    }

    // JOIN:
    const f: any[] = [];
    const as = this._from.asJSON();
    if (Object.keys(as).length > 0) {
      f.push(as);
    }

    if (this._joins != null) {
      f.push(...this._joins.asJSON());
    }
    if (f.length > 0) {
      json['FROM'] = f;
    }

    if (this._where != null) {
      json['WHERE'] = this._where.asJSON();
    }

    if (this._groupBy != null) {
      json['GROUP_BY'] = this._groupBy.asJSON();
    }

    if (this._having != null) {
      json['HAVING'] = this._having.asJSON();
    }

    if (this._orderBy != null) {
      json['ORDER_BY'] = this._orderBy.asJSON();
    }

    if (this._limit != null) {
      const list = this._limit.asJSON();
      json['LIMIT'] = list[0];
      if (list.length > 1) {
        json['OFFSET'] = list[1];
      }
    }
    return json;
  }
}
