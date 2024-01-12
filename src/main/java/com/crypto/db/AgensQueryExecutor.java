package com.crypto.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AgensQueryExecutor {

    private Logger logger = LoggerFactory.getLogger(AgensQueryExecutor.class);
    private Connection connection;
    private String url;
    private String username;
    private String password;

    public AgensQueryExecutor(String url, String username, String password) {
        this.url = url;
        this.username = username;
        this.password = password;
        createConnection();
    }

    private void createConnection() {
        try {
            this.connection = DriverManager.getConnection(url, username, password);
            this.connection.setAutoCommit(false); // ?��?��?��?�� 처리�? ?��?��?�� ?��?��커밋?? ?��?��?��?��.
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void commitAndClose() {
        try {
            this.connection.commit();
            this.connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    public List<Map<String, Object>> executeQuery(String query, List<Object> paramList) {
        List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            this.setParameter(preparedStatement, paramList);
            logger.info("QUERY:\n{}", query);

            ResultSet resultSet = preparedStatement.executeQuery();
            ResultSetMetaData metaData = resultSet.getMetaData();
            int columnCount = metaData.getColumnCount();
            // Todo. 필요한 로직인지 확인 필요
            while (resultSet.next()) {
                Map<String, Object> rowData = new HashMap<String, Object>();
                for (int column = 1; column <= columnCount; column++) {
                    String columnLabel = metaData.getColumnLabel(column);
                    Object columnValue = resultSet.getObject(columnLabel);
//                    if (columnValue instanceof Vertex) {
//                        Vertex vertex = (Vertex) columnValue;
//                        rowData = (Map<String, Object>) vertex.getProperties().getTypedValue();
//                    } else if(columnValue instanceof Edge) {
//                        Edge edge = (Edge) columnValue;
//                        rowData = (Map<String, Object>) edge.getProperties().getTypedValue();
//                    }
                    resultList.add(rowData);
                }
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return resultList;
    }

    public int executeUpdate(String query) {
        return this.executeUpdate(query, null);
    }

    public int executeUpdate(String query, List<Object> paramList) {
        int updateCount = 0;

        try {
            PreparedStatement preparedStatement = connection.prepareStatement(query);
            this.setParameter(preparedStatement, paramList);
            logger.info("QUERY:\n{}", query);

            updateCount = preparedStatement.executeUpdate();
            connection.commit();
        } catch (SQLException e) {
            e.printStackTrace();
            try {
                connection.rollback();
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
        }
        return updateCount;
    }

    private void setParameter(PreparedStatement preparedStatement, List<Object> paramList)
            throws SQLException {

        if (paramList == null)
            return;

        int index = 1;
        for (Object param : paramList) {
            logger.info("[{}] Query Params : {}", index, param);
            preparedStatement.setObject(index++, param);
        }
    }

}