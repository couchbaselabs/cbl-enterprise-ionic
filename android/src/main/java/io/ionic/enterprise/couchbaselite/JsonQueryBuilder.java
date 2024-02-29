package io.ionic.enterprise.couchbaselite;

import com.couchbase.lite.DataSource;
import com.couchbase.lite.Database;
import com.couchbase.lite.LiteCoreException;
import com.couchbase.lite.Log;
import com.couchbase.lite.Query;
import com.couchbase.lite.QueryBuilder;
import com.couchbase.lite.internal.core.C4Database;
import com.couchbase.lite.internal.core.C4Query;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class JsonQueryBuilder {
    public static Query buildQuery(Database db, String json) {
        Query query = null;

        try {
            DataSource source = DataSource.database(db);
            query = QueryBuilder.select().from(source);
            //TODO fixed for 3.x due to createJsonQuery vs createSQLQuery
            C4Database c4database = getC4Database(db);
            setC4Query(query, c4database.createJsonQuery(json));
            setColumnNames(query, generateColumnNames(db, json));
        } catch (NoSuchFieldException | NoSuchMethodException | InvocationTargetException | IllegalAccessException | LiteCoreException ex) {
            ex.printStackTrace();
        }

        return query;
    }

    private static Map<String, Integer> generateColumnNames(Database db, String json) {
        Map<String, Integer> columns = new HashMap<>();

        try {
            JSONObject queryJson = new JSONObject(json);
            JSONArray what = queryJson.getJSONArray("WHAT");

            for (int i = 0; i < what.length(); i++) {
                JSONArray item = what.getJSONArray(i);
                String column = item.getString(0);
                if (column != null) {
                    if (column.equals(".")) {
                        String columnName = db.getName();
                        columns.put(columnName, i);
                    } else if (column.equals("AS")) {
                        String columnName = item.getString(2);
                        columns.put(columnName, i);
                    } else {
                        String columnName = column.substring(1);
                        columns.put(columnName, i);
                    }
                }
            }
        } catch (JSONException ex) {
            ex.printStackTrace();
        }

        return columns;
    }

    private static C4Database getC4Database(Database db) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException {
        Class cls = db.getClass().getSuperclass(); // AbstractDatabase
        Method m = cls.getDeclaredMethod("getC4Database", null);
        m.setAccessible(true);

        return (C4Database) m.invoke(db, null);
    }

    private static void setC4Query(Query query, C4Query c4query) throws IllegalAccessException, NoSuchFieldException {
        Class queryClass = query.getClass().getSuperclass(); // AbstractQuery
        Field f = queryClass.getDeclaredField("c4query");
        f.setAccessible(true);
        f.set(query, c4query);
    }

    private static void setColumnNames(Query query, Map<String, Integer> columnNames) throws NoSuchFieldException, IllegalAccessException {
        Class queryClass = query.getClass().getSuperclass(); // AbstractQuery
        Field f = queryClass.getDeclaredField("columnNames");
        f.setAccessible(true);
        f.set(query, columnNames);
    }
}
