var React = global.React || require('react');
var PropTypes = require('prop-types');
var utils = require('./utils.js');

const convertValidationsToObject = (validations) => {
  if (typeof validations === 'string') {

    return validations.split(/\,(?![^{\[]*[}\]])/g).reduce(function (validations, validation) {
      var args = validation.split(':');
      var validateMethod = args.shift();

      args = args.map(function (arg) {
        try {
          return JSON.parse(arg);
        } catch (e) {
          return arg; // It is a string if it can not parse it
        }
      });

      if (args.length > 1) {
        throw new Error('Formsy does not support multiple args on string validations. Use object format of validations instead.');
      }

      validations[validateMethod] = args.length ? args[0] : true;
      return validations;
    }, {});

  }

  return validations || {};
};

export default (Component) => class extends React.Component {
  state = {
    _value: this.props.value,
    _isRequired: false,
    _isValid: true,
    _isPristine: true,
    _pristineValue: this.props.value,
    _validationError: [],
    _externalError: null,
    _formSubmitted: false
  }

  static defaultProps = {
    validationError: '',
    validationErrors: {}
  }

  static contextTypes = {
    formsy: PropTypes.object // What about required?
  }

  componentWillMount() {
    var configure = () => {
      this.setValidations(this.props.validations, this.props.required);

      // Pass a function instead?
      this.context.formsy.attachToForm(this);
      //this.props._attachToForm(this);
    };

    if (!this.props.name) {
      throw new Error('Form Input requires a name property when used');
    }

    /*
    if (!this.props._attachToForm) {
      return setTimeout(function () {
        if (!this.isMounted()) return;
        if (!this.props._attachToForm) {
          throw new Error('Form Mixin requires component to be nested in a Form');
        }
        configure();
      }.bind(this), 0);
    }
    */
    configure();
  }

  // We have to make the validate method is kept when new props are added
  componentWillReceiveProps(nextProps) {
    this.setValidations(nextProps.validations, nextProps.required);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const propsChanged = !utils.isSame(this.props, nextProps);
    const stateChanged = !utils.isSame(this.state, nextState);
    return propsChanged || stateChanged;
  }

  componentDidUpdate(prevProps) {
    // If the value passed has changed, set it. If value is not passed it will
    // internally update, and this will never run
    if (!utils.isSame(this.props.value, prevProps.value)) {
      this.setValue(this.props.value);
    }

    // If validations or required is changed, run a new validation
    if (!utils.isSame(this.props.validations, prevProps.validations) || !utils.isSame(this.props.required, prevProps.required)) {
      this.context.formsy.validate(this);
    }
  }

  // Detach it when component unmounts
  componentWillUnmount() {
    this.context.formsy.detachFromForm(this);
    //this.props._detachFromForm(this);
  }

  render() {
    const props = {
      setValidations: this.setValidations,
      setValue: this.setValue,
      resetValue: this.resetValue,
      getValue: this.getValue,
      hasValue: this.hasValue,
      getErrorMessage: this.getErrorMessage,
      getErrorMessages: this.getErrorMessages,
      isFormDisabled: this.isFormDisabled,
      isValid: this.isValid,
      isPristine: this.isPristine,
      isFormSubmitted: this.isFormSubmitted,
      isRequired: this.isRequired,
      showRequired: this.showRequired,
      showError: this.showError,
      isValidValue: this.isValidValue,
      ...this.props
    };

    return <Component {...props} />
  }

  setValidations = (validations, required) => {
    // Add validations to the store itself as the props object can not be modified
    this._validations = convertValidationsToObject(validations) || {};
    this._requiredValidations = required === true ? {isDefaultRequiredValue: true} : convertValidationsToObject(required);
  }

  // We validate after the value has been set
  setValue = (value) => {
    this.setState({
      _value: value,
      _isPristine: false
    },  () => {
      this.context.formsy.validate(this);
      //this.props._validate(this);
    });
  }

  resetValue = () => {
    this.setState({
      _value: this.state._pristineValue,
      _isPristine: true
    }, () => {
      this.context.formsy.validate(this);
      //this.props._validate(this);
    });
  }

  getValue = () => {
    return this.state._value;
  }

  hasValue = () => {
    return this.state._value !== '';
  }

  getErrorMessage = () => {
    var messages = this.getErrorMessages();
    return messages.length ? messages[0] : null;
  }

  getErrorMessages = () => {
    return !this.isValid() || this.showRequired() ? (this.state._externalError || this.state._validationError || []) : [];
  }

  isFormDisabled = () => {
    return this.context.formsy.isFormDisabled();
    //return this.props._isFormDisabled();
  }

  isValid = () => {
    return this.state._isValid;
  }

  isPristine = () => {
    return this.state._isPristine;
  }

  isFormSubmitted = () => {
    return this.state._formSubmitted;
  }

  isRequired = () => {
    return !!this.props.required;
  }

  showRequired = () => {
    return this.state._isRequired;
  }

  showError = () => {
    return !this.showRequired() && !this.isValid();
  }

  isValidValue = (value) => {
    return this.context.formsy.isValidValue.call(null, this, value);
    //return this.props._isValidValue.call(null, this, value);
  }
};
