import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

const PUSH_ENDPOINT = 'https://order.posindonesia.co.id/api/qob/pushToken';

export default async function registerForPushNotificationsAsync(userid) {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  // console.log(status);
  // only asks if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  // On Android, permissions are granted on app installation, so
  // `askAsync` will never prompt the user

  // Stop here if the user did not grant permissions
  if (status !== 'granted') {
    alert('No notification permissions!');
    return;
  }

  // Get the token that identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  // POST the token to your backend server from where you can retrieve it to send push notifications.
  return fetch(PUSH_ENDPOINT, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      userid: userid
    }),
  })
  .then(response => response.json())
  .then(res => {
    console.log(res);
    return res;
  })
  .catch(err => err.response);
}
