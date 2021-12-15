import { useState, useMemo } from "react";
import moment from "moment";
import isEmptyObject from "is-empty-object";

export const useSort = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const isValidDate = item => moment(item, moment.ISO_8601, true).isValid();
    const sort = array => {
        return array.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "ASC" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "ASC" ? 1 : -1;
            }
            return 0;
        });
    };

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (!isEmptyObject(sortConfig)) {
            if (sortConfig.key.toLowerCase().includes("date")) {
                const dates = [];
                const rest = [];
                sortableItems.map(item => (isValidDate(item[sortConfig.key]) ? dates.push(item) : rest.push(item)));
                return (sortableItems = sort(dates).concat(rest));
            }
            return sort(sortableItems);
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = key => {
        setSortConfig(prevState => {
            if (prevState.direction === "ASC") return { key, direction: "DESC" };
            return { key, direction: "ASC" };
        });
    };

    return { sortedItems, requestSort, sortConfig };
};
