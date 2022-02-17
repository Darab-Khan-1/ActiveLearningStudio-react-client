/*eslint-disable*/
import React, { useEffect, useRef, useState } from 'react';
import HeadingTwo from 'utils/HeadingTwo/headingtwo';
import TabsHeading from 'utils/Tabs/tabs';
import { Tabs, Tab } from 'react-bootstrap';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import AddVideoImage from 'assets/images/svg/addvidobright.svg';
import AddVideoTube from 'assets/images/svg/youtube.svg';
import AddKaltura from 'assets/images/kaltura.jpg';
import BackButton from '../../../assets/images/left-arrow.svg';
import Buttons from 'utils/Buttons/buttons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import BrightcoveModel from '../model/brightmodel';
import UploadFile from '../../../utils/uploadselectfile/uploadfile';

const AddVideo = ({ setScreenStatus, showback, changeScreenHandler }) => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState('');
  const [showSidebar, setShowSidebar] = useState(true);
  const [platform, setplatform] = useState('');

  return (
    <>
      <BrightcoveModel
        show={modalShow}
        onHide={() => {
          setModalShow(false);
        }}
        setSelectedVideoId={setSelectedVideoId}
        showSidebar={showSidebar}
        platform={platform}
      />
      <div className="add-video-form">
        <div className="add-video-tabs">
          <TabsHeading text="1. Add a video" tabActive={true} />
          <TabsHeading text="2. Describe video" className="ml-10" />
          <TabsHeading text="3. Add interactions" className="ml-10" />
        </div>
        <div className="add-video-title-select upload-back-button">
          <div className="add-video-title">
            <HeadingTwo text="Add a video" color="#084892" />
          </div>
          {/* <div className="add-video-tour">
            <span>
              <FontAwesomeIcon icon={faClock} color="#084892" className="ml-9" />
              Tour
            </span>
          </div> */}
          {showback && (
            <div className="back-button" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }} onClick={() => changeScreenHandler('layout')}>
              <img style={{ marginRight: '8px' }} src={BackButton} alt="back button " />
              <p style={{ margin: 0 }} className="">
                Back to options
              </p>
            </div>
          )}
        </div>
        <div className="add-video-form-tabs">
          <Tabs className="main-tabs" defaultActiveKey="Mydevice" id="uncontrolled-tab-example">
            <Tab
              eventKey="Mydevice"
              title="My device"
              onClick={() => {
                setplatform('Mydevice');
              }}
            >
              {/* <UploadFile metadata={formData} formRef={formRef} /> */}
              <FormikVideo showback={showback} changeScreenHandler={changeScreenHandler} uploadFile platform={platform} />
            </Tab>
            <Tab
              eventKey="default"
              title="BrightCove"
              onClick={() => {
                setplatform('Brightcove');
                setShowSidebar(true);
              }}
            >
              <FormikVideo
                Input
                showback={showback}
                changeScreenHandler={changeScreenHandler}
                selectedVideoId={selectedVideoId}
                type={AddVideoImage}
                setScreenStatus={setScreenStatus}
                showBrowse
                setModalShow={setModalShow}
                platform={platform}
              />
            </Tab>

            <Tab
              eventKey="YouTube"
              title="YouTube"
              onClick={() => {
                setplatform('Youtube');
              }}
            >
              <FormikVideo Input platform={platform} showback={showback} changeScreenHandler={changeScreenHandler} type={AddVideoTube} setScreenStatus={setScreenStatus} />
            </Tab>
            <Tab
              eventKey="Kaltura"
              title="Kaltura"
              onClick={() => {
                setplatform('Kaltura');
                setShowSidebar(false);
              }}
            >
              <FormikVideo
                Input
                showBrowse
                setModalShow={setModalShow}
                showback={showback}
                changeScreenHandler={changeScreenHandler}
                type={AddKaltura}
                setScreenStatus={setScreenStatus}
                selectedVideoId={selectedVideoId}
                platform={platform}
              />
            </Tab>
            {/* <Tab eventKey="Vimeo" title="Vimeo"></Tab>
            <Tab eventKey="Kaltura" title="Kaltura"></Tab> */}
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AddVideo;

const FormikVideo = ({ platform, type, showback, selectedVideoId, showBrowse, setScreenStatus, setModalShow, changeScreenHandler, uploadFile, Input }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState('');
  const formRef = useRef();
  return (
    <div className="add-video-layout-formik">
      <Formik
        initialValues={{
          videoUrl: selectedVideoId,
        }}
        enableReinitialize
        innerRef={formRef}
        validate={(values) => {
          const errors = {};
          if (!values.videoUrl) {
            errors.videoUrl = 'Required';
          }
          return errors;
        }}
        onSubmit={(values) => {
          if (showback) {
            changeScreenHandler('describevideo');
          } else {
            setScreenStatus('DescribeVideo');
          }
          dispatch({
            type: 'ADD_VIDEO_URL',
            payload: values.videoUrl,
            platform: platform,
          });
        }}
        onSubmit={(values) => {
          setFormData(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          /* and other goodies */
        }) => (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="layout-title-formik-textField">
              {Input && (
                <>
                  <img src={type} />
                  <input type="text" name="videoUrl" placeholder="Enter video ID" onChange={handleChange} onBlur={handleBlur} value={values.videoUrl} />
                </>
              )}
              {showBrowse && (
                <Buttons
                  type="button"
                  primary={true}
                  text="Browse videos"
                  width="146px"
                  height="35px"
                  hover={true}
                  className="ml-32"
                  onClick={() => {
                    setModalShow(true);
                  }}
                />
              )}
            </div>
            <div className="error" style={{ color: 'red' }}>
              {errors.videoUrl && touched.videoUrl && errors.videoUrl}
            </div>

            <div className="describe-video">
              <Buttons type="submit" primary={true} text="Describe Video" width="149px" height="35px" hover={true} />
            </div>
          </form>
        )}
      </Formik>
      {uploadFile && <UploadFile metadata={formData} formRef={formRef} className />}
    </div>
  );
};
