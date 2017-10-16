import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import url from '../../../utilities/url'
import datasets from '../../../utilities/api-clients/datasets';
import notifications from '../../../utilities/notifications';
import { push } from 'react-router-redux';

import Modal from '../../../components/Modal';
import RelatedDataController from './related-content/RelatedDataController';

const propTypes = {
    dispatch: PropTypes.func.isRequired,
    rootPath: PropTypes.string.isRequired,
    routes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

class DatasetRelated extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            modalType: "",
            relatedBulletins: [],
            relatedQMI: "",
            relatedLinks: [],
            titleInput: {
                value: "",
                error: ""
            },
            urlInput: {
                value: "",
                error: ""
            },
            editKey: "",
        };

        this.handleAddRelatedClick = this.handleAddRelatedClick.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleFormInput = this.handleFormInput.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.removeRelated = this.removeRelated.bind(this);
        this.handleEditRelatedClick = this.handleEditRelatedClick.bind(this);
        this.handlePageSubmit = this.handlePageSubmit.bind(this);
    }

    componentWillMount() {
        function guid() {
            function S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        }

        var datasetID = "1234nshahb-ebggafsgsh"

        const APIRequests = [
            datasets.get(datasetID)
        ]

        Promise.all(APIRequests).then(responses => {
            var datasetResponse = responses[0];

            datasetResponse.publications.map(item => {
                var bulletin = {title: item.title, url: item.href, key: guid()}
                var bulletins = this.state.relatedBulletins.concat(bulletin);
                this.setState({relatedBulletins: bulletins})
            })

            datasetResponse.related_datasets.map(item => {
                var link = {title: item.title, url: item.href, key: guid()}
                var links = this.state.relatedLinks.concat(link);
                this.setState({relatedLinks: links})
            })

            if (datasetResponse.qmi.title != "") {
                var item = datasetResponse.qmi
                var qmi = {title: item.title, url: item.href, key: guid()}
                this.setState({relatedQMI: qmi})
            }
        }).catch(error => {
            switch (error.status) {
                case(403):{
                    const notification = {
                        "type": "neutral",
                        "message": "You do not permission to view the edition metadata for this dataset",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
                case (404): {
                    const notification = {
                        "type": "neutral",
                        "message": `Dataset ID `+datasetID+` was not recognised. You've been redirected to the datasets home screen`,
                        isDismissable: true
                    };
                    notifications.add(notification);
                    this.props.dispatch(push(url.parent(url.parent())));
                    break;
                }
                default: {
                    const notification = {
                        type: "warning",
                        message: "An unexpected error's occurred whilst trying to get this dataset",
                        isDismissable: true
                    }
                    notifications.add(notification);
                    break;
                }
            }
            console.error("Error has occurred:\n", error);
        });
    }

    handleAddRelatedClick(type) {
        this.setState({showModal: true});
        this.setState({modalType: type});
    }

    handleCancel() {
        this.setState({showModal: false});
        this.setState({modalType: ""});
        this.setState({editKey: ""});
    }

    handleEditRelatedClick(type, key) {
        this.setState({showModal: true});
        this.setState({modalType: type});
        this.setState({editKey: key});
    }

    handleFormInput(event) {
        const input = Object.assign({}, this.state.input, {
               value: event.target.value,
               error: ""
            });

            if (input.value === "") {
                input.error = "You cannot provide empty values"
            }
        if (event.target.name === "add-related-content-title") {
            this.setState({titleInput: input});
        } else if (event.target.name === "add-related-content-url") {
            this.setState({urlInput: input});
        }
    }

    removeRelated(type, key) {
        function remove(arr, key) {
            arr.map((item, index) => {
                if (item.key === key) {
                    arr.splice(index, 1);
                }
            })
            return arr
        }

        if (type === "bulletin") {
            var bulletins = remove(this.state.relatedBulletins, key)
            this.setState({relatedBulletins: bulletins});
        } else if (type === "qmi") {
            this.setState({relatedQMI: ""});
        } else if (type === "link") {
            var links = remove(this.state.relatedLinks, key)
            this.setState({relatedLinks: links});
        }
    }

    handlePageSubmit() {
        this.props.dispatch(push(url.resolve("whats-changed")));
    }

    handleFormSubmit(event) {
        event.preventDefault()

        function guid() {
            function S4() {
                return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
            }
            return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
        }

        if (this.state.modalType === "bulletin") {
            if (this.state.editKey != "") {
                this.removeRelated("bulletin", this.state.editKey)
            }
            var bulletins = this.state.relatedBulletins.concat({title: this.state.titleInput.value, url: this.state.urlInput.value, key: guid()});
            this.setState({relatedBulletins: bulletins});
        } else if (this.state.modalType === "qmi") {
            if (this.state.editKey != "") {
                this.removeRelated("qmi", this.state.editKey)
            }
            var qmi = {title: this.state.titleInput.value, url: this.state.urlInput.value, key: guid()};
            this.setState({relatedQMI: qmi});
        } else if (this.state.modalType === "related-link") {
            if (this.state.editKey != "") {
                this.removeRelated("link", this.state.editKey)
            }
            var links = this.state.relatedLinks.concat({title: this.state.titleInput.value, url: this.state.urlInput.value, key: guid()});
            this.setState({relatedLinks: links});
        }

        this.setState({showModal: false});
        this.setState({modalType: ""});
        this.setState({editKey: ""})
    }

    render() {
        return (
            <div className="grid grid--justify-center">
                <div className="grid__col-3">
                    <div className="margin-top--2">
                        &#9664; <Link to={url.parent(url.parent())}>Back</Link>
                    </div>
                    <h2 className="margin-bottom--1">Related content</h2>
                    <div className="margin-bottom--1">
                        <p> These are common across all editions of the dataset. Changing them will affect all previous editions.</p>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> Bulletins, articles and compendia </h3>
                        <ul className="list--neutral margin-bottom--1">
                        {
                            this.state.relatedBulletins.map(bulletin => {
                                return (
                                    <li className="card margin-bottom--1">
                                        <div className="card__body">
                                            <div className="card__title">{bulletin.title}</div>
                                        </div>
                                        <div className="card__actions">
                                            <a href="#" onClick={() => {this.handleEditRelatedClick("bulletin", bulletin.key)}}>Edit</a>
                                            <a className="margin-left--1" href="#" onClick={() => {this.removeRelated("bulletin", bulletin.key)}}>Delete</a>
                                        </div>
                                    </li>
                                )
                            })
                        }
                        </ul>
                        <a href="#" onClick={() => {this.handleAddRelatedClick("bulletin")}}> Add document </a>
                    </div>
                    <div className="margin-bottom--2">
                        <h3> QMI </h3>
                        {
                            this.state.relatedQMI != "" ?
                                <ul className="list--neutral margin-bottom--1">
                                    <li className="card margin-bottom--1">
                                        <div className="card__body">
                                            <div className="card__title">{this.state.relatedQMI.title}</div>
                                        </div>
                                        <div className="card__actions">
                                            <a href="#" onClick={() => {this.handleEditRelatedClick("qmi", this.state.relatedQMI.key)}}>Edit</a>
                                            <a className="margin-left--1" href="#" onClick={() => {this.removeRelated("qmi", this.state.relatedQMI.key)}}>Delete</a>
                                        </div>
                                    </li>
                                </ul>
                            :
                            <a href="#" onClick={() => {this.handleAddRelatedClick("qmi")}}> Add QMI </a>
                        }
                    </div>
                    <div className="margin-bottom--2">
                        <h3> Related links </h3>
                        <ul className="list--neutral margin-bottom--1">
                        {
                            this.state.relatedLinks.map(link => {
                                return (
                                    <li className="card margin-bottom--1">
                                        <div className="card__body">
                                            <div className="card__title">{link.title}</div>
                                        </div>
                                        <div className="card__actions">
                                            <a href="#" onClick={() => {this.handleEditRelatedClick("link", link.key)}}>Edit</a>
                                            <a className="margin-left--1" href="#" onClick={() => {this.removeRelated("link", link.key)}}>Delete</a>
                                        </div>
                                    </li>
                                )
                            })
                        }
                        </ul>
                        <a href="#" onClick={() => {this.handleAddRelatedClick("related-link")}}> Add related link </a>
                    </div>
                    <div className="grid__col-5">
                        <button className="btn btn--positive" onClick={this.handlePageSubmit}>Save and Continue</button>
                    </div>
                </div>
                {
                    this.state.showModal ?
                    <Modal sizeClass="grid__col-3">
                        <RelatedDataController
                            name="related-content-modal"
                            titleInput={this.state.titleInput}
                            urlInput={this.state.urlInput}
                            onCancel={this.handleCancel}
                            onFormInput={this.handleFormInput}
                            onFormSubmit={this.handleFormSubmit}
                        />
                    </Modal>
                    :
                    ""
                }
            </div>
        )
    }
}

DatasetRelated.propTypes = propTypes;

function mapStateToProps(state) {
    return {
        rootPath: state.state.rootPath
    }
}

export default connect(mapStateToProps)(DatasetRelated);
