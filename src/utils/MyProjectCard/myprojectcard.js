/*eslint-disable*/
import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import "./myprojectcard.scss";
import ActivityCardDropDown from "utils/ActivityCardDropDown/activitycarddropdown";
import ProjectPlayList from "utils/ProjectPlayList/projectplaylist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faShare } from "@fortawesome/free-solid-svg-icons";

const MyProjectCard = ({ className, backgroundImg, title }) => {
  const currikiUtility = classNames(
    "curriki-utility-myproject-card",
    className
  );
  return (
    <div className={currikiUtility}>
      <div
        className="myproject-card-top"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        <div className="myproject-card-dropdown">
          <ActivityCardDropDown iconColor="white" />
        </div>
        <div className="myproject-card-title">
          <h2>{title}</h2>
        </div>
      </div>
      <div className="myproject-card-detail">
        <p>
          Within the six categories, there are over 50 learning activity types.
          These range from Interactive Video, Flashcards.
        </p>
      </div>
      <div className="myproject-card-status">
        <p>
          <span></span> Published
        </p>
      </div>
      <div className="myproject-card-add-share">
        <button style={{ width: "86px", height: "32px", marginRight: "24px" }}>
          <FontAwesomeIcon
            icon={faPlus}
            style={{ marginRight: "20px" }}
            color="#084892"
          />
          Add
        </button>
        <button style={{ width: "108px", height: "32px" }}>
          <FontAwesomeIcon
            icon={faShare}
            style={{ marginRight: "20px" }}
            color="#084892"
          />
          Share
        </button>
      </div>
    </div>
  );
};

MyProjectCard.propTypes = {
  className: PropTypes.string,
  backgroundImg: PropTypes.string,
  title: PropTypes.string,
};

export default MyProjectCard;
