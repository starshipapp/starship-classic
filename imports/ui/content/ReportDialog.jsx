import React from "react";
import {Dialog, Classes, Intent, AnchorButton, RadioGroup, Radio, TextArea, Label} from "@blueprintjs/core";
import "./css/ReportDialog.css";
import { ReportType } from "../../util/reportConsts";
import {ErrorToaster} from "../Toaster";

class ReportDialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reportType: null,
      details: ""
    };

    this.submitReport = this.submitReport.bind(this);
    this.setDetails = this.setDetails.bind(this);
    this.setReportType = this.setReportType.bind(this);
  }

  submitReport() {
    if(this.state.reportType === null) {
      ErrorToaster.show({message: "Please select a reason.", icon:"error", intent:Intent.DANGER});
      return;
    }
    Meteor.call("reports.insert", this.props.objectType, this.props.objectId, Number(this.state.reportType), this.state.details, this.props.userId);
    this.setState({
      reportType: null,
      details: ""
    });
    ErrorToaster.show({message: "Submitted report.", icon:"tick", intent:Intent.SUCCESS});
    this.props.onClose();
  }

  setDetails(e) {
    this.setState({
      details: e.target.value
    });
  }

  setReportType(e) {
    console.log(this.state.reportType);
    console.log(e.target.value);
    this.setState({
      reportType: e.target.value
    });
  }

  render() {
    return (
      <Dialog className="bp3-dark" title="Report" onClose={this.props.onClose} isOpen={this.props.isOpen}>
        <div className={Classes.DIALOG_BODY}>
          <b>Abusing the form *will* get you banned.</b>
          <Label>
            <span className="ReportDialog-reasonlabel">Reason for report:</span>
            <RadioGroup selectedValue={this.state.reportType} onChange={this.setReportType}>
              <Radio label="Harassment" value={String(ReportType.HARASSMENT)}/>
              <Radio label="Copyright Infringement" value={String(ReportType.COPYRIGHT)}/>
              <Radio label="Illegal Content" value={String(ReportType.ILLEGAL)}/>
              <Radio label="Spam" value={String(ReportType.SPAM)}/>
              <Radio label="Malware" value={String(ReportType.MALWARE)}/>
              <Radio label="NSFW Content" value={String(ReportType.NSFW)}/>
            </RadioGroup>
          </Label>
          <Label>
            Additional information:
            <TextArea className="ReportDialog-textarea" value={this.state.details} onChange={this.setDetails}/>
          </Label>
        </div>
        <div className={Classes.DIALOG_FOOTER}>
          <div className={Classes.DIALOG_FOOTER_ACTIONS}>
            <AnchorButton text="Report" intent={Intent.DANGER} onClick={this.submitReport}/>
          </div>
        </div>
      </Dialog>
    );
  }
}

export default ReportDialog;