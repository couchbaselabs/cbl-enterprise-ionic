    @PluginMethod
    public void Test_JoinQuery(PluginCall call) throws JSONException, CouchbaseLiteException {
        String name = call.getString("name");
        Database db = this.openDatabases.get(name);
        Query query = QueryBuilder.select(
          SelectResult.all().from("hotel_locations"),
          SelectResult.expression(Expression.property("name").from("hotel_locations")),
          SelectResult.expression(Meta.id.from("hotel_locations"))
          )
          .from(DataSource.database(db).as("locations"))
          .join(
            Join.join(DataSource.database(db).as("hotel_locations")).on(
              Meta.id
                .from("locations")
                .equalTo(Expression.property("location_id").from("hotel_locations"))
            )
          )
          .where(
            Expression.property("type")
              .from("hotel_locations")
              .equalTo(Expression.string("hotel"))
              .and(
                Expression.property("type")
                  .from("locations")
                  .equalTo(Expression.string("location"))
              )
          );

       ResultSet results = query.execute();

       call.resolve();
    