import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import TextField from 'material-ui/TextField';
import Popover, { PopoverAnimationVertical } from 'material-ui/Popover';
import Functions from 'material-ui/svg-icons/editor/functions';
import RaisedButton from 'material-ui/RaisedButton';
import Cursores from 'cursores';
import ExpressionSelector from '../../InstructionOrExpressionSelector/ExpressionSelector';
const gd = global.gd;

const styles = {
  container: {
    display: 'flex',
    alignItems: 'baseline',
  },
  textFieldContainer: {
    flex: 1,
  },
  expressionSelector: {
    maxHeight: 250,
    overflowY: 'scroll',
    backgroundColor: 'white',
  },
  input: {
    fontFamily: '"Lucida Console", Monaco, monospace',
  },
  moreButton: {
    marginLeft: 10,
  },
};

export default class ExpressionField extends Component {
  _field = null;
  _fieldElement = null;
  _inputElement = null;
  //TODO: Factor \s\+\-\/\*\:\[\]\(\)\,\.
  cursores = new Cursores(
    /(?:^|[\s\+\-\/\*\:\[\]\(\)\,\.])([^\s\+\-\/\*\:\[\]\(\)\,\.]+)/,
    /([^\s\+\-\/\*\:\[\]\(\)\,\.]*)/
  );
  state = {
    open: false,
    completions: [],
  };

  componentDidMount() {
    if (this._field) {
      this._fieldElement = ReactDOM.findDOMNode(this._field);
      this._inputElement = this._field.getInputNode();
    }
  }

  focus() {
    if (this._field) this._field.focus();
  }

  _openExpressionPopover = () => {
    this.setState({
      open: true,
    });
  };

  _handleFocus = event => {
    // This prevents ghost click.
    event.preventDefault();

    this.setState({
      focusTextField: true,
    });
  };

  _handleBlur = () => {
    this.setState({
      focusTextField: false,
      open: false,
    });
  };

  _handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  _handleChange = (e, text) => {
    this.setState({
      open: true,
    });

    if (this.props.onChange) this.props.onChange(text);
    this._updateCompletions();
  };

  _handleMenuMouseDown = event => {
    console.log('_handleMenuMouseDown');
    // Keep the TextField focused
    event.preventDefault();
  };

  _handleExpressionChosen = (expressionInfo) => {
    console.log(expressionInfo);

    if (!this._inputElement) return;
    const cursorPosition = this._inputElement.selectionStart;
    console.log(cursorPosition);
    const { value } = this.props;

    const newValue = this.cursores.replace(
      value,
      cursorPosition,
      expressionInfo.name
    );
    if (this.props.onChange) this.props.onChange(newValue);
    setTimeout(() => {
      if (this._field) this._field.focus();
      if (this._inputElement)
        this._inputElement.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  getError = () => {
    const { project, layout } = this.props;

    const callbacks = new gd.CallbacksForExpressionCorrectnessTesting(
      project,
      layout
    );
    const parser = new gd.ExpressionParser(this.props.value);
    const isValid = parser.parseMathExpression(
      project.getCurrentPlatform(),
      project,
      layout,
      callbacks
    );
    const error = parser.getFirstError();
    parser.delete();
    callbacks.delete();

    return isValid ? null : error;
  };

  doValidation = () => {
    this.setState({ errorText: this.getError() });
  };

  render() {
    const { parameterMetadata } = this.props;
    const description = parameterMetadata
      ? parameterMetadata.getDescription()
      : undefined;


    const popoverStyle = {
      width: this._fieldElement ? this._fieldElement.clientWidth : 'auto',
    };

    return (
      <div style={styles.container}>
        <div style={styles.textFieldContainer}>
          <TextField
            value={this.props.value}
            floatingLabelText={description}
            inputStyle={styles.input}
            onChange={this._handleChange}
            ref={field => (this._field = field)}
            onFocus={this._handleFocus}
            onBlur={this._handleBlur}
            fullWidth
          />
          {this._fieldElement && (
            <Popover
              style={popoverStyle}
              open={this.state.open}
              canAutoPosition={false}
              anchorEl={this._fieldElement}
              useLayerForClickAway={false}
              anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
              targetOrigin={{ horizontal: 'left', vertical: 'top' }}
              onRequestClose={this._handleRequestClose}
              animation={PopoverAnimationVertical}
            >
              <ExpressionSelector
                style={styles.expressionSelector}
                selectedType=""
                onChoose={(type, expression) => {
                  console.log(type, expression)
                  this._handleExpressionChosen(expression);
                }}
              />
            </Popover>
          )}
        </div>
        <RaisedButton
          icon={<Functions />}
          primary
          style={styles.moreButton}
          onClick={this._openExpressionPopover}
        />
      </div>
    );
  }
}
