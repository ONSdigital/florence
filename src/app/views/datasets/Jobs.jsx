import React, { Component } from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';

const propTypes = {
    datasets: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        alias: PropTypes.string.isRequired
    })),
    jobs: PropTypes.arrayOf(PropTypes.shape({
        job_id: PropTypes.string.isRequired,
        recipe: PropTypes.string.isRequired
    })),
    rootPath: PropTypes.string.isRequired
}

class Jobs extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.jobs.length > 0 ?
                    <ul className="list">
                        {this.props.jobs.map(job => {
                            const recipe = this.props.datasets.find(dataset => {
                                return dataset.id === job.recipe;
                            });
                            if (!recipe) {
                                console.warn(`Attempt to render job for an unrecognised recipe ID: "${job.recipe}"` );
                                return ""
                            }
                            return (
                                <li className="list__item list__item--separated grid grid--justify-space-between" key={job.job_id}>
                                    <Link to={`${this.props.rootPath}/datasets/${job.recipe}/jobs/${job.job_id}`}>
                                        {recipe.alias}
                                    </Link>
                                    <span>{job.state}</span>
                                </li>
                            )
                        })}
                    </ul>
                :
                    <p>No dataset uploads in progress</p>
                }
            </div>
        )
    }
}

Jobs.propTypes = propTypes;

export default Jobs;