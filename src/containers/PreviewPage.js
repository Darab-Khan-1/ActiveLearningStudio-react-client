import React from "react";
import { connect } from "react-redux";
import validator from "validator";

import { withRouter } from 'react-router-dom';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


import Header from "../components/Header/Header";
import CreatePlaylistPopup from "../components/CreatePlaylistPopup/CreatePlaylistPopup";
import Sidebar from "../components/Sidebar/Sidebar";

import { startLogin } from "../actions/auth";
import { createPlaylistAction, deletePlaylistAction, showCreatePlaylistModalAction, hideCreatePlaylistModalAction } from "../actions/playlist";
import { showCreateProjectSubmenuAction, showCreateProjectModalAction, hideCreateProjectModalAction, createProjectAction, loadMyProjectsAction} from "../actions/project";
import NewResourcePage from "./NewResourcePage";
import { NewProjectPage } from "./NewProjectPage";

import ProjectCard from "../components/ProjectCard";
import ProjectPreviewModal from "../components/ProjectPreviewModal";
import ProjectPreview from "../components/ProjectPreview";
import ResourcePreview from "../components/ResourcePreview";
import PlaylistPreview from "../components/PlaylistPreview";


export class PreviewPage extends React.Component {
  constructor(props) {
    super(props);



    

    //binding escape function for modal close
    // this.escFunction = this.escFunction.bind(this);


  }
  escFunction(event) {
    if (event.keyCode === 27) {
      this.props.hideCreatePlaylistModal();
      this.props.history.push("/");
    }
  }


 

  componentDidMount() {
    //scroll to top
    window.scrollTo(0, 0);
    this.props.loadMyProjectsAction();
  }



  render() {
    const { projects } = this.props.project;

    if (this.props.previewType == 'resource')
      var content = (<ResourcePreview resourceid={this.props.match.params.resourceid} />);
    else if (this.props.previewType == 'playlist')
      var content = (<PlaylistPreview playlistid={this.props.match.params.playlistid} />);
    else 
      var content = (<ProjectPreview {...this.props} key={this.props.match.params.projectid} project={this.props.project }/>);

    return (
      <div>
        <Header {...this.props} />
        <div className="main-content-wrapper">
          <div className="sidebar-wrapper">
            {/* <Sidebar /> */}
          </div>
          <div className="content-wrapper">
            <div className="content">
              {content}
            </div>
            </div>
          </div>
      </div>

    );
  }
}

const mapDispatchToProps = dispatch => ({
  showCreateProjectModalAction: () => dispatch(showCreateProjectModalAction()),
  loadMyProjectsAction: () =>dispatch(loadMyProjectsAction()),
  createProjectAction: (name, description, thumb_url) =>dispatch(createProjectAction(name, description, thumb_url)),
  // hideCreateProjectModalAction: () => dispatch(hideCreateProjectModalAction()),
  showCreateProjectSubmenuAction: () => dispatch(showCreateProjectSubmenuAction())

});

const mapStateToProps = (state) => {
  return {
    project: state.project
  };
}




export default withRouter(connect(mapStateToProps,
  mapDispatchToProps)(PreviewPage))