import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert } from 'react-bootstrap';

import { loadGroupsAction } from 'store/actions/group';
// import Header from 'components/Header';
// import Sidebar from 'components/Sidebar';
import Footer from 'components/Footer';
import { Link, useHistory } from 'react-router-dom';
// import Swal from 'sweetalert2';
import CreateGroup from './CreateGroup';
import GroupView from './GroupCard';
import GroupMemberView from './GroupMemberView';
import GroupProjectView from './GroupProjectView';
import ChannelPanel from './Channel';

import './style.scss';

// TODO: need to remove after connect API
const breadCrumbData = {
  creation: 'group/create group',
  editMode: 'edit team',
  projectShow: 'projects',
  channelShow: 'projects',
  groupShow: 'groups',
};

function GroupPage(props) {
  const {
    location,
    groups,
    overview,
    creation,
    groupShow,
    editMode,
    projectShow,
    channelShow,
    loadGroups,
  } = props;
  const organization = useSelector((state) => state.organization);
  const { activeOrganization, permission } = organization;
  const [alertCheck, setAlertCheck] = useState(false);
  const [breadCrumb, setBreadCrumb] = useState([]);
  const history = useHistory();
  useEffect(() => {
    (async () => {
      // if (activeOrganization && overview && !creation && !editMode && permission?.Group?.includes('group:view')) {
      //   Swal.showLoading();
      //   await loadGroups();
      //   Swal.close();
      // } else {
      //   await loadGroups();
      // }
      if (activeOrganization && permission?.Group) {
        await loadGroups();
        setAlertCheck(true);
      }
    }
    )();
  }, [loadGroups, activeOrganization, permission?.Group]);

  const status = creation
    ? 'creation'
    : editMode
      ? 'editMode'
      : groupShow
        ? 'groupShow'
        : projectShow
          ? 'projectShow'
          : overview
            ? 'groupShow'
            : 'channelShow';

  const groupId = parseInt(location.pathname.split('groups/')[1], 10);
  const selectedGroup = groups.find((group) => group.id === groupId);

  useEffect(() => {
    let crumb = breadCrumbData[status];

    if (groupShow && selectedGroup) {
      crumb += (`/${selectedGroup.name} Members`);
    }

    setBreadCrumb(crumb.split('/'));
  }, [selectedGroup, status, groupShow, groups]);

  if (location.pathname.includes('groups/') && !selectedGroup && !creation) {
    return <></>;
  }

  const title = {
    creation: 'Create Group',
    editMode: 'Edit Team',
    groupShow: `${selectedGroup ? selectedGroup.name : 'Group'} Members`,
    projectShow: `${selectedGroup ? selectedGroup.name : 'Group'} Projects`,
    channelShow: 'Channels',
  };
  const goBack = () => {
    history.goBack();
  };
  return (
    <>
      <div className="side-wrapper-group">
        <div className="bread-crumb">
          {breadCrumb.map((node, index, these) => (
            <div key={node}>
              <span className={index + 1 < these.length ? 'parent' : 'child'}>
                {node}
              </span>
              {index + 1 < these.length && (
                <FontAwesomeIcon icon="angle-right" />
              )}
            </div>
          ))}
          <Link className="back-button-main-page" onClick={goBack}>
            <FontAwesomeIcon icon="chevron-left" />
            Back
          </Link>
        </div>
      </div>
      <div className="groups-page">

        <div className="content-wrapper">
          <div className="content">
            <div className="row">
              <h1 className={`title${projectShow ? ' project-title' : ''}${channelShow ? ' channel-title' : ''}`}>
                {overview ? 'Groups' : (title[status] || 'Groups')}
              </h1>

              {projectShow && (
                <></>
              )}
            </div>
            {overview && (
              <div className="row overview">
                {permission?.Group?.includes('group:view') ? (
                  <>
                    {groups.length > 0 ? groups.map((group) => (
                      <GroupView key={group.id} group={group} />
                    )) : !alertCheck
                      ? <Alert className="alert-space" variant="primary">Loading...</Alert>
                      : <Alert className="alert-space" variant="warning">No group available. </Alert>}
                  </>
                ) : <Alert className="alert-space" variant="danger">You are not authorized to view groups.</Alert> }
              </div>
            )}

            {(creation || editMode) && (
              <div className="row sub-content"><CreateGroup editMode={editMode} selectedGroup={selectedGroup} /></div>
            )}

            {groupShow && selectedGroup && (
              <GroupMemberView group={selectedGroup} />
            )}

            {projectShow && selectedGroup && (
              <GroupProjectView group={selectedGroup} />
            )}

            {channelShow && selectedGroup && (
              <ChannelPanel />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

GroupPage.propTypes = {
  location: PropTypes.object.isRequired,
  groups: PropTypes.array.isRequired,
  overview: PropTypes.bool,
  creation: PropTypes.bool,
  editMode: PropTypes.bool,
  groupShow: PropTypes.bool,
  projectShow: PropTypes.bool,
  channelShow: PropTypes.bool,
  loadGroups: PropTypes.func.isRequired,
};

GroupPage.defaultProps = {
  overview: false,
  creation: false,
  editMode: false,
  groupShow: false,
  projectShow: false,
  channelShow: false,
};

const mapStateToProps = (state) => ({
  groups: state.group.groups,
});

const mapDispatchToProps = (dispatch) => ({
  loadGroups: () => dispatch(loadGroupsAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupPage);