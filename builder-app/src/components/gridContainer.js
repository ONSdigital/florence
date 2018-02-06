import React, { Component } from 'react';

import Grid from './grid';
import MetaData from './metaData';

import FileSaver from 'file-saver'


const previewURi = '/table/parse/html';
const renderPrefix = '/table/render/';

const ignore_first_row = true;
const ignore_first_column = true;
const ignore_column_width = "50px"

class GridContainer extends Component {


  // rawData: initial data from handsontable output
  // parseData: output from parse endpoint
  // previewHtml: output from parse endpoint

  constructor(props) {
    super(props);

    this.state = {
      view: 'handsontable',
      tableJsonOutput: [],
      handsontableData: [[" "], [" "]],
      previewHtml: '',
      parsedData: '',
      rawData: '',
      metaTitle: '',
      metaSubtitle: '',
      metaUnits: '',
      metaSource: '',
      metaNotes: '',
      metaSizeunits: '',
      metaKeepHeadersTogether: true,
      metaHeadercols: '',
      metaHeaderrows: '',
      colWidths: [],
      mergeCells: true,
      cellAlignments: [],
      colrowStatus: {}
    };

    //callback handlers
    this.setMetaDataCallbk = this.setMetaData.bind(this);
    this.changeview = this.changeView.bind(this);
    this.previewPostData = this.processHandsontableData.bind(this);
    this.updateUserTableData = this.updateTableJsonOutput.bind(this);
    this.cellMove = this.cellMove.bind(this);
  }



  shouldComponentUpdate(nextProps, nextState) {


    // console.log('@@@@@@@@@@@ ShouldComponentUpdate in gridcontainer');
    // console.log(nextState);
    // console.log('current view is', this.state.view);
    // console.log('next state view is', nextState.view);

    // if (nextState.view != this.state.view)
    //   {
    //     console.log('TRUE - container component updating')
    //     return true;}

    // else{
    //   console.log('FALSE - container component NOT  updating')
    //   return false;
    // }

    return true;
  }





  rebuildGrid() {

    console.log('inside rebuild');
    this.setColWidths(this.state.parsedData.render_json);
    this.setMergeCells(this.state.parsedData.render_json.cell_formats);
    this.setCellAlignments(this.state.parsedData.render_json.cell_formats);
    this.changeView('handsontable');
  }



  changeView(viewType) {
    this.setState({
      view: viewType
    })
  }






  cellMove(cellCoord) {
    console.log('mouse move detected in container');
    console.log(cellCoord);
    // this.setState({colrowStatus:cellCoord});
    this.setState({
      colrowStatus: cellCoord
    });
  }


  setMetaData(metaObject) {
    this.setState(metaObject);
  }



  saveGrid(event) {
    let renderJson = this.state.parsedData.render_json;
    console.log(renderJson);
    this.props.onSave(renderJson);
    console.log('saved-invoked with ' + renderJson);
  }


  loadGrid(event) {
    console.log('load');
  }


  previewGrid(event) {
    console.log('preview grid');
    this.processHandsontableData();
  }


  updateTableJsonOutput(usertabledata) {

    // console.log('in updateTableJson - setState: tableJsonOutput: usertabledata');
    //console.log(usertabledata);
    this.setState({ tableJsonOutput: usertabledata });
  }

  processHandsontableData() {
    console.log('@@@@pre-process');

    let data = this.state.tableJsonOutput;

    data["footnotes"] = this.addFootNotes();
    data["title"] = this.state.metaTitle;
    data["subtitle"] = this.state.metaSubtitle;
    data["source"] = this.state.metaSource;
    data["ignore_first_row"] = ignore_first_row;
    data["ignore_first_column"] = ignore_first_column;
    data["column_width_to_ignore"] = ignore_column_width;
    data["header_rows"] = parseInt(this.state.metaHeaderrows) || 0
    data["header_cols"] = parseInt(this.state.metaHeadercols) || 0;
    data["cell_size_units"] = this.state.metaSizeunits; // this.state.metaUnits;
    data["keep_headers_together"] = this.state.metaKeepHeadersTogether; // this.state.metaUnits;
    data["alignment_classes"] = {
      "top": "htTop",
      "middle": "htMiddle",
      "bottom": "htBottom",
      "left": "htLeft",
      "center": "htCenter",
      "right": "htRight",
      "justify": "htJustify"
    }


    console.log(data);
    this.postPreviewData(data);
  }


  addFootNotes() {
    if (this.state.metaNotes === '')
      return null
    else {
      let notelist = this.state.metaNotes.split("\n");
      return notelist;
    }
  }

  addHeaderRows() {
    var num = parseInt(this.state.metaHeaderrows) || 0;
    return num;
  }


  addHeaderCols() {
    var num = parseInt(this.state.metaHeadercols) || 0;
    return num;
  }

  addRowformats() {
    //return [{}]
  }

  addColumnFormat() {

  }

  addCellformat() {

  }





  // set Column widths render_json > handsontable
  setColWidths(data) {
    console.log('data in setColwidths');
    console.log(data);
    let colWidths = [];
    data.column_formats.forEach((entry) => {
      let widthVal = 0;
      if (entry.width != null) {
        switch (data.cell_size_units) {
          case "em":
            widthVal = parseFloat(entry.width.replace('em', '')) * data.single_em_height || 0;
            break;
          case "%":
            widthVal = (parseFloat(entry.width.replace('%', '')) / 100.0) * data.current_table_width || 0;
            break;
          default:
            widthVal = 50;
        }
      }

      colWidths.push(Math.round(widthVal));
    });

    this.setState({ colWidths: colWidths });
    console.log('col widths');
    console.log(this.state.colWidths);
  }



