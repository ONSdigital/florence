import React, { Component } from 'react';
import PropTypes from 'prop-types';

import filesize from 'filesize';
import Input from '../Input';

const propTypes = {
    label: PropTypes.string,
    id: PropTypes.string.isRequired,
    url: PropTypes.string,
    size: PropTypes.number,
    error: PropTypes.string,
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
                error={this.props.error}
            />
        )
    }

    renderLink() {
        return (
            <div>
                <div>
                    {this.props.label}
                </div>
                <a href={this.props.url} target="_blank" rel="noopener noreferrer">{this.props.url}</a> 
                {this.props.size &&
                    <span> ({filesize(this.props.size)})</span>
                }
            </div>
        )
    }

    render() {
        return (
            <div className="grid">
                    {this.props.url && !this.props.error ?
                        this.renderLink()
                    :
                        <div className="grid__col-6">
                            {this.renderInput()}
                        </div>
                    }
            </div>
        )
    }
}

FileUpload.propTypes = propTypes;

export default FileUpload;