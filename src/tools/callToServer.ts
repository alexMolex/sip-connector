import type SipConnector from '../SipConnector';
import log from '../logger';
import hasPurgatory from './hasPurgatory';
import resolveGetRemoteStreams from './resolveGetRemoteStreams';
import resolveHandleChangeTracks from './resolveHandleChangeTracks';
import resolveUpdateRemoteStreams from './resolveUpdateRemoteStreams';

type TDegradationPreference = 'balanced' | 'maintain-framerate' | 'maintain-resolution';

const resolveCallToServer = (sipConnector: SipConnector) => {
  const callToServer = async (parameters: {
    conference: string;
    mediaStream: MediaStream;
    extraHeaders?: string[] | undefined;
    iceServers?: RTCIceServer[];
    degradationPreference?: TDegradationPreference;
    setRemoteStreams: (streams: MediaStream[]) => void;
    onBeforeProgressCall?: (conference: string) => void;
    onSuccessProgressCall?: (parameters_: { isPurgatory: boolean }) => void;
    onEnterPurgatory?: () => void;
    onEnterConference?: (parameters_: { isSuccessProgressCall: boolean }) => void;
    onFailProgressCall?: () => void;
    onFinishProgressCall?: () => void;
    onEndedCall?: () => void;
  }): Promise<RTCPeerConnection> => {
    const {
      conference,
      mediaStream,
      extraHeaders,
      iceServers,
      degradationPreference,
      setRemoteStreams,
      onBeforeProgressCall,
      onSuccessProgressCall,
      onEnterPurgatory,
      onEnterConference,
      onFailProgressCall,
      onFinishProgressCall,
      onEndedCall,
    } = parameters;
    const updateRemoteStreams = resolveUpdateRemoteStreams({
      setRemoteStreams,
      getRemoteStreams: resolveGetRemoteStreams(sipConnector),
    });
    const handleChangeTracks = resolveHandleChangeTracks(updateRemoteStreams);

    log('callToServer', parameters);

    const startCall = async (): Promise<RTCPeerConnection> => {
      log('startCall');

      return sipConnector.call({
        mediaStream,
        extraHeaders,
        iceServers,
        degradationPreference,
        number: conference,
        ontrack: handleChangeTracks,
      });
    };
    let isSuccessProgressCall = false;
    let room: string;

    const subscribeEnterConference = () => {
      log('subscribeEnterConference: onEnterConference', onEnterConference);

      if (onEnterPurgatory ?? onEnterConference) {
        return sipConnector.onSession('enterRoom', (_room: string) => {
          log('enterRoom', { _room, isSuccessProgressCall });

          room = _room;

          if (hasPurgatory(room)) {
            if (onEnterPurgatory) {
              onEnterPurgatory();
            }
          } else if (onEnterConference) {
            onEnterConference({ isSuccessProgressCall });
          }
        });
      }

      return () => {};
    };

    const unsubscribeEnterConference = subscribeEnterConference();

    const onSuccess = (peerConnection: RTCPeerConnection): RTCPeerConnection => {
      log('onSuccess');

      isSuccessProgressCall = true;
      updateRemoteStreams();

      if (onSuccessProgressCall) {
        onSuccessProgressCall({ isPurgatory: hasPurgatory(room) });
      }

      sipConnector.onceRaceSession(['ended', 'failed'], () => {
        unsubscribeEnterConference();

        if (onEndedCall) {
          onEndedCall();
        }
      });

      return peerConnection;
    };

    const onFail = (error: Error): never => {
      log('onFail');

      if (onFailProgressCall) {
        onFailProgressCall();
      }

      unsubscribeEnterConference();

      throw error;
    };

    const onFinish = () => {
      log('onFinish');

      if (onFinishProgressCall) {
        onFinishProgressCall();
      }
    };

    log('onBeforeProgressCall');

    if (onBeforeProgressCall) {
      onBeforeProgressCall(conference);
    }

    return startCall().then(onSuccess).catch(onFail).finally(onFinish);
  };

  return callToServer;
};

export default resolveCallToServer;
