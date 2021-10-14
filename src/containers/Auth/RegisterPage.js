import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import validator from 'validator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Swal from 'sweetalert2';
import QueryString from 'query-string';
import bg from 'assets/images/loginbg.png';
import bg1 from 'assets/images/loginbg2.png';
import loader from 'assets/images/loader.svg';
import leftArrow from 'assets/images/left-arrow.svg';
import { GoogleLogin } from 'react-google-login';
import googleIcon from 'assets/images/google.png';
import { registerAction, loadOrganizationTypesAction, googleLoginAction } from 'store/actions/auth';
import { getErrors } from 'utils';
import { Tabs, Tab } from 'react-bootstrap';
import Error from './Error';
import Logo from './Logo';

import './style.scss';
// eslint-disable-next-line no-restricted-globals
const query = QueryString.parse(location.search);

class RegisterPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      organizationName: '',
      organizationType: '',
      jobTitle: '',
      clicked: '',
      error: null,
      googleResponse: null,
      activeTab: 'Sign up',
      stepper: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);

    const { loadOrganizationTypes } = this.props;
    loadOrganizationTypes();
    if (query?.email) {
      // eslint-disable-next-line no-unused-expressions
      validator.isEmail(query.email) && this.setState({ email: query?.email });
    }
  }

  onChangeField = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSubmit = async (e) => {
    e.preventDefault();
    const { googleResponse } = this.state;
    try {
      if (googleResponse) {
        this.onGoogleLoginSuccess(googleResponse);
      } else {
        const {
          firstName,
          lastName,
          email,
          password,
          organizationName,
          organizationType,
          jobTitle,
        } = this.state;
        const { history, register } = this.props;
        const { domain } = this.props;
        const data = {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          password: password.trim(),
          organization_name: organizationName.trim(),
          organization_type: organizationType.trim(),
          job_title: jobTitle.trim(),
          domain: domain?.domain,
        };
        const message = await register(data);

        Swal.fire({
          icon: 'success',
          title: 'YOU ARE REGISTERED!',
          html: message,
          showConfirmButton: true,
          confirmButtonText: 'Login to CurrikiStudio',
        })
          .then((result) => {
            if (result.isConfirmed) {
              history.push(`/login/${domain?.domain}`);
            }
          });
      }
      // history.push('/login');
    } catch (err) {
      this.setState({
        error: getErrors(err),
      });
    }
  };

  isDisabledSignUp = () => {
    const {
      firstName,
      lastName,
      email,
      password,
    } = this.state;

    return validator.isEmpty(firstName.trim())
      || validator.isEmpty(lastName.trim())
      || validator.isEmpty(email.trim())
      || validator.isEmpty(password.trim());
  };

  isDisabled = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      organizationName,
      jobTitle,
      organizationType,
    } = this.state;

    return validator.isEmpty(firstName.trim())
      || validator.isEmpty(lastName.trim())
      || validator.isEmpty(email.trim())
      || validator.isEmpty(password.trim())
      || validator.isEmpty(organizationName.trim())
      || validator.isEmpty(jobTitle.trim())
      || validator.isEmpty(organizationType.trim());
  };

  isDisabledGoogle = () => {
    const {
      organizationName,
      jobTitle,
      organizationType,
    } = this.state;

    return validator.isEmpty(organizationName.trim())
      || validator.isEmpty(jobTitle.trim())
      || validator.isEmpty(organizationType.trim());
  };

  onGoogleLoginSuccess = (response) => {
    const { organizationName, jobTitle, organizationType } = this.state;
    console.log(organizationName, jobTitle, organizationType);
    const { googleLogin } = this.props;
    if (organizationName && jobTitle && organizationType) {
      const result = googleLogin({
        ...response,
        organizationName,
        jobTitle,
        organizationType,
      });
      result.catch((err) => {
        this.setState({
          error: getErrors(err),
        });
      });
    }
  };

  onGoogleLoginFailure = (response) => {
    console.log(response);
  };

  goToLogin = () => {
    const { history, domain } = this.props;
    if (domain) {
      history.push(`/login/${domain?.domain}`);
    } else {
      history.push('/login');
    }
  };

  validatePassword = (pwd) => {
    // eslint-disable-next-line quotes
    const regex = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$");
    return regex.test(pwd);
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      password,
      organizationName,
      jobTitle,
      error,
      organizationType,
      clicked,
      activeTab,
      stepper,
      googleResponse,
    } = this.state;
    const {
      isLoading, organizationTypes, domain,
    } = this.props;

    return (
      <>
        {
          domain?.self_registration === true && (
            <div className="auth-page">
              <Logo />

              <div className="auth-container">
                <div className="d-flex align-items-center justify-content-between">
                  <h1 className="auth-title ">
                    Welcome
                    {!clicked ? ' to Curriki' : `, ${firstName}`}
                  </h1>

                  {/* <strong>OR</strong> */}

                  {/* <button
                  type="button"
                  className="btn btn-outline-primary text-uppercase"
                  onClick={this.goToLogin}
                >
                  Login
                </button> */}
                </div>

                <p className="auth-description text-left">
                  {!clicked
                    ? 'Sign up and start making a difference in the way learning experiences are created.'
                    : 'Before start creating awesome content, please let us know the usage your are giving to Curriki. '}
                </p>
                <Tabs
                  defaultActiveKey={activeTab}
                  activeKey={activeTab}
                  id="uncontrolled-tab-example"
                  style={{ display: stepper ? 'none' : 'flex' }}
                  onSelect={(key) => {
                    this.setState({ activeTab: key });
                    if (key === 'Log in') this.goToLogin();
                  }}
                >
                  <Tab eventKey="Log in" title="Log in" />
                  <Tab eventKey="Sign up" title="Sign up" style={{ display: stepper ? 'none' : 'flex' }}>
                    <form
                      onSubmit={this.onSubmit}
                      autoComplete="off"
                      className="auth-form"
                    >
                      {!clicked
                        && (
                          <>
                            <div className="form-group d-flex">
                              <div className="input-wrapper">
                                <FontAwesomeIcon icon="user" />
                                <input
                                  autoFocus
                                  className="input-box"
                                  name="firstName"
                                  placeholder="First Name*"
                                  required
                                  maxLength="250"
                                  value={firstName}
                                  onChange={this.onChangeField}
                                />
                              </div>

                              <div className="input-wrapper">
                                <FontAwesomeIcon icon="user" />
                                <input
                                  className="input-box"
                                  name="lastName"
                                  placeholder="Last Name*"
                                  required
                                  maxLength="250"
                                  value={lastName}
                                  onChange={this.onChangeField}
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <FontAwesomeIcon icon="envelope" />
                              <input
                                className="input-box"
                                // type="email"
                                name="email"
                                placeholder="Email*"
                                required
                                maxLength="250"
                                disabled={query?.email && true}
                                value={email}
                                onChange={this.onChangeField}
                              />
                            </div>

                            <div className="form-group">
                              <FontAwesomeIcon icon="lock" />
                              <input
                                className="password-box"
                                type="password"
                                name="password"
                                placeholder="Password*"
                                required
                                maxLength="250"
                                value={password}
                                onChange={this.onChangeField}
                              />
                              <p>8 characters minimum. Use a number, one uppercase & one lowercase at least</p>
                            </div>
                            <div className="form-group">
                              <Error error={error} />
                            </div>
                            <div className="form-group mb-0">
                              <button
                                type="button"
                                className="signUp-btn submit"
                                onClick={() => {
                                  const passwordValidator = this.validatePassword(password);
                                  const emailValidator = validator.isEmail(email.trim());
                                  if (passwordValidator && emailValidator) {
                                    this.setState({
                                      clicked: true,
                                      error: null,
                                      stepper: true,
                                    });
                                  } else if (!passwordValidator) {
                                    this.setState({
                                      error: 'Password must be 8 or more characters long,should contain at least 1 Uppercase, 1 Lowercase and 1 Numeric character.',
                                    });
                                  } else if (!emailValidator) {
                                    this.setState({
                                      error: 'Please input valid email.',
                                    });
                                  }
                                }}
                                disabled={isLoading || this.isDisabledSignUp()}
                              >
                                {isLoading ? (
                                  <img src={loader} alt="" />
                                ) : (
                                  'Sign up with Email'
                                )}
                              </button>
                            </div>
                            {/* <div className="vertical-line">
                              <div className="line" />
                              <p className="line-or">or</p>
                              <div className="line" />
                            </div> */}
                            <div className="form-group text-center mb-0">
                              <GoogleLogin
                                clientId={global.config.gapiClientId}
                                theme="dark"
                                render={(renderProps) => (
                                  <button type="button" className="google-button" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                                    <img src={googleIcon} alt="googleIcon" style={{ float: 'left' }} />
                                    Sign up with Google
                                  </button>
                                )}
                                onSuccess={(response) => {
                                  this.setState({ stepper: true, googleResponse: response });
                                  // this.onGoogleLoginSuccess(response);
                                }}
                                onFailure={this.onGoogleLoginFailure}
                                // eslint-disable-next-line max-len
                                scope="https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.topics https://www.googleapis.com/auth/classroom.coursework.me https://www.googleapis.com/auth/classroom.coursework.students"
                                cookiePolicy="single_host_origin"
                              />
                            </div>
                            {/* <p className="auth-description text-center">
                              Back to Curriki?&nbsp;
                              <a onClick={this.goToLogin}>
                                Login
                              </a>
                            </p> */}

                            <div className="termsandcondition">
                              By clicking the &quot;Sign Up&quot; button, you are creating a CurrikiStudio  account, and you agree to Curriki&apos;s
                              {' '}
                              <a href="https://www.curriki.org/terms-of-service/">
                                Terms of Use
                              </a>
                              {' '}
                              and
                              {' '}
                              <a href="https://www.curriki.org/privacy-policy/">
                                Privacy Policy.
                              </a>
                            </div>

                          </>
                        )}
                    </form>
                  </Tab>
                </Tabs>
                {stepper && (
                  <>
                    <div className="form-group">
                      <div className="bkbtn">
                        {/* <button type="button" onClick={() => this.setState({ clicked: false, stepper: false })}> */}
                        <img src={leftArrow} alt="arrow-left" />
                        <a onClick={() => this.setState({ clicked: false, stepper: false })}> Back </a>
                        {/* </button> */}
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="using-curriki">
                        <div className="curriki-line">You are using Curriki for:</div>
                        <div className="line-horizontal" />
                      </div>
                    </div>
                    <div className="form-group ">
                      <FontAwesomeIcon icon="building" />
                      <select
                        className="input-box organization-type"
                        name="organizationType"
                        placeholder="Organization Type*"
                        value={organizationType}
                        onChange={this.onChangeField}
                      >
                        <option selected value=""> -- Select an Organization Type -- </option>

                        {organizationTypes.map((type) => (
                          <option value={type.label}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <FontAwesomeIcon icon="building" />
                      <input
                        className="input-box"
                        name="organizationName"
                        placeholder="Organization Name*"
                        maxLength="250"
                        value={organizationName}
                        onChange={this.onChangeField}
                      />
                    </div>
                    <div className="form-group">
                      <FontAwesomeIcon icon="briefcase" />
                      <input
                        className="input-box"
                        name="jobTitle"
                        placeholder="Job Title*"
                        maxLength="250"
                        value={jobTitle}
                        onChange={this.onChangeField}
                      />
                    </div>
                    <div className="form-group mb-0">
                      <button
                        type="submit"
                        className="btn-primary submit get-started-btn"
                        onClick={(e) => {
                          this.setState({ clicked: true });
                          this.onSubmit(e);
                        }}
                        disabled={isLoading || (googleResponse ? this.isDisabledGoogle() : this.isDisabled())}
                      >
                        {isLoading ? (
                          <img src={loader} alt="" />
                        ) : (
                          'Complete Registration'
                        )}
                      </button>
                    </div>
                  </>
                )}
              </div>

              <img src={bg} className="bg1" alt="" />
              <img src={bg1} className="bg2" alt="" />
            </div>
          )
        }
      </>
    );
  }
}

RegisterPage.propTypes = {
  history: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  organizationTypes: PropTypes.array.isRequired,
  register: PropTypes.func.isRequired,
  googleLogin: PropTypes.func.isRequired,
  loadOrganizationTypes: PropTypes.func.isRequired,
  domain: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  register: (data) => dispatch(registerAction(data)),
  loadOrganizationTypes: () => dispatch(loadOrganizationTypesAction()),
  googleLogin: (data) => dispatch(googleLoginAction(data)),

});

const mapStateToProps = (state) => ({
  isLoading: state.auth.isLoading,
  organizationTypes: state.auth.organizationTypes,
  domain: state?.organization?.currentOrganization,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RegisterPage),
);
