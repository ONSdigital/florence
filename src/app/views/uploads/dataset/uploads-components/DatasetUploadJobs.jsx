import React, { Component } from "react";
import { Link } from "react-router";
import PropTypes from "prop-types";

const propTypes = {
    datasets: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            alias: PropTypes.string.isRequired
        })
    ),
    jobs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            recipe: PropTypes.string.isRequired
        })
    )
};

class DatasetUploadJobs extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.jobs.length > 0 ? (
                    <div>
                        <h3 className="text-right">Status</h3>
                        <ul className="list list--neutral">
                            {this.props.jobs.map(job => {
                                const recipe = this.props.datasets.find(dataset => {
                                    return dataset.id === job.recipe;
                                });
                                if (!recipe) {
                                    console.warn(`Attempt to render job for an unrecognised recipe ID: "${job.recipe}"`);
                                    return "";
                                }
                                return (
                                    <li className="list__item list__item--separated grid grid--justify-space-between" key={job.id}>
                                        <Link to={`${location.pathname}/${job.id}`}>{recipe.alias}</Link>
                                        <span>{job.state}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : (
                    <p>No dataset uploads in progress</p>
                )}
            </div>
        );
    }
}

DatasetUploadJobs.propTypes = propTypes;

export default DatasetUploadJobs;