  // MergeCells render_json > handsontable
  // filter form render_json if contains rowspan
  setMergeCells(cellformats) {
    let mergeArr = cellformats.filter((obj) => {
      return obj.hasOwnProperty("rowspan");
    });
    //console.log(mergeArr)
    this.setState({ mergeCells: mergeArr });
    console.log(this.state.mergeCells);
  }



  setCellAlignments(cellformats) {
    // in  {row: 1, col: 1, align: "Left", vertical_align:"Middle"}
    // out  {row: 1, col: 1, className: "htLeft htMiddle"}
    let cellAlignments = [];
    console.log('in alignment cells');
    cellformats.forEach((entry) => {
      if (entry.hasOwnProperty("align") || entry.hasOwnProperty("vertical_align")) {
        cellAlignments.push({ row: entry.row, col: entry.col, className: this.getMapAlignmentClass(entry) });
      }
    });
    this.setState({ cellAlignments: cellAlignments });
    console.log('new cellAlignment');
    console.log(this.state.cellAlignments);
  }




  getMapAlignmentClass(cellObj) {
    let className = " ";
    if (cellObj.hasOwnProperty("align")) {

      switch (cellObj.align) {
        case "Left":
          className += "htLeft ";
          break;
        case "Right":
          className += "htRight ";
          break;
        case "Center":
          className += "htCenter ";
          break;
      }


    }

    if (cellObj.hasOwnProperty("vertical_align")) {
      switch (cellObj.vertical_align) {
        case "Top":
          className += "htTop";
          break;
        case "Middle":
          className += "htMiddle";
          break;
        case "Bottom":
          className += "htBottom";
          break;
      }
    }

    return className.trim();
  }




  postPreviewData(dta) {
    console.log('dta in');
    console.log(dta)
    fetch(previewURi, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dta)
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log('returned...', data);
        data.render_json.current_table_width = dta.current_table_width;
        data.render_json.current_table_height = dta.current_table_height;
        data.render_json.single_em_height = dta.single_em_height;
        data.render_json.cell_size_units = dta.cell_size_units;
        this.setState({
          previewHtml: data.preview_html,
          parsedData: data,
          view: 'preview'
        })
        //this.changeView('preview');
      })
      .catch(function (error) {
        console.log(error);
      });
  }





  postRenderData(fileType) {
    var renderJson = JSON.stringify(this.state.parsedData.render_json)
    fetch(renderPrefix + fileType, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: renderJson
    })
      .then((response) => {
        return response.blob()
      })
      .then((data) => {
        FileSaver.saveAs(data, this.state.parsedData.render_json.filename + '.' + fileType);
      })
      .catch(function (error) {
        console.log(error);
      });
  }


  render() {
    if (this.state.view === 'handsontable') {
      return (
        <div className="gridContainer">
          <MetaData
            // setMetaDataCallbk={this.setMetaData.bind(this)}
            setMetaData={this.setMetaDataCallbk}
            metaTitle={this.state.metaTitle}
            metaSubtitle={this.state.metaSubtitle}
            metaKeepHeadersTogether={this.state.metaKeepHeadersTogether}
            metaSource={this.state.metaSource}
            metaNotes={this.state.metaNotes}
            metaHeadercols={this.state.metaHeadercols}
            metaHeaderrows={this.state.metaHeaderrows}
            metaSizeunits={this.state.metaSizeunits}
          />
          <Grid
            handsontableData={this.state.handsontableData}
            view={this.view}
            previewPostData={this.previewPostData}
            updateUserTableData={this.updateUserTableData}
            colWidths={this.state.colWidths}
            mergeCells={this.state.mergeCells}
            cellAlignments={this.state.cellAlignments}
            cellMove={this.cellMove}
          />&nbsp;<br />
          <div className="statusBar">
            <div className="statusBtnsGroup">
              <button onClick={(e) => this.saveGrid(e)} >save</button>&nbsp;
        <button onClick={(e) => this.loadGrid(e)}>load</button> &nbsp;
            <button onClick={(e) => this.previewGrid(e)}>preview html</button> &nbsp;
</div><div className="rowColStatus">Row:&nbsp;{this.state.colrowStatus.row}&nbsp;&nbsp;Col:&nbsp;{this.state.colrowStatus.col}</div>
          </div>

          {/* <h1>Current table for parsing</h1>
          <div id="debug">{JSON.stringify(this.state.tableJsonOutput)}</div>
          <h1>this is rebuild test {this.state.colWidths}</h1>
          <div>
            {JSON.stringify(this.state.parsedData.render_json)}
            <br /> <br /><h1>colWidths</h1>
            {JSON.stringify(this.state.colWidths)}
            <br /> <br /><h1>MergeCells</h1>
            {JSON.stringify(this.state.mergeCells)}
            <br /> <br /><h1>Cell:</h1>
            {JSON.stringify(this.state.cellAlignments)}
          </div>
          <br /> */}
        </div>
      )
    }

    if (this.state.view === 'preview') {
      return (
        <div id="previewContainer" className="previewContainer">
          <h1>preview</h1>
          <div className="previewhtml" dangerouslySetInnerHTML={{ __html: this.state.previewHtml }}></div>
          <br />
          <button onClick={(e) => this.rebuildGrid()}>back</button> &nbsp;
          <button onClick={(e) => this.postRenderData('xlsx')}>preview xlsx</button> &nbsp;
          <button onClick={(e) => this.postRenderData('csv')}>preview csv</button> &nbsp;

      </div>
      )
    }



  }

}


export default GridContainer;

