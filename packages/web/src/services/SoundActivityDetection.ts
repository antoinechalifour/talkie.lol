type onSoundActivityChangedListener = (hasSound: boolean) => void;

export class SoundActivityDetection {
  private readonly _analyzer: AnalyserNode;
  private readonly _fftBins: Float32Array;
  private _shouldAnalyze: boolean;
  private _hasSound: boolean;
  private _onSoundActivityChangedListeners: onSoundActivityChangedListener[] = [];

  constructor(mediaStream: MediaStream) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(mediaStream);

    this._analyzer = audioContext.createAnalyser();
    this._shouldAnalyze = false;
    this._hasSound = false;

    this._analyzer.smoothingTimeConstant = 0.6;

    source.connect(this._analyzer);

    const bufferLength = this._analyzer.frequencyBinCount;
    this._fftBins = new Float32Array(bufferLength);
  }

  start() {
    this._shouldAnalyze = true;
    this._runAnalysis();
  }

  stop() {
    this._shouldAnalyze = false;
  }

  onSoundActivityChanged(listener: onSoundActivityChangedListener) {
    this._onSoundActivityChangedListeners.push(listener);

    return () =>
      (this._onSoundActivityChangedListeners = this._onSoundActivityChangedListeners.filter(
        (x) => x !== listener
      ));
  }

  private _runAnalysis() {
    const maxVolume = this._getMaxVolume();

    if (maxVolume > -50 && !this._hasSound) {
      this._hasSound = true;
      this._notifySoundActivityChanged();
    } else if (maxVolume < -50 && this._hasSound) {
      this._hasSound = false;
      this._notifySoundActivityChanged();
    }

    if (this._shouldAnalyze) setTimeout(() => this._runAnalysis(), 100);
  }

  private _getMaxVolume() {
    let maxVolume = -Infinity;
    this._analyzer.getFloatFrequencyData(this._fftBins);

    for (let i = 4, ii = this._fftBins.length; i < ii; i++) {
      if (this._fftBins[i] > maxVolume && this._fftBins[i] < 0) {
        maxVolume = this._fftBins[i];
      }
    }

    return maxVolume;
  }

  private _notifySoundActivityChanged() {
    this._onSoundActivityChangedListeners.forEach((listener) =>
      listener(this._hasSound)
    );
  }
}
