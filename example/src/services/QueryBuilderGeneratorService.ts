export class QueryBuilderGeneratorService {
	static queries: string[] = [
		'Select *',
		'Select Meta.id, name, price',
		'Select Fields',
		'Selct Count',
		'Select * on Sale',
		'Select Sum of Prices on sale',
		'Select Avg of Prices in Electronics',
		'Select Electronics Limit 3 Order By Price',
		'Select Group by Location',
	  ];
}