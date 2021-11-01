export const HEADER_CONTENT_TYPE_NAME = 'content-type';
export const HEADER_CONTENT_TYPE_MAIN_CAM = 'application/vinteo.webrtc.maincam';

export const HEADER_CONTENT_ENTER_ROOM = 'x-webrtc-enter-room';
export const CONTENT_TYPE_SHARE_STATE = 'application/vinteo.webrtc.sharedesktop';
export const CONTENT_TYPE_ENTER_ROOM = 'application/vinteo.webrtc.roomname';
export const CONTENT_TYPE_CHANNELS = 'application/vinteo.webrtc.channels';
export const HEADER_INPUT_CHANNELS = 'X-WEBRTC-INPUT-CHANNELS';
export const HEADER_OUTPUT_CHANNELS = 'X-WEBRTC-OUTPUT-CHANNELS';
export const HEADER_MAIN_CAM = 'X-WEBRTC-MAINCAM';
export const HEADER_MAIN_CAM_RESOLUTION = 'X-WEBRTC-MAINCAM-RESOLUTION';

export const CONTENT_TYPE_NOTIFY = 'application/vinteo.webrtc.notify';
export const HEADER_NOTIFY = 'X-VINTEO-NOTIFY';

export const HEADER_CONTENT_SHARE_STATE = 'x-webrtc-share-state';
export const HEADER_START_PRESENTATION = `${HEADER_CONTENT_SHARE_STATE}: LETMESTARTPRESENTATION`;
export const HEADER_STOP_PRESENTATION = `${HEADER_CONTENT_SHARE_STATE}: STOPPRESENTATION`;
export const AVAILABLE_SECOND_REMOTE_STREAM = 'YOUCANRECEIVECONTENT';
export const NOT_AVAILABLE_SECOND_REMOTE_STREAM = 'CONTENTEND';
export const MUST_STOP_PRESENTATION = 'YOUMUSTSTOPSENDCONTENT';
export const HEADER_START_PRESENTATION_P2P = `${HEADER_CONTENT_SHARE_STATE}: ${AVAILABLE_SECOND_REMOTE_STREAM}`;
export const HEADER_STOP_PRESENTATION_P2P = `${HEADER_CONTENT_SHARE_STATE}: ${NOT_AVAILABLE_SECOND_REMOTE_STREAM}`;
