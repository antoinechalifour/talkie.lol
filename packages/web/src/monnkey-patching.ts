const _oldAddTrack = MediaStream.prototype.addTrack;

MediaStream.prototype.addTrack = function (track: MediaStreamTrack) {
  const result = _oldAddTrack.call(this, track);
  const event = new MediaStreamTrackEvent("addtrack", { track });

  this.dispatchEvent(event);

  return result;
};

const _oldRemoveTrack = MediaStream.prototype.removeTrack;

MediaStream.prototype.removeTrack = function (track: MediaStreamTrack) {
  const result = _oldRemoveTrack.call(this, track);
  const event = new MediaStreamTrackEvent("removetrack", { track });

  this.dispatchEvent(event);

  return result;
};

export default {};
