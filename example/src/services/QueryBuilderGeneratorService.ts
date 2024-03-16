import {
  Database,
  DataSource,
  QueryBuilder,
  Function,
  Query, 
  SelectResult,
  Expression,
  Ordering,
  Meta,
} from 'cblite-core';

export interface QueryDictionary {
  [key: string]: Query;
}

export class QueryGeneratorService {

  static readonly queries: string[] = [
	'Select count(*)',
    'Select *',
    'Select Meta.id, name, price',
    'Select Fields',
    'Select * on Sale',
    'Select Electronics Limit 3 Order By Price',
  ];

  static getQueries(db: Database): QueryDictionary[] {
    return [
	  {
			'Select count(*)': QueryBuilder.select(
				SelectResult.expression(Function.count(Expression.string('*'))).as('count')
			).from(DataSource.database(db)),
	  },
      {
        'Select *': QueryBuilder.select(SelectResult.all()).from(DataSource.database(db)),
      },
      {
        'Select Meta.id, name, price': QueryBuilder.select(
          SelectResult.expression(Meta.id),
          SelectResult.property('name'),
          SelectResult.property('price'),
        ).from(DataSource.database(db))
		.where(Expression.property('documentType').equalTo( Expression.string('product'))),
      },
      {
        'Select Fields': QueryBuilder.select(
          SelectResult.property('id'),
          SelectResult.property('name'),
          SelectResult.property('category'),
          SelectResult.property('price'),
          SelectResult.property('location'),
          SelectResult.property('quantity'),
        ).from(DataSource.database(db))
		.where(Expression.property('documentType').equalTo( Expression.string('product'))),
      },
      {
        'Select * on Sale': QueryBuilder.select(SelectResult.all())
          .from(DataSource.database(db))
          .where(
            Expression.property('isOnSale').equalTo(
              Expression.booleanValue(true),
            ).and(Expression.property('documentType').equalTo( Expression.string('product'))),
        	),
      },
      {
        'Select Electronics Limit 3 Order By Price': QueryBuilder.select(
          SelectResult.all(),
        )
          .from(DataSource.database(db))
          .where(
            Expression.property('category')
              .equalTo(Expression.string('Electronics'))
              .and(Expression.property('documentType') 
			  	.equalTo( Expression.string('product')))
          )
          .orderBy(Ordering.property('price'))
          .limit(Expression.intValue(3)),
      },
    ];
  }
}
