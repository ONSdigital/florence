import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { filterCollections, saveSearch } from "../../config/actions";
import { useInput } from "../../hooks/useInput";
import Magnifier from "../../icons/Magnifier";

const Search = () => {
    const [search, setSearch] = useInput("");
    const dispatch = useDispatch();

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(saveSearch(search.value));
    };

    const handleRest = () => {
        setSearch("");
        dispatch(saveSearch(""));
    };

    return (
        <form className="search__form--inline padding--bottom--1" onSubmit={handleSubmit}>
            <div className="search__input-group">
                <Magnifier classes="search__icon-magnifier" viewBox="0 0 28 28" />
                <input placeholder="Search for a collection name" {...search} />
                {search.value && (
                    <button type="reset" onClick={handleRest} className="btn__close">
                        &times;
                    </button>
                )}
            </div>
            <button className="btn btn--positive" type="submit">
                Search
            </button>
        </form>
    );
};

export default Search;
