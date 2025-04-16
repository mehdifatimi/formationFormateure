import React from 'react';
import { Card, Table, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import FilterBar from './FilterBar';
import { useFilter } from '../../hooks/useFilter';

const { Search } = Input;

const DataTable = ({
    title,
    columns,
    dataSource,
    loading,
    filters,
    onFilter,
    searchPlaceholder,
    showDateRange,
    dateRangeField,
    extra,
}) => {
    const { filters: currentFilters, updateFilters, resetFilters } = useFilter(filters);

    const handleFilter = (values) => {
        updateFilters(values);
        onFilter?.(values);
    };

    const handleReset = () => {
        resetFilters();
        onFilter?.({});
    };

    const handleSearch = (value) => {
        // Implémenter la recherche si nécessaire
        console.log('Recherche:', value);
    };

    return (
        <Card
            title={title}
            extra={
                <Space>
                    {extra}
                </Space>
            }
        >
            <Space direction="vertical" style={{ width: '100%' }}>
                <Space style={{ marginBottom: 16 }}>
                    <Search
                        placeholder={searchPlaceholder || "Rechercher..."}
                        allowClear
                        enterButton={<SearchOutlined />}
                        onSearch={handleSearch}
                        style={{ width: 300 }}
                    />
                </Space>

                {filters && onFilter && (
                    <FilterBar
                        filters={filters}
                        onFilter={handleFilter}
                        onReset={handleReset}
                        showDateRange={showDateRange}
                        dateRangeField={dateRangeField}
                    />
                )}

                <Table
                    columns={columns}
                    dataSource={dataSource}
                    loading={loading}
                    rowKey="id"
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Total ${total} éléments`,
                    }}
                />
            </Space>
        </Card>
    );
};

export default DataTable; 