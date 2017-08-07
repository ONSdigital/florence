import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Input from '../Input';

const propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    url: PropTypes.string,
    size: PropTypes.string,
    extension: PropTypes.string,
    accept: PropTypes.string
}

class FileUpload extends Component {
    constructor(props) {
        super(props);
    }

    renderInput() {
        return (
            <Input 
                label={this.props.label}
                id={this.props.id}
                type="file"
                accept={this.props.accept}
            />
        )
    }

    renderLink() {
        return (
            <a href={this.props.url} target="_blank" rel="noopener noreferrer">{this.props.label}</a>
        )
    }

    render() {
        return (
            <div className="grid">
                <div className="grid__col-6">
                    {this.props.url ?
                        this.renderLink()
                    :
                        this.renderInput()
                    }
                </div>
            </div>
        )
    }
}

FileUpload.propTypes = propTypes;

export default FileUpload;