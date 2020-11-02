import Echo from 'laravel-echo';
import notification from 'services/notification.service';
import socketConnection from 'services/http.service';
import * as actionTypes from '../actionTypes';

export const getAllnotification = () => async (dispatch) => {
  const notificationData = await notification.allNotifications();
  if (notificationData) {
    dispatch({
      type: actionTypes.ADD_ALL_NOTIFICATIONS,
      payload: notificationData,
    });
  }
};

export const clearAllNotification = () => async (dispatch) => {
  dispatch({
    type: actionTypes.CLEAR_ALL_NOTIFICATION,
  });
};

export const cloneDuplicationRequest = (userId) => async (dispatch) => {
  const echo = new Echo(socketConnection.notifcatonSocket());
  echo.private(`user-channel.${userId}`).listen('.UserEvent', (ev) => {
    const addedData = {
      data: {
        message: ev.message,
      },
    };
    dispatch({
      type: actionTypes.ADD_SINGLE_NOTIFICATION,
      newNotifications: addedData,
    });
  });
};