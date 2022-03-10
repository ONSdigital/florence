import React from "react";
import PropTypes from "prop-types";
import { useInput } from "../../hooks/useInput";
import Magnifier from "../../icons/Magnifier";

const Search = ({ saveSearch }) => {
    const [search, setSearch] = useInput("");

    const handleSubmit = e => {
        e.preventDefault();
        saveSearch(search.value);
    };

    const handleRest = () => {
        setSearch("");
        saveSearch("");
    };

    return (
        <form className="search__form--inline padding--bottom--1" onSubmit={handleSubmit} role="search">
            <div className="search__input-group">
                <Magnifier classes="search__icon-magnifier" viewBox="0 0 28 28" />
                <label htmlFor="search_input" className="visually-hidden">
                    Search collections
                </label>
                <input id="search_input" name="search" placeholder="Search for a collection name" {...search} />

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

Search.propTypes = {
    saveSearch: PropTypes.func.isRequired,
};

export default Search;
